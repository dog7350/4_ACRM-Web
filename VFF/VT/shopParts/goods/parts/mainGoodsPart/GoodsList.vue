<template>
    <div id="GoodsListRootWrapper" class="container-fluid m-0 p-0 d-flex flex-column justify-content-around">
        <div class="container-fluid m-0 pb-3 px-0 text-center fspll">

        </div>
        <div class="container-fluid d-flex flex-wrap justify-content-center" id="GoodsSearchBox">
            <select name="" id="" v-model="params.searchNumber">
                <option value="0">전체</option>
                <option value="1">제목</option>
                <option value="2">내용</option>
                <option value="3">작성자</option>
            </select>
            <input @keypress.enter="methods.getGoodsListDebounced(true)"
            class="mx-5 w-50" type="text" v-model="params.searchContent">
            <input @click="methods.getGoodsListDebounced(true)"
            type="button" value="검색">
        </div>
        <div id="GoodsListWrapper" class="container-fluid m-0 p-0 d-flex flex-column justify-content-center">
            <div class="container-fluid m-0 pb-3 px-0 text-center fspll">

            </div>
            <transition-group name="multipleBoardList" mode="out-in" class="container-fluid m-0 py-0 px-3" tag="ul" style="listStyle:none;">
                <li v-for="item, index in params.list" :key="index">
                    <GoodsEntran :data="item"/>
                </li>
            </transition-group>

            <transition name="fast-fade" mode="out-in">
                <div class="container-fluid m-0 pt-3 px-0 text-center fspll" v-if="params.searchStatus === 0">
                    로딩중
                </div>
                <div class="container-fluid d-flex flex-wrap m-0 pt-3 px-0 text-center fspll" v-else-if="params.searchStatus === 1">
                    <div class="container-fluid m-0 p-0 text-center fspll" v-if="params.list.length === 0">
                        더 이상 굿즈가 존재하지 않습니다.
                    </div>
                    <div @click="methods.getGoodsListDebounced(false)"
                    class="container-fluid mx-3 my-3 p-0 text-center fspll btn btn-light" v-else-if="params.listEnd">
                        더 보기
                    </div>
                </div>
                
            </transition>
            
        </div>

        <div>

        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import axios from 'axios';
import { debounce } from 'lodash';

import GoodsEntran from './GoodsEntran.vue';


export default {
    name: "GoodsList",
    components: {
        GoodsEntran
    },
    props: {

    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            list: [], searchNumber: 0, searchContent: '', isChange: true, searchStatus: 0, listEnd: true,
            lastSearchInfo: {
                name: '',
                title: '',
                content: '',
                order: 0,
                page: -1,
            }
        });

        const methods = {
            getGoodsList: async (isChange = false)=>{
                try{
                    params.value.searchStatus = 0;

                    if(params.value.isChange || isChange){
                        params.value.isChange = false;

                        params.value.lastSearchInfo = {
                            name: '',
                            title: '',
                            content: '',
                            order: 0,
                            page: -1,
                        };

                        params.value.list = [];
                        params.value.listEnd = true;
                    }

                    params.value.searchContent += "";
                    // console.log(params.value.searchNumber, params.value.searchContent, params.value.searchContent.length);

                    let query = {
                        name: params.value.searchNumber == 3? params.value.searchContent: '',
                        title: params.value.searchNumber == 1? params.value.searchContent: '',
                        content: params.value.searchNumber == 2? params.value.searchContent: '',
                        order: params.value.lastSearchInfo.order,
                        page: params.value.lastSearchInfo.page,
                    };

                    if(params.value.searchNumber === 0){
                        query.name = params.value.searchContent.length? params.value.searchContent: '.*';
                        query.title = params.value.searchContent.length? params.value.searchContent: '.*';
                        query.content = params.value.searchContent.length? params.value.searchContent: '.*';
                    }

                    // console.log(`/goods/list?name=${query.name}&title=${query.title}&content=${query.content}&order=${query.order}&page=${query.page}`);
                    // console.log(params.value.searchNumber === 0)
                    // console.log(params.value.searchContent)
                    // console.log(params.value.searchContent.length)

                    let result = await axios.get(`/goods/list?name=${query.name}&title=${query.title}&content=${query.content}&order=${query.order}&page=${query.page}`);
                    
                    params.value.list.push(...((result.data.result)));

                    if(params.value.list.length !== 0){
                        params.value.lastSearchInfo.page = params.value.list[params.value.list.length-1].goodsNumber;
                    }
                    
                    if(result.data.result.length === 0){
                        params.value.listEnd = false;
                    }

                    params.value.searchStatus = 1;
                }
                catch(error){
                    console.log(error);
                }
            },
            getGoodsListDebounced: null,
        };

        methods.getGoodsListDebounced = debounce(methods.getGoodsList, 500);

        context.emit("REGISTSEARCH", {methods: methods.getGoodsListDebounced});

        watch(()=>store.getters.GET_IS_LOGIN, (a, b)=>{

        });

        watch(()=>params.value.searchNumber, (a,b)=>{
            params.value.isChange = true;
        })

        onMounted(async ()=>{
            methods.getGoodsListDebounced();
            // console.log(`goodsList ${route.fullPath.indexOf('isBuying1') !== -1}`);

            if(route.fullPath.indexOf('isBuying') !== -1){
                let gitem = (await axios.get(`/goods/info?goodsNumber=${route.query['gn'] ?? 20}`)).data.result[0]
                gitem = {...gitem, goodsNumber: route.query['gn'], value: route.query['vl'], address: route.query['adr']};

                await store.commit("SET_GOODS_INFO", {goodsInfo: {...gitem, goodsNumber: route.query['gn'], value: route.query['vl'], address: route.query['adr']}, });
                await store.commit('OPEN_FOREGROUND', {name: 'GoodsInfoVue'});

                let goodsInfo = {goodsNumber: route.query['gn'], value: route.query['vl'], address: route.query['adr']};

                axios.post('/shop/goods', goodsInfo)
                .then((response)=>{
                    store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"primary"});
                })
                .catch((error)=>{
                    console.log(error.response);
                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                })
                .finally(()=>{
                    store.commit('REMOVE_LOADING');
                    store.commit("CLOSE_FOREGROUND");
                });

                router.push(route.path);
            }
        });

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

@media screen and (min-width: 1000px) {
    #gunInfoWrapper:hover{
        background-color: rgba(255, 255, 255, 0.3);
    }
}

#isHaveIt{
    color: rgb(71, 131, 241);
}

.none{
    color:white;
}

.on{
    color: rgb(71, 131, 241);
}


.w-30{
    width: 30%;
}

.multipleBoardList-enter-from, .multipleBoardList-leave-to{
    opacity: 0;
}

.multipleBoardList-enter-active, .multipleBoardList-leave-active{
    transition: all 0.3s ease;
}
</style>
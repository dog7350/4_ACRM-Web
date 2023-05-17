<template>
    <div id="ManagedGoodsRootWrapper" class="container-fluid m-0 p-0 d-flex flex-wrap justify-content-center" style="position:fixed; z-index:1501; width:50vw; height: auto; min-width:300px; max-width:800px;">
        <div id="ManagedGoodsWrapper" class="m-0 px-0 py-3 d-flex flex-wrap container-fluid border-radius-d">
            <div @click="params.currentPlan === 1?methods.backProductPage():''"
            id="titleWrapper" :class="`container-fluid mt-3 p-0 text-center fsplll font-bold ${params.currentPlan === 1? 'over-cursor': ''}`">
                {{
                    params.currentPlan === 0? '내 상품 관리': params.currentPlan === 1? '상품 현황 관리': '?????'
                }}
            </div>
            <div class="container-fluid mx-0 mt-3 mb-0 p-0" style="border: 2px solid rgb(5, 250, 156); height:1px;"></div>

            <transition name="fast-fade" moed="out-in">
                <div v-if="params.currentPlan === 0"
                id="contentsRoot" class="container-fluid m-0 p-0 d-flex flex-wrap awesome-scroll">
                    <div id="GoodsListWrapper" class="container-fluid m-0 p-0 d-flex flex-column justify-content-center">
                        <div class="container-fluid m-0 pb-3 px-0 text-center fspll">

                        </div>
                        <transition-group name="multipleBoardList" mode="out-in" class="container-fluid m-0 py-0 px-3" tag="ul" style="listStyle:none;">
                            <li v-for="item, index in params.list" :key="index">
                                <ManageGoodsEntran @CHANGEPLAN="methods.changePlan" :data="item"/>
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
                </div>
                <div v-else-if="params.currentPlan === 1"
                id="contentsRoot" class="container-fluid m-0 p-0 d-flex flex-wrap awesome-scroll">
                    <transition-group name="multipleBoardList" mode="out-in" class="container-fluid m-0 py-0 px-3" tag="ul" style="listStyle:none;">
                        <li v-for="item, index in params.loglist" :key="index">
                            <GoodsLogEntran :data="item" />
                        </li>
                    </transition-group>
                    <transition name="fast-fade" mode="out-in">
                        <div 
                        @click="methods.backProductPage"
                        v-if="params.logIsEmpty"
                        class="container-fluid m-0 p-0 over-cursor">
                            <div 
                            class="container-fluid m-0 pt-5 px-0 text-center fspll">
                                관리할 상품 목록이 없습니다.
                            </div>
                            <div 
                            class="container-fluid m-0 py-5 px-0 text-center fspll">
                                누르면 상품관리 화면으로 돌아갑니다.
                            </div>
                        </div>
                        
                    </transition>
                </div>
                
            </transition>
            
            <div class="container-fluid mx-0 mt-0 mb-0 p-0" style="border: 2px solid rgb(5, 250, 156); height:1px;"></div>
            
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import axios from 'axios';
import { debounce } from 'lodash';
import ManageGoodsEntran from './ManagedGoodsEntran.vue';
import GoodsLogEntran from './GoodsLogEntran.vue';

const yyyymmdd_HHMMSS = (dateTime)=>{
    let result = 'yyyy-mm-dd HH:MM:ss';
    try{
        var timeZone = new Date(dateTime);
        var time = timeZone.toString().split(' ')[4];
        var date = null;

        var year = timeZone.getFullYear();
        var month = timeZone.getMonth()+1;
        var day = timeZone.getDate();

        date = `${year}-${("00"+month.toString()).slice(-2)}-${("00"+day.toString()).slice(-2)}`;
        result = date + ' ' + time;
    }
    catch(error){
        console.log(error);
    }

    return result;
}

export default {
    name: "ManagedGoods",
    components: {
        ManageGoodsEntran, GoodsLogEntran
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            list: [], searchNumber: 0, searchContent: '', isChange: true, searchStatus: 0, listEnd: true,
            lastSearchInfo: {
                page: -1,
            },
            loglist: [], logGoodsNumber: -1, logIsEmpty: false,
            currentPlan: 0,
        });

        const methods = {
            getGoodsList: async (isChange = false)=>{
                try{
                    params.value.searchStatus = 0;

                    if(params.value.isChange || isChange){
                        params.value.isChange = false;

                        params.value.lastSearchInfo = {
                            page: -1,
                        };

                        params.value.list = [];
                        params.value.listEnd = true;
                    }

                    params.value.searchContent += "";
                    // console.log(params.value.searchNumber, params.value.searchContent, params.value.searchContent.length);

                    let query = {
                        page: params.value.lastSearchInfo.page,
                    };

                    let result = await axios.get(`/goods/list?isMine=o&page=${query.page}`);
                    
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
            changePlan: (payload)=>{
                params.value.currentPlan = payload.plan;

                if(payload.goodsNumber){
                    params.value.logGoodsNumber = payload.goodsNumber;
                }
            },
            getGoodsLogList: ()=>{
                params.value.logIsEmpty = false;

                axios.get(`/goods/log?goodsNumber=${params.value.logGoodsNumber}`)
                .then((response)=>{
                    let result = response.data.result;

                    if(result.length === 0){
                        params.value.loglist = [];
                        params.value.logIsEmpty = true;
                    } else{
                        params.value.loglist = [...result];
                    }
                })
                .catch((error)=>{
                    console.log(error);
                })
            },
            backProductPage: ()=>{
                params.value.currentPlan = 0;
                params.value.isChange = true;
            }
        };

        methods.getGoodsListDebounced = debounce(methods.getGoodsList, 500);

        context.emit("REGISTSEARCH", {methods: methods.getGoodsListDebounced});

        watch(()=>store.getters.GET_IS_LOGIN, (a, b)=>{

        });

        watch(()=>params.value.searchNumber, (a,b)=>{
            params.value.isChange = true;
        })

        watch(()=>params.value.currentPlan, (a,b)=>{
            if(a === 1){
                methods.getGoodsLogList();
            }
        });

        onMounted(()=>{
            methods.getGoodsListDebounced();
        });

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>
#ManagedGoodsWrapper{
    border: 3px solid orange;
    background-color: rgba(0,0,0,0.9);
    /* min-height:600px; */
    color: white;
}

#contentWrapper{
    border: 3px solid rgb(75, 75, 75);
}

#contentsRoot{
    max-height: 550px;
    overflow-x: hidden;
    overflow-y: scroll;
}

#buyingWrapper{
    background-color: aliceblue;
}

@media screen and (max-width: 1000px) {
    #contentsRoot{
        max-height: 350px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
}
</style>
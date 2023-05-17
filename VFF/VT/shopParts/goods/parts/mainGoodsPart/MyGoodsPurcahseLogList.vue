<template>
    <div id="ManagedGoodsRootWrapper" class="container-fluid m-0 p-0 d-flex flex-wrap justify-content-center" style="position:fixed; z-index:1501; width:50vw; height: auto; min-width:300px; max-width:800px;">
        <div id="ManagedGoodsWrapper" class="m-0 px-0 py-3 d-flex flex-wrap container-fluid border-radius-d">
            <div
            id="titleWrapper" :class="`container-fluid mt-3 p-0 text-center fsplll font-bold`">
                내 주문내역
            </div>
            <div class="container-fluid mx-0 mt-3 mb-0 p-0" style="border: 2px solid rgb(5, 250, 156); height:1px;"></div>

            <transition name="fast-fade" moed="out-in">
                <div v-if="!params.listIsNone"
                id="contentsRoot" class="container-fluid m-0 p-0 d-flex flex-wrap awesome-scroll">
                    <div id="GoodsListWrapper" class="container-fluid m-0 p-0 d-flex flex-column justify-content-center">
                        <transition-group name="multipleBoardList" mode="out-in" class="container-fluid m-0 py-0 px-3" tag="ul" style="listStyle:none;">
                            <li v-for="item, index in params.list" :key="index">
                                <MyGoodsPurchaseLog :data="item" />
                            </li>
                        </transition-group>
                    </div>
                </div>
                <div v-else id="contentsRoot" class="container-fluid m-0 p-0 d-flex flex-wrap">
                    내 주문내역이 존재하지 않습니다.
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

import MyGoodsPurchaseLog from './MyGoodsPurchaseLog.vue';

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
        MyGoodsPurchaseLog
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            list: [], listIsNone: false
        });

        const methods = {
            getMyLog: ()=>{
                axios.get("/goods/mylog")
                .then((response)=>{

                    if(response.data.result.length === 0){
                        params.value.listIsNone = true;
                    } else{
                        params.value.list.push(...response.data.result);
                        params.value.listIsNone = false;
                    }
                    

                    console.log(response.data);
                })
                .catch((error)=>{
                    console.log(error.response.data);
                })
            }
        };

        

        watch(()=>store.getters.GET_IS_LOGIN, (a, b)=>{

        });


        watch(()=>params.value.currentPlan, (a,b)=>{
            
        });

        onMounted(()=>{
            methods.getMyLog();
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
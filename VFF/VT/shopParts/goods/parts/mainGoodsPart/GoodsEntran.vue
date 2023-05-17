<template>
    <div id="GoodsRootWrapper" :class="`container-fluid stopSelling mx-0 mt-4 px-0 py-2 d-flex flex-wrap justify-content-between border-radius-d`">
        <div id="stopSelling" class="w-100 h-100 d-flex flex-wrap justify-content-center align-items-center" v-if="params.tempItem.stopSelling !== 0">
            <div class="fspll font-bold">
                판매가 중지된 상품입니다.
            </div>
        </div>
        <div class="d-flex flex-wrap m-0 p-0">
            <div :class="`w-auto align-self-center fspl font-bold my-0 ${store.getters.GET_BROWSER_SIZE > 800? 'ms-5': 'mx-2'} p-0`">
                {{params.tempItem.goodsNumber}}
            </div>
            <div :class="`d-flex flex-wrap my-0 ${store.getters.GET_BROWSER_SIZE > 800? 'ms-5': 'mx-2'} p-0 align-self-center`">
                <img class="" width="100" height="100"
                :src="params.tempItem.goodsImagePath" alt="굿즈사진" @error="(e)=>{e.target.src='/images/board/logos/none.png'}">
            </div>
            <div :class="`container-fluid d-flex flex-wrap my-0 ${store.getters.GET_BROWSER_SIZE > 800? 'ms-5': 'mx-2'} p-0`">
                <div class="container-fluid my-2 p-0">
                    제목: {{params.tempItem.goodsName}}
                </div>
                <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                    <div class="my-0 p-0 me-4">
                        업로더: {{params.tempItem.uploaderName}}
                    </div>
                    <div class="my-0 p-0 mx-0">
                        {{yyyymmdd_HHMMSS(params.tempItem.uploadDate)}}
                    </div>
                </div>
                <div class="container-fluid px-0 py-0 mb-2">
                    설명: {{params.tempItem.goodsPs}}
                </div>
            </div>
        </div>
        <div :class="`container-fluid d-flex flex-wrap my-0 mx-${store.getters.GET_BROWSER_SIZE > 800? '5': '2'} p-0`">
            <div @click="methods.openGoodsInfo"
            class="container-fluid d-flex flex-wrap justify-content-center btn btn-success">
                <div class="container-fluid align-self-center">
                    상품보기
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import axios from 'axios';
import { debounce } from 'lodash';

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
    name: "GoodsEntran",
    props: {
        data: JSON
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            tempItem: props.data,
        });

        const methods = {
            openGoodsInfo: ()=>{
                store.commit("SET_GOODS_INFO", {goodsInfo: params.value.tempItem});

                store.commit('OPEN_FOREGROUND', {name: 'GoodsInfoVue'});
            }
        };

        watch(()=>store.getters.GET_IS_LOGIN, (a, b)=>{

        });

        onMounted(()=>{

        });

        return {
            params, methods, store, props, yyyymmdd_HHMMSS
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

#stopSelling{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(255, 255, 255, 0.2);
    /* color:black */
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

#GoodsRootWrapper{
    position: relative;
    border: 3px solid orange;
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
<template>
    <div id="GoodsRootWrapper" :class="`container-fluid stopSelling mx-0 mt-4 px-0 py-2 d-flex flex-wrap justify-content-between border-radius-d`">
        <div class="d-flex flex-wrap m-0 p-0">
            
            <div :class="`container-fluid justify-content-center d-flex my-0 ${store.getters.GET_BROWSER_SIZE > 800? 'mx-5': 'mx-2 flex-wrap'} p-0`">
                <div class="d-flex flex-wrap">
                    <img width="100" height="100" :class="`align-self-center ${store.getters.GET_BROWSER_SIZE > 800? 'me-5': 'mx-2 my-4'}`"
                    :src="params.tempItem.goodsImagePath" alt="">
                </div>
                <div class="d-flex flex-wrap">
                    <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                        <div class="my-0 p-0 mx-0">
                            {{`구매날짜: ${yyyymmdd_HHMMSS(params.tempItem.purchaseDate)}`}}
                        </div>
                    </div>

                    <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                        <div class="my-0 p-0 mx-0">
                            {{`상품이름: ${params.tempItem.goodsName} (${params.currentGoodsStat[params.tempItem.productStatus]})`}}
                        </div>
                    </div>

                    <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                        <div class="my-0 p-0 mx-0">
                            {{`구매갯수: ${params.tempItem.numberOfProduct}`}}
                        </div>
                    </div>
                    <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                        <div class="my-0 p-0 mx-0">
                            {{`총 가격: ${params.tempItem.totalPrice}`}}
                        </div>
                    </div>
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
    name: "MyGoodsPurchaseLog",
    props: {
        data: JSON
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            tempItem: props.data,
            currentGoodsStat: {
                '0':'접수 대기중', 
                '1': '물품 준비중', 
                '2': '출고중', 
                '3': '배송 시작', 
                '20': '배송 완료',
                '22': '접수 취소',
            },
        });

        const methods = {
            
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
<template>
    <div id="GoodsRootWrapper" :class="`container-fluid stopSelling mx-0 mt-4 px-0 py-2 d-flex flex-wrap justify-content-between border-radius-d`">
        <div class="d-flex flex-wrap m-0 p-0">
            <div :class="`container-fluid d-flex flex-wrap my-0 ${store.getters.GET_BROWSER_SIZE > 800? 'ms-5': 'mx-2'} p-0`">
                <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                    <div class="my-0 p-0 mx-0">
                         {{`구매자: ${params.tempItem.purName}`}}
                    </div>
                </div>
                <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                    <div class="my-0 p-0 mx-0">
                         {{`구매자 번호: ${params.tempItem.phone}`}}
                    </div>
                </div>
                <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                    <div class="my-0 p-0 mx-0">
                         {{`구매자 이메일: ${params.tempItem.email}`}}
                    </div>
                </div>
                <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                    <div class="my-0 p-0 mx-0">
                         {{`구매날짜: ${yyyymmdd_HHMMSS(params.tempItem.purchaseDate)}`}}
                    </div>
                </div>
                <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                    <div class="my-0 p-0 mx-0">
                         {{`배송 주소: ${params.tempItem.address}`}}
                    </div>
                </div>
                <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                    <div class="my-0 p-0 mx-0">
                         {{`구매자 주소: ${params.tempItem.baseAddress}`}}
                    </div>
                </div>
            </div>
        </div>
        <div @click="methods.openModifyStat"
        :class="`container-fluid text-center justify-content-center d-flex flex-wrap my-0 mx-${store.getters.GET_BROWSER_SIZE > 800? '5': '2'} p-0 btn btn-primary`">
            배송 상태창 펼치기
        </div>
        <transition name="fast-fade" mode="out-in">
            <div v-if="params.statOpen"
            :class="`container-fluid d-flex flex-wrap my-0 mx-${store.getters.GET_BROWSER_SIZE > 800? '5': '2'} p-0`">
                <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                    <div class="my-0 p-0 mx-0">
                        {{`현재 상태: ${params.currentGoodsStat[params.tempItem.productStatus]}`}}
                    </div>
                </div>
                <div class="container-fluid mb-2 p-0 d-flex flex-wrap justify-content-start">
                    <div class="d-flex flex-wrap container-fluid my-0 p-0 mx-0">
                        <div class="form-check">
                            <input @click="methods.changeStat(0)"
                            type="radio" class="form-check-input" id="radio0" name="optradio" value="option0" checked>
                            <label class="form-check-label" for="radio0">접수 대기중</label>
                        </div>
                        <div class="form-check">
                            <input @click="methods.changeStat(1)"
                            type="radio" class="form-check-input" id="radio1" name="optradio" value="option1">
                            <label class="form-check-label" for="radio1">물품 준비중</label>
                        </div>
                        <div class="form-check">
                            <input @click="methods.changeStat(2)"
                            type="radio" class="form-check-input" id="radio2" name="optradio" value="option2">
                            <label class="form-check-label" for="radio2">출고중</label>
                        </div>
                        <div class="form-check">
                            <input @click="methods.changeStat(3)"
                            type="radio" class="form-check-input" id="radio3" name="optradio" value="option3">
                            <label class="form-check-label" for="radio3">배송시작</label>
                        </div>
                        <div class="form-check">
                            <input @click="methods.changeStat(20)"
                            type="radio" class="form-check-input" id="radio4" name="optradio" value="option4">
                            <label class="form-check-label" for="radio4">배송 완료</label>
                        </div>
                        <div class="form-check">
                            <input @click="methods.changeStat(22)"
                            type="radio" class="form-check-input" id="radio5" name="optradio" value="option5">
                            <label class="form-check-label" for="radio5">접수 취소</label>
                        </div>
                    </div>
                    <transition name="fast-fade" mode="out-in">
                        <div class="d-flex flex-wrap container-fluid my-3 p-0 mx-0 font-red text-center" v-if="params.alertMessage !== ''">
                            {{params.alertMessage}}
                        </div>
                    </transition>
                    
                    <div class="d-flex flex-wrap container-fluid my-0 p-0 mx-0">
                        <input v-model="params.message"
                        class="container-fluid d-flex flex-wrap" type="text" placeholder="구매자에게 보낼 메시지">
                        <input @click="methods.updateStatDebounced"
                        class="container-fluid d-flex flex-wrap text-center" type="button" value="배송 상태 변경">
                    </div>
                </div>
            </div>
        </transition>
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
    name: "GoodsLogEntran",
    props: {
        data: JSON
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            tempItem: props.data,
            currentStat: 0, statOpen: false, message: '',alertMessage: '',
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
            openModifyStat: ()=>{
                params.value.statOpen = !params.value.statOpen;
            },
            changeStat: (stat)=>{
                params.value.currentStat = stat;
            },
            updateStat: ()=>{
                let body = {
                    goodsLogNumber: params.value.tempItem.goodsLogNumber,
                    message: params.value.message,
                    status: params.value.currentStat
                };
                params.value.message = '';

                console.log(body);

                axios.put('/goods/updateStat', body)
                .then((response)=>{
                    console.log(response.data.result);
                    store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});
                })
                .catch((error)=>{
                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                })
            },
            updateStatDebounced: null,
        };

        methods.updateStatDebounced = debounce(methods.updateStat, 1000);

        watch(()=>store.getters.GET_IS_LOGIN, (a, b)=>{

        });

        watch(()=>params.value.currentStat, (a, b)=>{
            if(a == 20){
                params.value.alertMessage = "배송 완료 처리를 진행할 경우 더 이상 배송상태를 관리할 수 업습니다.";
            } else if(a == 22){
                params.value.alertMessage = "접수 취소 처리를 진행할 경우 더 이상 배송상태를 관리할 수 업습니다.";
            } else{
                params.value.alertMessage = '';
            }
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
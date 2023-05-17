<template>
    <div id="GoodsRootWrapper" :class="`container-fluid stopSelling mx-0 mt-4 px-0 py-2 d-flex flex-wrap justify-content-center border-radius-d`">
        <div class="justify-content-center d-flex flex-wrap m-0 p-0">
            <div :class="`container-fluid text-center align-self-center fspl font-bold my-0 ${store.getters.GET_BROWSER_SIZE > 800? 'mx-5': 'mx-2'} p-0`">
                {{params.tempItem.goodsNumber}} {{params.tempItem.goodsName}}
            </div>
            <div :class="`d-flex flex-wrap my-0 ${store.getters.GET_BROWSER_SIZE > 800? 'mx-5': 'mx-2'} p-0 align-self-center`">
                <!-- <img class="" width="100" height="100"
                :src="params.tempItem.goodsImagePath" alt="굿즈사진" @error="(e)=>{e.target.src='/images/board/logos/none.png'}"> -->

                <transition name="fast-fade" mode="out-in">
                    <div v-if="params.isOpen"
                    class="container-fluid justify-content-center d-flex flex-wrap m-0 p-0">
                        <img @click="methods.fileClick"
                        class="w-100 m-0 p-0" 
                        :src="params.file === null? params.tempItem.goodsImagePath: ''"
                        :style="`${params.file === null? '': `content: url(${params.file});`}`"
                        alt="판매할 굿즈의 사진을 등록해주세요.">
                        <input v-show="false" @change="methods.fileChange" type="file" name="" id="filer" accept="image/gif, image/jpeg, image/png">
                    </div>
                </transition>
            </div>
            <div @click="methods.isOpenModify"
            :class="`container-fluid d-flex flex-wrap my-2 ${store.getters.GET_BROWSER_SIZE > 800? 'mx-5': 'mx-2'} p-0 text-center justify-content-center btn btn-secondary`">
                {{params.isOpen?'변경창 닫기': '변경창 펼치기'}}
            </div>
            <div @click="methods.changePlan"
            :class="`container-fluid d-flex flex-wrap my-2 ${store.getters.GET_BROWSER_SIZE > 800? 'mx-5': 'mx-2'} p-0 text-center justify-content-center btn btn-warning`">
                {{`상품관리하기 (현재 관리할 상품개수 ${params.tempItem.realCount}개)`}}
            </div>
            <transition name="fast-fade" mode="out-in">
                <div v-if="params.isOpen"
                :class="`container-fluid d-flex flex-wrap my-0 ${store.getters.GET_BROWSER_SIZE > 800? 'mx-5': 'mx-2'} p-0`">
                    <div class="container-fluid my-2 p-0">
                        제목: <input class="container-fluid" type="text" v-model="params.goodsName">
                    </div>
                    <div class="container-fluid px-0 py-0 mb-2">
                        설명
                        <textarea v-model="params.goodsPs"
                        class="container-fluid awesome-scroll w-100" type="text" placeholder="굿즈 내용을 입력해주세요."/>
                    </div>
                    <div class="container-fluid px-0 py-0 mb-2">
                        가격:<input class="container-fluid" type="number" v-model="params.price">
                    </div><div class="container-fluid px-0 py-0 mb-2">
                        최대 판매 갯수:<input class="container-fluid" type="number" v-model="params.maxNumberOfProduct">
                    </div>
                </div>
            </transition>
            
        </div>
        <transition name="fast-fade" mode="out-in">
            <div v-if="params.isOpen"
            :class="`container-fluid d-flex flex-wrap my-0 mx-${store.getters.GET_BROWSER_SIZE > 800? '5': '2'} p-0`">
                <div class="container-fluid d-flex flex-wrap justify-content-start px-0 border-radius-a" style="border: 1px white solid;">
                    <div class="container-fluid d-flex flex-wrap mt-2 form-check form-switch mx-3">
                        <input :checked="params.stopSelling" @click="methods.sellingToggle"
                        class="form-check-input" type="checkbox" id="mySwitch" name="darkmode">
                        <label class="form-check-label" for="mySwitch">{{params.stopSelling? '판매중': '판매중지'}}</label>
                    </div>
                    <div class="container-fluid d-flex flex-wrap mt-2 mb-3 mx-3 p-0">
                        <div @click="methods.changeGoodsDebounced"
                        class="container-fluid btn btn-primary btn-sm">
                            변경하기
                        </div>
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
    name: "ManagedGoodsEntran",
    props: {
        data: JSON
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const fileReader = new FileReader();

        fileReader.onload = (e2)=>{
            params.value.file = e2.target.result;
        };

        const params = ref({
            tempItem: props.data,
            stopSelling: props.data.stopSelling === 0? true: false,
            goodsName: null,
            goodsPs: null,
            price: null,
            maxNumberOfProduct: null,
            file: null,
            isOpen: false,
        });

        

        params.value.goodsName = params.value.tempItem.goodsName;
        params.value.goodsPs = params.value.tempItem.goodsPs;
        params.value.price = parseInt(params.value.tempItem.price);
        params.value.maxNumberOfProduct = parseInt(params.value.tempItem.maxNumberOfProduct);


        const methods = {
            openGoodsInfo: ()=>{
                store.commit("SET_GOODS_INFO", {goodsInfo: params.value.tempItem});

                store.commit('OPEN_FOREGROUND', {name: 'GoodsInfoVue'});
            },
            sellingToggle: ()=>{
                params.value.stopSelling = !params.value.stopSelling;
            },
            fileChange: (e)=>{
                const fileItem = e.target.files;
                // console.log(e.target);

                if(fileItem[0]){
                    fileReader.readAsDataURL(fileItem[0]);
                }
            },
            fileClick: ()=>{
                $('#filer').click();
            },
            changeGoods: ()=>{
                if(params.value.goodsName && params.value.goodsName.length > 5){
                    if(params.value.goodsPs && params.value.goodsPs.length > 20){
                        if(params.value.price && Number.isInteger(parseInt(params.value.price)) && parseInt(params.value.price) > 0){
                            if(params.value.maxNumberOfProduct && Number.isInteger(parseInt(params.value.maxNumberOfProduct)) && parseInt(params.value.maxNumberOfProduct) > 0){
                                let formData = new FormData();
                                let image = $('#filer');

                                if(image[0] && image[0].files[0] !== null) formData.append('imageFile', image[0].files[0]);
                                formData.append('goodsName', params.value.goodsName);
                                formData.append('goodsPs', params.value.goodsPs);
                                formData.append('price', parseInt(params.value.price));
                                formData.append('maxNumOfProduct', parseInt(params.value.maxNumberOfProduct));
                                formData.append('stopSelling', params.value.stopSelling?0:1);
                                formData.append('goodsNumber', parseInt(params.value.tempItem.goodsNumber));
                                
                                axios.post('/shop/change_goods', formData, {headers:{"Content-Type": "multipart/form-data"}})
                                .then((response)=>{
                                    store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});
                                    store.commit('CLOSE_FOREGROUND', {});
                                })
                                .catch((error)=>{
                                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                                })
                            } else{
                                store.commit('CREATE_ALERT', {msg: '최대 판매 갯수는 0개 보다 많아야합니다.', time: 2, type:"danger"});
                            }
                        } else{
                            store.commit('CREATE_ALERT', {msg: '가격은 0캐쉬 보다 커야합니다.', time: 2, type:"danger"});
                        }
                    } else{
                        store.commit('CREATE_ALERT', {msg: '상품 설명은 21자 이상이여야 합니다.', time: 2, type:"danger"});
                    }
                } else{
                    store.commit('CREATE_ALERT', {msg: '상품 제목은 6자 이상이여야 합니다.', time: 2, type:"danger"});
                }

                
            },
            changeGoodsDebounced: null,
            isOpenModify: ()=>{
                params.value.isOpen = !params.value.isOpen;
            },
            changePlan: ()=>{
                context.emit("CHANGEPLAN", {plan: 1, goodsNumber: params.value.tempItem.goodsNumber});
            }
        };

        methods.changeGoodsDebounced = debounce(methods.changeGoods, 500);

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
    background-color: black;
    color: white;
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
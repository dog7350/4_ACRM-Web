<template>
    <div id="GoodsInfoRootWrapper" class="container-fluid m-0 p-0 d-flex flex-wrap justify-content-center" style="position:fixed; z-index:1501; width:50vw; height: auto; min-width:300px; max-width:800px;">
        <div id="GoodsInfoWrapper" class="m-0 px-0 py-3 d-flex flex-wrap container-fluid border-radius-d">
            <div id="titleWrapper" class="container-fluid mt-3 p-0 text-center fsplll font-bold">
                상품 등록창
            </div>
            <div class="container-fluid mx-0 mt-3 mb-0 p-0" style="border: 1px solid black; height:1px;"
            ></div>

            <div id="contentsRoot" class="container-fluid m-0 p-0 d-flex flex-wrap awesome-scroll">
                <div id="" class="d-flex flex-wrap container-fluid mt-3 mx-2 px-2 pt-1 text-start fspm font-bold border-radius-b">
                    상품명
                </div>
                <div id="" class="d-flex flex-wrap container-fluid mt-1 mx-2 px-2 pt-1 text-center fsps font-bold border-radius-b">
                    <input v-model="params.title"
                    class="container-fluid" type="text" placeholder="굿즈 이름을 입력해주세요.">
                </div>

                <div id="" class="d-flex flex-wrap container-fluid mt-3 mx-2 px-2 pt-1 text-start fspm font-bold border-radius-b">
                    상품내용
                </div>
                <div id="" class="d-flex flex-wrap container-fluid mt-0 mx-2 px-2 pt-0 text-center fsps font-bold border-radius-b">
                    <textarea v-model="params.content"
                    class="container-fluid awesome-scroll w-100" type="text" placeholder="굿즈 내용을 입력해주세요."/>
                </div>

                <div id="" class="d-flex flex-wrap container-fluid mt-3 mx-2 px-2 pt-1 text-start fspm font-bold border-radius-b">
                    개당가격
                </div>
                <div id="" class="d-flex flex-wrap container-fluid mt-0 mx-2 px-2 pt-0 text-center fsps font-bold border-radius-b">
                    <input v-model="params.price"
                    class="container-fluid" type="nunmber" placeholder="개당 가격을 입력해주세요.">
                </div>

                <div id="" class="d-flex flex-wrap container-fluid mt-3 mx-2 px-2 pt-1 text-start fspm font-bold border-radius-b">
                    구매 가능한 상품 최대 갯수
                </div>
                <div id="" class="d-flex flex-wrap container-fluid mt-0 mx-2 px-2 pt-0 text-center fsps font-bold border-radius-b">
                    <input v-model="params.maxCount"
                    class="container-fluid" type="nunmber" placeholder="굿즈를 구매할 수 있는 최대 갯수를 지정해주세요.">
                </div>
                
                <div id="" class="d-flex flex-wrap container-fluid mt-3 mx-2 px-2 pt-1 text-start fspm font-bold border-radius-b">
                    굿즈사진
                </div>
                <div id="" class="d-flex flex-wrap container-fluid mt-0 mx-2 px-2 pt-0 text-center fspm font-bold border-radius-b">
                    <img @click="methods.fileClick"
                    class="w-100 m-0 p-0" 
                    :style="`content: url(${params.file});`"
                    alt="판매할 굿즈의 사진을 등록해주세요.">
                    <input v-show="false" @change="methods.fileChange" type="file" name="" id="filer" accept="image/gif, image/jpeg, image/png">
                </div>
            </div>
            
            <div style="border: 3px solid rgb(75, 75, 75);"
            id="buyingWrapper" class="container-fluid d-flex flex-wrap justify-content-between mt-3 mx-2 py-2 px-4 text-center fsps border-radius-b">
                <div class="container-fluid d-flex flex-wrap m-0 p-0 mt-1 justify-content-between align-items-center">
                    <div @click="methods.registGoodsDebounced"
                    class="w-100 btn btn-primary">
                        등록하기
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
    name: "RegistGoodsForm ",
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const fileReader = new FileReader();

        fileReader.onload = (e2)=>{
            params.value.file = e2.target.result;
        };

        const params = ref({
            file: null, title: '', content: '', maxCount: 0, price: 0,
        });

        const methods = {
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
            registGoods: ()=>{
                if(params.value.title && params.value.title.length > 5){
                    if(params.value.content && params.value.content.length > 20){
                        if(params.value.price && Number.isInteger(parseInt(params.value.price)) && parseInt(params.value.price) > 0){
                            if(params.value.maxCount && Number.isInteger(parseInt(params.value.maxCount)) && parseInt(params.value.maxCount) > 0){
                                let formData = new FormData();
                                let image = $('#filer');

                                if(image[0] && image[0].files[0] !== null) formData.append('imageFile', image[0].files[0]);
                                formData.append('goodsName', params.value.title);
                                formData.append('goodsPs', params.value.content);
                                formData.append('price', parseInt(params.value.price));
                                formData.append('maxNumOfProduct', parseInt(params.value.maxCount));

                                console.log(formData);
                                
                                axios.post('/shop/upload_goods', formData, {headers:{"Content-Type": "multipart/form-data"}})
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
            registGoodsDebounced: null,
        };

        methods.registGoodsDebounced = debounce(methods.registGoods, 500);

        
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
#GoodsInfoWrapper{
    border: 3px solid black;
    background-color: rgba(255, 255, 255, 1);
    /* min-height:600px; */
    color: black;
}

#contentWrapper{
    border: 3px solid rgb(75, 75, 75);
}

#contentsRoot{
    max-height: 550px;
    overflow-x: hidden;
    overflow-y: scroll;
}

@media screen and (max-width: 1000px) {
    #contentsRoot{
        max-height: 350px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
}

textarea{
    min-width: 100%;
    min-height: 300px;
}
</style>
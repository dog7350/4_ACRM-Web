<template>
    <div id="CarInfoRootWrapper" class="container-fluid m-0 p-0 d-flex flex-wrap justify-content-around">
        <div :style="`position: relative;`"
        class="container-fluid m-0 p-0 d-flex flex-wrap justify-content-around">

            <div id="carInfoWrapper" :style="`${store.getters.GET_BROWSER_SIZE < 1000 && params.currentIndex !== index? 'position: fixed; top: 0; left:0;': ''}`"
            class="w-auto d-flex flex-wrap text-center mx-2 my-4 border-radius-b is-have-plain-transition p-0" 
            v-for="item, index in params.carList" :key="index">
                <div v-if="store.getters.GET_BROWSER_SIZE >= 1000"
                class="w-100 d-flex flex-wrap text-center m-0 is-have-plain-transition p-0"
                style="minWidth: 250px; overflow:hidden;">
                    <div @click="()=>{params.carInfoVisible[index] = !params.carInfoVisible[index];}"
                    class="w-100 m-0 p-0 d-flex flex-wrap justify-content-center over-cursor" style="minWidth: 250px;minHeight: 200px; position:relative;">
                        <img class="container-fluid m-0 p-0 align-self-center" :src="`/images/cars/car${index}.png`" alt="" style="width: 200px;">
                        <transition name="fast-fade" mode="out-in">
                            <div v-if="params.carInfoVisible[index]" class="w-100 h-100 d-flex flex-column px-2" style="position:absolute; top:0px; left:0px; backgroundColor: rgba(0,0,0, 0.8); zIndex: 2;">
                               <br>
                                <div class="w-100 text-start">
                                    설명: {{item.content}}
                                </div>
                                <br>
                                <div class="w-100 text-start">
                                    체력: {{item.hp}}
                                </div>
                                <div class="w-100 text-start">
                                    방어력: {{item.def}}
                                </div>
                                <div class="w-100 text-start">
                                    속도: {{item.speed}}
                                </div>
                                <div class="w-100 text-start"> 
                                    가격: {{item.price}} {{item.cash==='o'?'캐쉬':'게임머니'}}
                                </div>
                            </div>
                        </transition>
                    </div>
                    <div @click="()=>{params.carInfoVisible[index] = !params.carInfoVisible[index];}"
                    class="w-100 m-0 px-0 pb-2 pt-4 over-cursor" style="position:relative;">
                        {{item.name}}
                        <transition name="fast-fade" mode="out-in">
                            <div v-if="params.carInfoVisible[index]" class="w-100 h-100 d-flex flex-column" style="position:absolute; top:0px; left:0px; backgroundColor: rgba(0,0,0, 0.8); zIndex: 1;">
                            </div>
                        </transition>
                    </div>
                    <div class="w-100 m-0 p-0 d-flex flew-wrap align-items-end">
                        <div @click="methods.isHaveArray(item.name) === -1?methods.buyCar(index): ()=>{params.carInfoVisible[index] = !params.carInfoVisible[index];}"
                        :class="`w-100 m-0 p-0 btn btn-${methods.isHaveArray(item.name) === -1?'success':'primary'} fspm`" style="height:29px;">
                            {{
                                methods.isHaveArray(item.name) === -1?
                                '구매하기':
                                '보유중입니다.'
                            }}
                        </div>
                    </div>
                </div>
                <div v-else-if="params.currentIndex === index"
                class="w-100 d-flex flex-wrap text-center m-0 is-have-plain-transition p-0"
                style="minWidth: 250px; overflow:hidden;">
                    <div @click="()=>{params.carInfoVisible[index] = !params.carInfoVisible[index];}"
                    class="w-100 m-0 p-0 d-flex flex-wrap justify-content-center over-cursor" style="minWidth: 250px;minHeight: 200px; position:relative;">
                        <img class="container-fluid m-0 p-0 align-self-center" :src="`/images/cars/car${index}.png`" alt="" style="width: 200px;">
                        <transition name="fast-fade" mode="out-in">
                            <div v-if="params.carInfoVisible[index]" class="w-100 h-100 d-flex flex-column px-2" style="position:absolute; top:0px; left:0px; backgroundColor: rgba(0,0,0, 0.8); zIndex: 2;">
                                <br>
                                <div class="w-100 text-start">
                                    설명: {{item.content}}
                                </div>
                                <br>
                                <div class="w-100 text-start">
                                    체력: {{item.hp}}
                                </div>
                                <div class="w-100 text-start">
                                    방어력: {{item.def}}
                                </div>
                                <div class="w-100 text-start">
                                    속도: {{item.speed}}
                                </div>
                                <div class="w-100 text-start"> 
                                    가격: {{item.price}} {{item.cash==='o'?'캐쉬':'게임머니'}}
                                </div>
                            </div>
                        </transition>
                    </div>
                    <div @click="()=>{params.carInfoVisible[index] = !params.carInfoVisible[index];}"
                    class="w-100 m-0 px-0 pb-2 pt-4 over-cursor" style="position:relative;">
                        {{item.name}}
                        <transition name="fast-fade" mode="out-in">
                            <div v-if="params.carInfoVisible[index]" class="w-100 h-100 d-flex flex-column" style="position:absolute; top:0px; left:0px; backgroundColor: rgba(0,0,0, 0.8); zIndex: 1;">
                            </div>
                        </transition>
                    </div>
                    <div class="w-100 m-0 p-0 d-flex flew-wrap align-items-end">
                        <div @click="methods.isHaveArray(item.name) === -1?methods.buyCar(index): ()=>{params.carInfoVisible[index] = !params.carInfoVisible[index];}"
                        :class="`w-100 m-0 p-0 btn btn-${methods.isHaveArray(item.name) === -1?'success':'primary'} fspm`" style="height:29px;">
                            {{
                                methods.isHaveArray(item.name) === -1?
                                '구매하기':
                                '보유중입니다.'
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="store.getters.GET_BROWSER_SIZE < 1000" class="container-fluid align-items-center justify-content-center text-center d-flex flex-wrap mb-3">
            <div @click="methods.changeIndex(index)"
            :class="`over-cursor mx-1 ${params.currentIndex === index? 'on': 'none'}`" v-for="item, index in params.carList" :key="index">
                {{index+1}}
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import axios from 'axios';

export default {
    name: "CarInfoCompo",
    props: {

    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            carList: [], carInfoVisible: [false, false, false, false],
            myCarList: [], currentIndex: 0,
        });

        const methods = {
            loadCars: ()=>{
                try {
                    axios.get('/info/another/car')
                    .then((res)=>{
                        params.value.carList.push(...(res.data.result));

                        console.log(params.value.carList);
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                }
                catch (error) {
                    console.log(error);
                }
            },
            loadMyCars: ()=>{
                try {
                    axios.get('/info/mycar')
                    .then((res)=>{
                        params.value.myCarList.push(...(res.data.result));

                        console.log(params.value.myCarList);
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                }
                catch (error) {
                    console.log(error);
                }
            },
            isHaveArray: (myCar)=>{
                return params.value.myCarList.indexOf(myCar);
            },
            buyCar: (carIndex)=>{
                const callBack = (boolStat)=>{
                    if(store.getters.GET_IS_LOGIN === false){
                        store.commit('CREATE_ALERT', {msg: '로그인이 필요한 서비스입니다.', time: 2, type:"danger"});
                        store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'})
                    } else if(boolStat){
                        console.log(`${carIndex} 자동차 구매시도`);

                        axios.post(`/shop/what?num=${carIndex+1}&type=1`)
                        .then((response)=>{
                            console.log(response.data.result);
                            store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});

                            methods.loadMyCars();
                        })
                        .catch((error)=>{
                            console.log(error.response.data.result);
                            store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                        });

                    } else{
                        console.log(`${carIndex} 자동차 구매를 취소했습니다.`);
                    }
                };

                store.commit('CREATE_QUESTION', {questionText: '정말 구매하시겠습니까?', yesText: '구매하기', noText:'취소하기', method: callBack});
            },
            changeIndex: (index)=>{
                params.value.currentIndex = index;
            }
        };

        watch(()=>store.getters.GET_IS_LOGIN, (a, b)=>{
            if(a){
                methods.loadMyCars();
            }
        });

        onMounted(()=>{
            methods.loadCars();

            if(store.getters.GET_IS_LOGIN){
                methods.loadMyCars();
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
    #carInfoWrapper:hover{
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
</style>
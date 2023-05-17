<template>
    <div class="container-fluid d-flex flex-column justify-content-center p-0">
        <div id="shopHeaderWrapper" class="w-100 d-flex justify-content-around test-border py-2">
            <div></div>
            <div id="shopImageWrapper" class="w-50 d-flex justify-content-center self-align-center">
                <img width="150" class="over-cursor" @click="methods.routeUrl('/main')" src="/images/logos/segaLogo.png" alt="">
            </div>
            <div></div>
        </div>
        <div id="shopBodyWrapper" class="container-fluid d-flex flex-wrap white-font justify-content-center">
            <div class="d-flex flex-wrap w-75 justify-content-center">
                <div v-if="store.getters.GET_IS_LOGIN" id="infoWrapper" class="container-fluid d-flex flex-column test-border mx-0 my-4 p-0">
                    <div class="container-fluid fsplll font-bold text-center py-3 m-0 tb-orange-border">
                        <!-- <i class="bi bi-arrow-through-heart"></i> -->
                        내 정보
                    </div>
                    <MyInfo></MyInfo>
                </div>

                <div @click="methods.goodsOnDebounced"
                id="goodsWrapper" 
                :class="`${params.visibleGoodsShop? 'black-font': 'over-green'} is-have-plain-transition container-fluid d-flex flex-wrap test-border border-radius-b mx-0 my-4 px-0 py-2 over-cursor justify-content-between fspl`">
                    <div :style="`z-index: 1; `"
                    class="w-75 d-flex flex-wrap justify-content-start is-have-plain-transition">
                        <i :class="`bi bi-gift-fill align-self-center mx-3 ${params.visibleGoodsShop? 'black-font': 'font-green'} is-have-plain-transition`"></i>
                        <div :class="`${params.visibleGoodsShop? 'black-font': 'white-font'} is-have-plain-transition`">
                            {{
                                !params.visibleGoodsShop?
                                '굿즈샵 바로가기':
                                '상점으로 돌아가기'
                            }}    
                            </div>
                    </div>
                    <div :style="`z-index: 1; `"
                    class="w-25 d-flex flex-wrap justify-content-end is-have-plain-transition">
                        <i class="bi bi-arrow-right-square align-self-center mx-3"></i>
                    </div>

                    <transition name="goodsDecorator-fade" mode="out-in" @after-enter="methods.goodsVisible" @after-leave="methods.goodsInvisible">
                        <div v-if="params.preVisibleGoodsShop"
                        id="goodsDecorator" :class="`border-radius-b is-have-plain-transition`"></div>
                    </transition>
                    
                </div>

                <transition name="fast-fade" mode="out-in">
                    <GoodsMainPage v-if="params.visibleGoodsShop"></GoodsMainPage>
                </transition>

                <transition name="fast-fade" mode="out-in">
                    <div v-if="!params.visibleGoodsShop"
                    id="weaponWrapper" class="container-fluid d-flex flex-column test-border mx-0 mb-4 p-0">
                        <div class="container-fluid fsplll font-bold text-center py-3 m-0 tb-orange-border">
                            <!-- <i class="bi bi-arrow-through-heart"></i> -->
                            무기 상점
                        </div>
                        <GunInfoCompo></GunInfoCompo>

                        <div v-if="!store.getters.GET_IS_LOGIN" id="itemMiniWrapper" class="d-flex flex-wrap justify-content-center text-center align-items-center">
                            <div class="font-bold fsplll">
                                로그인 후 이용하실 수 있습니다.
                            </div>
                        </div>
                    </div>
                </transition>

                <transition name="fast-fade" mode="out-in">
                    <div v-if="!params.visibleGoodsShop"
                    id="carWrapper" class="container-fluid d-flex flex-column test-border mx-0 mb-4 p-0">
                        <div class="container-fluid fsplll font-bold text-center py-3 m-0 tb-orange-border">
                            <!-- <i class="bi bi-car-front"></i>  -->
                            자동차 상점
                        </div>
                        <CarInfoCompo></CarInfoCompo>

                        <div v-if="!store.getters.GET_IS_LOGIN" id="itemMiniWrapper" class="d-flex flex-wrap justify-content-center text-center align-items-center">
                            <div class="font-bold fsplll">
                                로그인 후 이용하실 수 있습니다.
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

import MyInfo from './etc/MyInfo.vue';
import CarInfoCompo from './etc/CarInfoCompo.vue';
import GunInfoCompo from './etc/GunInfoCompo.vue';

import GoodsMainPage from './goods/GoodsMainPage.vue';

export default {
    name: "ShopPage",
    props: {

    },
    components: { CarInfoCompo, GunInfoCompo, MyInfo, GoodsMainPage },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            visibleGoodsShop: false, preVisibleGoodsShop: false,  
        });

        const methods = {
            routeUrl: (url)=>{
                router.push(url);
            },
            goodsOn: ()=>{
                params.value.preVisibleGoodsShop = !params.value.visibleGoodsShop;

                if(params.value.preVisibleGoodsShop === false){
                    $('#goodsDecorator').css('width', '0%');
                }
            },
            goodsOnDebounced: null,
            goodsVisible: ()=>{
                $('#goodsDecorator').css('width', '100%');
                params.value.visibleGoodsShop = true;
            },
            goodsInvisible: ()=>{
                
                params.value.visibleGoodsShop = false;
            }
        };

        watch(()=>store.getters.GET_IS_LOGIN, (newVal, oldVal)=>{
            if(newVal){
                
            } else{
                methods.routeUrl('/main');
            }
        })

        onMounted(()=>{
            if(!store.getters.GET_IS_LOGIN) {
                // store.commit('CREATE_ALERT', {msg: "로그인 후 이용가능한 서비스 입니다.", time: 2, type:"danger"});
                methods.routeUrl('/main');
            }

            if(route.fullPath.indexOf('isBuying') !== -1){
                // methods.routeURL('/main/shop?isBuying1');
                methods.goodsOn();
            }
        });

        methods.goodsOnDebounced = _.debounce(methods.goodsOn, 500);

        return {
            params, methods, store
        };
    }
}
</script>

<style scoped>
#shopBodyWrapper{
    padding: 70px 0;
}

.tb-orange-border{
    border-top: 5px solid orange;
    border-bottom: 5px solid orange;
}


/* .test-border{
    border: 1px solid 
} */

#goodsDecorator{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    margin: 0px;
    padding: 0px;
    border: 0px solid transparent;
    background-color: aquamarine;
    z-index: 0;
}

#weaponWrapper, #carWrapper, #goodsWrapper{
    position: relative;
}

#itemMiniWrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: rgba(0,0,0,0.9);
}

.goodsDecorator-fade-enter-from{
    width: 0%;
    opacity: 0;
}

.goodsDecorator-fade-enter-to{
    width: 100%;
    opacity: 1;
}

.goodsDecorator-fade-leave-from{
    width: 100%;
    opacity: 1;
}

.goodsDecorator-fade-leave-to{
    width: 0%;
    opacity: 0;
}

.goodsDecorator-fade-enter-active{
    transition: all 0.3s ease;
}

.goodsDecorator-fade-leave-active{
    transition: all 0.3s ease;
}

</style>
<template>
    <div id="InfoRootWrapper" :class="`container-fluid m-0 px-0 py-2 d-flex flex-${store.getters.GET_BROWSER_SIZE < 1000? 'column': 'wrap'} justify-content-around text-center fspl`">
        <br v-if="store.getters.GET_BROWSER_SIZE < 1000">
        <div id="valueWrapper" :class="`w-${store.getters.GET_BROWSER_SIZE < 1000? '100': '50'} m-0 p-0 d-flex flex-wrap justify-content-around align-items-center`">
            <div id="cashInfoWrapper" :class="`w-${store.getters.GET_BROWSER_SIZE < 1000? '100': '50'} d-flex flex-wrap is-have-plain-transition p-0`">
                <i class="bi bi-cash-coin align-self-center w-25 m-0 p-0"></i>
                <div class="w-75 m-0 p-0 text-start">
                    : {{methods.getInfo('cash')}}
                </div>
            </div>
            <div id="moneyInfoWrapper" :class="`w-${store.getters.GET_BROWSER_SIZE < 1000? '100': '50'} d-flex flex-wrap is-have-plain-transition p-0`">
                <i class="bi bi-cash align-self-center w-25 m-0 p-0"></i>
                <div class="w-75 m-0 p-0 text-start">
                    : {{methods.getInfo('money')}}
                </div>
            </div>
        </div>
        <br v-if="store.getters.GET_BROWSER_SIZE < 1000">
        <div id="buttonWrapper" :class="`w-${store.getters.GET_BROWSER_SIZE < 1000? '100': '50'} m-0 p-0 d-flex justify-content-around align-items-center`">
            <div id="myProductInfoWrapper" class="w-25 d-flex flex-wrap is-have-plain-transition p-0 justify-content-end">
                <div @click="store.commit('OPEN_FOREGROUND', {name: 'ManagedGoodsVue'});"
                class="btn btn-warning w-100">
                    상품 관리
                </div>
            </div>
            <div id="myProductBuyingInfoWrapper" class="w-25 d-flex flex-wrap is-have-plain-transition p-0 justify-content-center">
                <div @click="store.commit('OPEN_FOREGROUND', {name: 'MyGoodsPurcahseLogListVue'});"
                class="btn btn-success w-100">
                    주문내역
                </div>
            </div>
            <div @click="methods.openCashChargeForm"
            id="myProductBuyingInfoWrapper" class="w-25 d-flex flex-wrap is-have-plain-transition p-0 justify-content-start">
                <div class="btn btn-primary w-100">
                    충전
                </div>
            </div>
        </div>
        <br v-if="store.getters.GET_BROWSER_SIZE < 1000">
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import axios from 'axios';

export default {
    name: "MyInfo",
    props: {

    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            info: null
        });

        const methods = {
            getInfoBase: ()=>{
                axios.get('/info/base')
                .then((res)=>{
                    // console.log(res.data.result);
                    params.value.info = Object.assign(res.data.result, {});
                })
                .catch((err)=>{
                    console.log(err);
                });
            },
            getInfo: (arg0)=>{
                // console.log(params.value.info);
                if(params.value.info){
                    return params.value.info[arg0];
                } else{
                    return 'NULL';
                }
            },
            openCashChargeForm: ()=>{
                store.commit('OPEN_FOREGROUND', {name: 'CashChargeVue'});
            }
        };

        onMounted(()=>{
            methods.getInfoBase();
        });

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

.w-20{
    width: 20%;
}

</style>
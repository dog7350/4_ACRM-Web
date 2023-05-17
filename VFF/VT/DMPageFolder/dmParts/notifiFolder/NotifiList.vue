<template>
    <div :class="`d-flex flex-wrap container-fluid justify-content-center text-center`">
        <div class="w-100 d-flex justify-content-end fspll py-2 px-2">
            <div class="container-fluid fspll text-start align-self-center" style="font-weight:bold;">
                알림
            </div>
            <div class="d-flex">
                <i @click="methods.notifiChange(params.notifiIsVisible? false: true)"
                :class="`bi bi-chevron-double-${params.notifiIsVisible? 'up': 'down'} over-cursor align-self-center is-have-plain-transition`"></i>
            </div>
        </div>
        <div id="line" class="w-100 mb-2">

        </div>
        <transition name="fast-fade" mode="out-in">
            <div v-if="params.notifiIsVisible"
            id="notifiListIsVisible" class="d-flex flex-wrap container-fluid justify-content-center text-center px-0">
                <!-- <div id="notifiTitle" 
                class="w-100 fspll font-bold my-4">
                    알림
                </div> -->

                <transition-group name="fast-fade" tag="ul" style="listStyle:none;" class="w-100 p-0 m-0">
                    <NotifiPart v-for="item, key in params.notifiList" :key="key" :item="item">
                    </NotifiPart>
                </transition-group>

                <div v-if="params.listIsEnd" @click="methods.getNotifi" id="moreButton" class="w-100 over-cursor border-radius-b my-3 btn btn-outline-primary btm-sm">
                    더보기
                </div>

                <div v-else id="notifiExist" class="w-100 fspm font-bold my-4">
                    더이상 불러올 알림이 없습니다.
                </div>

                <div v-if="params.isAdd" id="closeButton" class="w-100 over-cursor">
                    닫기
                </div>
            </div>
            <div v-else @click="methods.notifiChange(true)"
            id="notifiListIsUnvisible" class="d-flex flex-wrap container-fluid justify-content-center text-center px-0 py-0 over-cursor">
            </div>
        </transition>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';

import NotifiPart from './NotifiPart.vue';


export default {
    name:'NotifiList',
    components: { NotifiPart },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            notifiList: [], listIsEnd: true, isAdd: false,
            notifiIsVisible: false,
        });

        const methods = {
            getNotifi: ()=>{
                let index = params.value.notifiList.length;
                AXIOS.get(`/info/notifi?nindex=${index === 0? 100000000: params.value.notifiList[index-1].nindex}`)
                .then((res)=>{
                    let resar = res.data.result;

                    params.value.notifiList.push(...resar);

                    console.log(resar.length);
                    if(resar.length === 0 || resar.length < 7){
                        params.value.listIsEnd = false;
                    } else{
                        params.value.listIsEnd = true;
                    }
                })
                .catch((err)=>{
                    console.log(err);
                });
            },
            notifiChange: (arg0)=>{
                if(arg0) store.state.existNotifi = false;
                params.value.notifiIsVisible = arg0;
            }
        };

        onMounted(()=>{
            methods.getNotifi();
            // methods.notifiChange(true);
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{

        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
#notifiTitle{
    border-top: 1px black solid;
    border-bottom: 1px black solid;
}

#notifiExist{
    background-color: darkgrey;
}

#line{
    height: 3px;
    background-color: black;
}
</style>
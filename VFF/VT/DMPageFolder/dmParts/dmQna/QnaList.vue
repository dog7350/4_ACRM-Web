<template>
    <div :class="`d-flex flex-wrap container-fluid justify-content-center text-center`">
        <div class="w-100 d-flex justify-content-end fspll py-2 px-2">
            <div class="container-fluid fspll text-start align-self-center" style="font-weight:bold;">
                Q&amp;A&nbsp;&nbsp;
            </div>
            <div class="d-flex">
                <i id="qnaPlayButton" @click="methods.qnaChange(params.qnaVisible? false: true)"
                :class="`bi bi-chevron-double-${params.qnaVisible? 'up': 'down'} over-cursor align-self-center is-have-plain-transition`"></i>
            </div>
        </div>
        <div id="line" class="w-100 mb-2">

        </div>
        <transition name="fast-fade" mode="out-in">
            <div v-if="params.qnaVisible" id="qnaListIsVisible" class="d-flex flex-wrap container-fluid justify-content-center text-center px-0 pb-2">
                <QnaPart />
            </div>
            <div v-else id="qnaListIsUnVisible" @click="methods.qnaChange(true)"
            class="d-flex flex-wrap container-fluid justify-content-center text-center px-0 py-0 over-cursor">

            </div>
        </transition>

        
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';

import QnaPart from './QnaPart.vue';

export default {
    name:'QnaList',
    components: {
        QnaPart
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            qnaVisible: false,
        });

        const methods = {
            qnaChange: (arg0)=>{
                params.value.qnaVisible = arg0;
            }
        };

        onMounted(()=>{
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{
            methods.qnaChange(false);
        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
#line{
    height: 3px;
    background-color: black;
}
</style>
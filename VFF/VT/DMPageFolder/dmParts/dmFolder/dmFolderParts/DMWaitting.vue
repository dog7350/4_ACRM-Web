<template>
    <div id="WaittingWrapper" class="w-100 p-0 d-flex flex-wrap">
        <div id="loadingding" class="d-flex justify-content-center w-100">
            <i class="bi bi-hourglass align-self-center icon-size-standard w-100 is-have-plain-transition fspll" :style="`color: ${props.color? props.color: 'black'};`"></i>
        </div>
        <transition name="fast-fade" mode="out-in">
            <div class="w-100 text-center is-have-plain-transition fspl font-bold" :style="`color: ${props.color? props.color: 'black'};`" v-if="true">
                {{props.payload}}
            </div>
        </transition>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import AXIOS from 'axios';


export default {
    name:'DMWaitting',
    props: {
        payload: String,
        color: String,
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        

        const params = ref({
            
        });

        const methods = {

        };

        onMounted(()=>{
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
#loadingding{
    animation: loadingAnimation 2s infinite ease;
}

@keyframes loadingAnimation {
    0% {

    }
    100%{
        transform: rotate(2turn);
    }
}
</style>
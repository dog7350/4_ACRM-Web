<template>
    <div @click="store.commit('REMOVE_ALERT')"
     class="d-flex align-items-center justify-content-center" 
    :style="`position:fixed; z-index:${store.getters.GET_IS_LOADING? '4000': '-4000'}; top:0; right:0 left:0; width:100%; height:100%; background: ${store.getters.GET_IS_LOADING? 'rgba(0,0,0,0.7)': 'rgba(0,0,0,0)'};`">

        <div id="loadingding" class="d-flex">
            <i class="bi bi-hourglass align-self-center"></i>
        </div>
        
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'

export default {
    name:'LoadingVue',
    setup() {
        const store = Store;

        const params = ref({
        });

        const methods = {

        };

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>
#loadingding{
    font-size: 150px;
    color:white;
    animation: loadingAnimation 2s infinite ease;
}

@keyframes loadingAnimation {
    0%{

    }
    100%{
        transform: rotate(2turn);
    }
}
</style>
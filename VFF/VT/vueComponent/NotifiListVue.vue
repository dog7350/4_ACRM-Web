<template>
    <div id="notifiRootWrapper" class="d-flex justify-content-center text-center" style="position:fixed; z-index:1501; width:35%; height: auto; min-width:400px;">
        {{store.getters.GET_NOTIFI_STAT}}
    </div>
</template>

<script>
import { ref, onBeforeMount, onBeforeUnmount, watch, Component, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name: 'NotifiListVue',
    setup() {
        const store = Store;
        const router = useRouter();

        const params = ref({

        });

       

        const methods = {
            
        };

        
        onMounted(()=>{
            
        });

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

#notifiRootWrapper{
    background-color: white;
    color: black;
}

</style>
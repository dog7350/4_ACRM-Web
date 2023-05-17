<template>
    <div id="loadingWrapper" class="container-fluid d-flex justify-content-center text-center">
        <div id="loadingding" class="d-flex">
            <i class="bi bi-hourglass align-self-center icon-size-standard"></i>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import AXIOS from 'axios';

export default {
    name:'ResultLoadingVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        
        const params = ref({
        });

        const methods = {

        }

        onMounted(()=>{
            
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
    0%{

    }
    100%{
        transform: rotate(2turn);
    }
}

</style>

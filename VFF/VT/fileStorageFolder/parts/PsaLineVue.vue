<template>
    <div id="psaLineWrapper">
        Hello World 3
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';

export default {
    name:'PsaLineVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        

        const params = ref({
            index: 0
        });

        const methods = {
        }

        onMounted(()=>{

        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>

</style>
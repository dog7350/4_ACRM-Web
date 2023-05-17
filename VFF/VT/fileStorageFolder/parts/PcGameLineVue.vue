<template>
    <div id="pcGameLineWrapper">
        Hello World 1
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';

export default {
    name:'PcGameLineVue',
    props:{
        fileInfoList: Array
    },
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
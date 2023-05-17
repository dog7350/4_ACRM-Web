<template>
    <div class="container-fluid justify-content-center mx-auto white-font">

        <div v-if="props.isMulti">더이상 로드할 게시글이 존재하지 않습니다.</div>
        <div v-else>더이상 로드할 댓글이 존재하지 않습니다.</div>
        
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'

export default {
    name:'EndOfBoxVue',
    props:{
        isMulti: Boolean,
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

</style>
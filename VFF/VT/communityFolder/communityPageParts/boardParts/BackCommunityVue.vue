<template>
    <div id="userBoardBack" class="over-cursor px-2" @click="methods.backCaller">
        <i class="bi bi-arrow-bar-left fspll"></i> {{props.content}}
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'

export default {
    name:'BackCommunityVue',
    props: {
        content: String
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            

        });

        const methods = {
            backCaller: ()=>{
                context.emit('BACKCALLER', {isOpen: 'a'});
            }
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
<template>
    <div v-if="store.getters.GET_BROWSER_SIZE > 1000" id="rightStickyBar" :class="`d-flex flex-column is-under-head-sticky test-border border-radius-d `" >
        
        <transition-group name="fast-fade" mode="out-in">
            <div v-if="!store.getters.GET_IS_LOGIN"
            id="pleaseLoginRightStickyWrapper" :class="`container-fluid my-5`">
                로그인 후 이용하실 수 있습니다.
            </div>



            <right-sticky-friends-wrapper-vue v-if="store.getters.GET_IS_LOGIN"
            @CHANGEPAGE="methods.clickUserProfile"></right-sticky-friends-wrapper-vue>
        </transition-group>

    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import RightStickyFriendsWrapperVue from './rightStickContents/RightStickyFriendsWrapperVue'

export default {
    components: {
        RightStickyFriendsWrapperVue
    },
    name:'RightStickyVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            

        });

        const methods = {
            clickUserProfile: (payload)=>{
                context.emit('CHANGEPAGE', payload);
            }
        };

        onMounted(()=>{

        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{

        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>
#rightStickyBar{
    padding: 0.5rem;
}

</style>
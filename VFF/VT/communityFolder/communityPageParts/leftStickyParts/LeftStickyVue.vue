<template>
    <div v-if="store.getters.GET_BROWSER_SIZE > 700" id="leftStickyBar" class="d-flex flex-column is-under-head-sticky test-border p-2 invisible-scrollbar">
        <left-sticky-tab-vue @VUECALLER="methods.tabVueCaller" :currentBoardType="props.currentBoardType" :index="0" :iconSrc="'bi bi-archive'" :text="'전체'" :emitText="'전체'"></left-sticky-tab-vue>
        <left-sticky-tab-vue @VUECALLER="methods.tabVueCaller" :currentBoardType="props.currentBoardType" :index="1" :iconSrc="'bi bi-chat-dots'" :text="'잡담'" :emitText="'잡담'"></left-sticky-tab-vue>
        <left-sticky-tab-vue @VUECALLER="methods.tabVueCaller" :currentBoardType="props.currentBoardType" :index="2" :iconSrc="'bi bi-emoji-laughing'" :text="'유머'" :emitText="'유머'"></left-sticky-tab-vue>
        <left-sticky-tab-vue @VUECALLER="methods.tabVueCaller" :currentBoardType="props.currentBoardType" :index="3" :iconSrc="'bi bi-boombox'" :text="'정보'" :emitText="'정보'"></left-sticky-tab-vue>
        <left-sticky-tab-vue @VUECALLER="methods.tabVueCaller" :currentBoardType="props.currentBoardType" :index="4" :iconSrc="'bi bi-broadcast-pin'" :text="'공지'" :emitText="'공지'"></left-sticky-tab-vue>
        <hr class="mb-1" style="backgroundColor: rgba(0,0,0,0);">

        <transition-group name="standard-fade" mode="out-in">
            <left-sticky-tab-codef-vue :key="3" :current_codef="props.codefHelper" @CODEFCALLER="methods.codefVueCaller" :index="3" :iconSrc="'bi bi-person-heart'" :text="'팔로우'" :emitText="'팔로우'"></left-sticky-tab-codef-vue>
            <left-sticky-tab-codef-vue :key="4" :current_codef="props.codefHelper" @CODEFCALLER="methods.codefVueCaller" :index="4" :iconSrc="'bi bi-person-hearts'" :text="'친구'" :emitText="'친구'"></left-sticky-tab-codef-vue>
            <left-sticky-tab-codef-vue :key="5" :current_codef="props.codefHelper" @CODEFCALLER="methods.codefVueCaller" :index="5" :iconSrc="'bi bi-people-fill'" :text="'새소식'" :emitText="'새소식'"></left-sticky-tab-codef-vue>
        </transition-group>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import LeftStickyTabVue from './LeftStickyTabVue.vue';
import LeftStickyTabCodefVue from './LeftStickyTabCodefVue.vue';

export default {
    components: { LeftStickyTabVue, LeftStickyTabCodefVue },
    name:'LeftStickyVue',
    props: {
        codefHelper: Number,
        currentBoardType: String,
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({

        });

        const methods = {
            tabVueCaller: (payload)=>{
                context.emit("LEFTCALLER", payload);
            },
            codefVueCaller: (payload)=>{
                context.emit("LEFTCODEFCALLER", payload);
            },
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
#leftStickyBar{
    /* min-height: 550px; */
    height: fit-content;
    overflow: scroll;
    max-height: 80vh;
}
</style>
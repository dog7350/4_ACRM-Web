<template>
    <div :class="`d-flex flex-wrap container-fluid justify-content-center text-center`">
        <div class="w-100 d-flex justify-content-end fspll py-2 px-2">
            <div class="container-fluid fspll text-start align-self-center" style="font-weight:bold;">
                DM&nbsp;&nbsp;
                <span v-if="store.state.dmIsAlive && store.state.targetId" style="color:rgba(26, 102, 241, 1);">
                    <!-- 현재 연결 상대: {{store.state.targetId}} -->
                </span>
            </div>
            <div class="d-flex">
                <i id="dmPlayButton" @click="methods.dmChange(params.dmVisible? false: true)"
                :class="`bi bi-chevron-double-${params.dmVisible? 'up': 'down'} over-cursor align-self-center is-have-plain-transition`"></i>
            </div>
        </div>
        <div id="line" class="w-100 mb-2">

        </div>
        <transition name="fast-fade" mode="out-in">
            <div v-if="params.dmVisible" id="dmListIsVisible" class="d-flex flex-wrap container-fluid justify-content-center text-center px-0 pb-2">
                <DmPart />
            </div>
            <div v-else id="dmListIsUnVisible" @click="methods.dmChange(true)"
            class="d-flex flex-wrap container-fluid justify-content-center text-center px-0 py-0 over-cursor">

            </div>
        </transition>

        
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';
import DmPart from './DmPart.vue';

export default {
    name:'DmList',
    components: { DmPart },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            dmVisible: false,
        });

        const methods = {
            dmChange: (arg0)=>{
                params.value.dmVisible = arg0;
            }
        };

        onMounted(()=>{
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{
            methods.dmChange(false);
        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
#line{
    height: 3px;
    background-color: black;
}
</style>
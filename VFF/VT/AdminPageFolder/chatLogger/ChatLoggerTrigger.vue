<template>
    <div id="chatLoggerTriggerWrapper" 
    class="d-flex flex-wrap justify-content-center align-items-center is-have-plain-transition"
    :style="`${params.chatLogVisible? 'position: fixed; color: black; top: 30px; z-index: 160;': ''}`">
        <i @click="methods.visibleReverse"
        id="undTrigger" :class="`bi bi-chevron-double-down over-cursor fsplll mb-2 is-have-plain-transition ${params.chatLogVisible? 'overroll': ''}`"></i>
        <div @click="methods.visibleReverse" 
        :class="`container-fluid text-center p-0 m-0 fsps is-have-plain-transition`">
            <span :style="`position: relative; z-index: 160; ${params.chatLogVisible? 'color: black;': ''}`"
             class="over-cursor">
                {{
                    params.chatLogVisible?
                    '닫기': '채팅 확인'
                }}
            </span> 
        </div>

        <transition name="fade-watcher" mode="out-in">
            <ChatWatcher v-if="params.chatLogVisible"/>
        </transition>
        
    </div>  
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';

import ChatWatcher from './chatBodyFolder/ChatWatcher.vue';

export default {
    components: { ChatWatcher },
    name:'ChatLoggerTrigger',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        
        const params = ref({
            chatLogVisible: false,
        });

        const methods = {
            routeURL: (routeUrl)=>{
            },
            visibleReverse: ()=>{
                params.value.chatLogVisible = !params.value.chatLogVisible;
            }
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

#chatLoggerTriggerWrapper{
    position: fixed;
    top: 20;
    z-index: 150;
    color: white;
    width: 100vw;
    padding: 0;
    margin: 0;
}

.overroll{
    transform: rotate(180deg);
}

#undTrigger{
    position: relative;
    z-index: 153;
}

.fade-watcher-enter-from, 
.fade-watcher-leave-to{
    opacity: 0;
    transform: translateY(-50px);
}

.fade-watcher-enter-active,
.fade-watcher-leave-active {
  transition: all 0.4s ease;
}

</style>
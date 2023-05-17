<template>
    <div>
        <!-- <transition name="page-slide-fade" mode="out-in">
            <component v-if="store.state.isPopupNavigation" id="main-nav" :is="store.getters.GET_NAVIGATION_COMPONENT"></component>
        </transition> -->

<!--  -->
        <router-view v-slot="{ Component }">
            <transition name="page-slide-fade" mode="out-in">
                <component :is="Component"></component>
            </transition>
        </router-view> 
<!--  -->

        <div class="d-flex align-items-center justify-content-center" 
        :style="`position:fixed; z-index:${params.fgzi}; top:0; right:0 left:0; width:100vw; height:100vh; background: rgba(0, 0, 0, 0);`">
            <transition-group name="standard-fade" @after-leave="params.fgzi = -1500" @before-enter="params.fgzi = 1500">
                <div v-if="store.getters.GET_POPUP_STATE" @click="store.commit('CLOSE_BASE_FOREGROUND')" id="modalBackground"
                class="d-flex align-items-center justify-content-center"
                :style="`position:fixed; z-index:${params.fgzi}; top:0; right:0 left:0; width:100vw; height:100vh; background: rgba(0, 0, 0, 0.5);`"></div>
            </transition-group>

            <transition-group name="standard-fade">
                <component v-if="store.getters.GET_POPUP_STATE"
                :is="store.getters.GET_FOREGROUND_COMPONENT"></component>
            </transition-group>
        </div>
        
        <transition name="alert-fade">
            <component v-if="store.getters.GET_IS_ALERT" :is="store.getters.GET_ALERT"></component>
        </transition>

        <transition name="fast-fade" mode="out-in">
            <component v-if="store.getters.GET_IS_LOADING" :is="store.getters.GET_LOADING"></component>
        </transition>

        <multi-action-vue></multi-action-vue>

        <transition name="dm-fade" mode="out-in" @after-enter="methods.dmViewAfterAction">
            <DMVue v-if="store.getters.GET_IS_DM_VIEW"/>
        </transition>

        <transition name="fast-fade" mode="out-in">
            <DMActionVue v-if="store.getters.GET_IS_LOGIN"></DMActionVue>
        </transition>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUpdated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';

import Store from '../VXS/VuexStore'
import AXIOS from 'axios';
import io from 'socket.io-client';
import { connect } from 'socket.io-client';
import MultiActionVue from './vueComponent/MultiActionVue.vue';
import DMActionVue from './vueComponent/DMActionVue.vue';
import DMVue from './DMPageFolder/DMVue.vue';

export default {
        components: { MultiActionVue, DMActionVue, DMVue },
        name: 'IndexVue',
        setup() {
        const store = Store;
        store.commit('LOGIN_CHECK');

        // store.commit('CREATE_LOADING');

        const route = useRoute();
        const router = useRouter();

        const params = ref({
            modalBackgroundStyle: '',
            fgVisible: false,
            fgzi: -1000,
            navVisible: true,
        });

        const intervals = {
            loginChecker: null,
        };
        
        const methods = {
            dmViewAfterAction: ()=>{
                store.commit("SET_DM_VIEW_ON", {isOn: true});
            }
        };
        
        const computeds = {
            isPopup: computed(()=>store.getters.GET_POPUP_STATE)
        };
        let sizeInterval = null;

        onUpdated(()=>{
            
        });

        onMounted(()=>{          
            store.state.browserSize = window.innerWidth;
            store.state.browserHeight = window.innerHeight;

            window.onresize = ()=>{
                store.state.browserSize = window.innerWidth;
                store.state.browserHeight = window.innerHeight;
            };

            // var socket = io('https://accromemories.p-e.kr:443');
            var socket = io.connect({ transports: ["websocket"] });
            // var socket = connect();

            store.commit('REGIST_SOCKET', {'socketio':socket});

            socket.on('connect', async ()=>{
                intervals.loginChecker = setInterval(()=>{
                    socket.emit('login_check', {});
                }, 1000);
            });

            socket.on('disconnect', async ()=>{
                clearInterval(intervals.loginChecker);

                store.state.auth = '';
                store.state.isLogin = false;
            });

            socket.on('create_notifi', (payload)=>{
                console.log('create_notifi', payload);
                store.state.existNotifi = true;
            });

            socket.on('login_status_on_result', (payload)=>{
                console.log(payload);
            });

            socket.on('login_status_off_result', (payload)=>{
                console.log(payload);
            });

            

            socket.on('login_check_result', (payload)=>{
                // console.log(payload);
                if(payload.code !== -1){
                    store.state.auth = payload.result.loginValid;
                    store.state.isLogin = payload.result.loginStatus;
                } else{
                    store.state.auth = '';
                    store.state.isLogin = false;
                    store.commit('LOGIN_CHECK');
                }
            });


            if(store.getters.GET_IS_LOGIN){
                socket.emit('login_status_on', document.cookie);
            }

            watch(()=>store.getters.GET_IS_LOGIN, (a, b)=>{
                console.log(a, b);
                if(a === true){
                    socket.emit('login_status_on', document.cookie);
                } else{
                    socket.emit('login_status_off', {});
                }
            });
        });

        return{
            params, methods, store, computeds
        };
    },
}
</script>

<style scoped>
.page-slide-fade-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.page-slide-fade-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.page-slide-fade-enter-active,
.page-slide-fade-leave-active {
  transition: all 0.5s ease;
}

/* @keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-fade-enter-active{
    animation: bounce-in 0.5s;
}

.loading-fade-leave-active{
    animation: bounce-in 0.5s reverse;
} */


.alert-fade-enter-from{
    transform: translateX(-10%);
    opacity: 0;
}
.alert-fade-leave-to{
    transform: translateX(10%);
    opacity: 0;
}
.alert-fade-enter-active,
.alert-fade-leave-active{
    transition: all 0.5s ease;
}

.dm-fade-enter-from{
    transform: translateY(100%);
    opacity: 0;
}
.dm-fade-leave-to{
    transform: translateY(100%);
    opacity: 0;
}
.dm-fade-enter-active,
.dm-fade-leave-active{
    transition: all 0.5s ease;
}

/* .alert-fade-enter-active{
    animation: bounce-in 0.5s;
}

.alert-fade-leave-active{
    animation: bounce-in 0.5s reverse;
} */
</style>
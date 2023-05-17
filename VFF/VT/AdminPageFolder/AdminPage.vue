<template>
    <div id="AdminPageContainerWrapper"
    class="container-fluid d-flex justify-content-center align-content-center white-font">
        <div v-if="params.isVisible"
        id="adminPageContainer" class="container-fluid d-flex justify-content-center align-content-center">
            <div id="adminPageHeaderWrapper" class="container-fluid d-flex justify-content-center">
                <admin-header-vue  :itemList="params.actionList"
                ></admin-header-vue>
            </div>

            <div id="adminPageBodyWrapper" class="container-fluid d-flex justify-content-center">
                <admin-body-vue @BODYACTIONREGISTED="methods.bodyActionRegisted"
                ></admin-body-vue>
            </div>
        </div>
        <!-- <ChatLoggerTrigger/> -->
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import AdminHeaderVue from './headerParts/AdminHeaderVue.vue';
import AdminBodyVue from './bodyParts/AdminBodyVue.vue';
import ChatLoggerTrigger from './chatLogger/ChatLoggerTrigger.vue';

export default {
  components: { AdminHeaderVue, AdminBodyVue, ChatLoggerTrigger },
    name:'AdminPage',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        let checkInterval = null;
        
        const params = ref({
            index: 0,
            actionList: [], isVisible: false
        });

        const methods = {
            bodyActionRegisted: (payload)=>{
                params.value.actionList.push(payload);
                // console.log(payload);
            }
        }

        onMounted(()=>{
            setTimeout(()=>{
                if(!store.getters.GET_IS_LOGIN){
                    store.commit('CREATE_ALERT', {msg:'잘못된 접근입니다.', time: 2, type:"danger"});
                    router.push('/main');
                } else if(['o', 'm'].indexOf(store.getters.GET_AUTH) === -1){
                    store.commit('CREATE_ALERT', {msg:'권한이 부족합니다.', time: 2, type:"danger"});
                    router.push('/main');
                } else{
                    params.value.isVisible = true;

                    try{
                        checkInterval = setInterval(()=>{
                            try{
                                // store.commit("LOGIN_CHECK");

                                if(!store.getters.GET_IS_LOGIN){
                                    store.commit('CREATE_ALERT', {msg:'로그아웃이 감지되었습니다.', time: 2, type:"danger"});
                                    router.push('/main');
                                } else if(store.getters.GET_AUTH !== 'o'){
                                    store.commit('CREATE_ALERT', {msg:'권한이 부족합니다.', time: 2, type:"danger"});
                                    router.push('/main');
                                }
                            }
                            catch(error){
                                console.log(error);
                                store.commit('CREATE_ALERT', {msg:'잘못된 접근입니다.', time: 2, type:"danger"});
                                router.push('/main');
                            }
                        }, 1000);
                    }
                    catch(error){
                        console.log(error);
                        store.commit('CREATE_ALERT', {msg:'서버에 문제가 발생했습니다.', time: 2, type:"danger"});
                        router.push('/main');
                    }
                }
            }, 50);
        });

        onUnmounted(()=>{
            try{
                clearInterval(checkInterval);
            }
            catch(error){
                console.log(error);
            }
        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>
#AdminPageContainerWrapper{
    width: 100vw;
    padding: 0;
}

#adminPageContainer{
    width: 100%;
    height: fit-content;
    background: transparent;
    padding: 0;
}

#adminPageHeaderWrapper{
    position: sticky;
    top: 0;
    left: 0;
    width: 20%;
    height: 100vh;
    min-height: 100vh;
    background: transparent;
    padding: 10vh 0 20vh 0;
    padding: 0;
}

#adminPageBodyWrapper{
    width: 80%;
    min-height: 100vh;
    background: transparent;
    padding: 0;
}
</style>
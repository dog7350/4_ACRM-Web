<template>
    <div id="StepThreeWrapper" class="w-100 p-0 d-flex flex-wrap">
        <transition name="fast-fade" mode="out-in">
            <div class="w-100 text-start fspl d-flex flex-wrap p-0" v-if="true">
                <div id="chatContentWrapper" class="w-100 fsps d-flex flex-wrap p-0 m-0 awesome-scroll" @scroll.self="methods.scrollDetect">
                    <transition-group name="chatList" mode="out-in" tag="ul" class="d-flex flex-wrap w-100 p-0 align-content-start" style="listStyle:none;" >
                        <li v-for="item, index in store.state.chatList" :key="index"
                        :class="`d-flex flex-wrap w-100 mt-3 justify-content-${params.myId===item.sender?'end me-2 ms-4': 'start me-4 ms-2'}`">
                            <div v-if="params.myId===item.sender"
                            class="fspss opacity-half align-self-end mb-1 me-1" v-text="item.date"></div>

                            <div :class="`alert alert-${params.myId===item.sender?'warning':'secondary'} py-2 px-1 m-0`" style="line-break: anywhere;"
                            v-text="item.receiveText">
                            </div>

                            <div v-if="params.myId!==item.sender"
                            class="fspss opacity-half align-self-end mb-1 me-1" v-text="item.date"></div>
                        </li>
                    </transition-group>
                </div>
                <div id="chatRecevieWrapper" class="w-100 fsps d-flex py-2 m-0">
                    <input type="text" class="w-75" v-model="params.textValue" @keypress.enter="methods.chat">
                    <input type="button" class="w-25" value="전송" @click="methods.chat">
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import AXIOS from 'axios';


export default {
    name:'DmStep3',
    props: {
        payload: Array
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            myId: store.getters.GET_MY_INFO.id,
            textValue: '',
        });

        const methods = {
            chat: (e)=>{
                console.log(params.value.textValue);
                context.emit("CHAT", {text: params.value.textValue});
                params.value.textValue = '';
            },
            scrollDetect: (e)=>{
                // console.log($('#chatContentWrapper').scrollTop(), e);
            }
        };

        onMounted(()=>{
            $('#DMRootContainer').animate({scrollTop: $('#DMRootContainer').scrollTop()+$('#DmRootWrapper').offset().top}, 300);
            $('#disconnectButton').on("click", ()=>{
                console.log('disconnect click');
                
                context.emit("DISCONNECT", {});
            });
            $('#chatContentWrapper').animate({scrollTop: $('#chatContentWrapper').prop('scrollHeight')-1}, 300);
            store.state.dmIsAlive = true;
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

#chatContentWrapper{
    align-content: flex-start;
    height: 300px;
    border: 3px solid rgb(118, 118, 118);
    overflow-x: hidden;
    overflow-y: inherit;
}

ul{
    align-content: flex-start;
}

ul>li{
    height: fit-content;
}

.chatList-enter-active, .chatList-leave-active{
    transition: all 0.3s ease;
}

.chatList-move{
    transition: all 0.3s ease;
}

.chatList-enter-from{
    opacity: 0;
}

.chatList-leave-to{
    opacity: 0;
}
</style>
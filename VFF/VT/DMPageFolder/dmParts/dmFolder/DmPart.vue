<template>
    <div id="DmPartWrapper" :class="`d-flex flex-wrap w-100 justify-content-center text-center`">
        <div :style="`${params.currentStep === -1? 'height: 0px;': ''}`"
        class="w-100 p-0 m-0 mb-2 d-flex justify-content-around text-center align-items-center">
            <transition name="fast-fade" mode="out-in">
                <div v-if="params.currentStep !== -1 && params.currentStep !== 3"
                class="w-100 m-0 p-0 d-flex justify-content-around align-items-center">
                    <div class="d-flex flex-wrap">
                        <div :class="`step d-flex ${params.currentStep === 1 || params.currentStep === 3? params.failed? 'current-step-exp': 'current-step-1': ''}`"><div class="align-self-center  w-100">1</div></div>
                    </div>
                    
                    <div class="d-flex flex-wrap">
                        <div :class="`step d-flex ${params.currentStep === 2 || params.currentStep === 3? params.failed? 'current-step-exp': 'current-step-2': ''}`"><div class="align-self-center  w-100">2</div></div>
                    </div>

                    <div class="d-flex flex-wrap">
                        <div :class="`step d-flex ${params.currentStep === 4 || params.currentStep === 3? params.failed? 'current-step-exp': 'current-step-3': ''}`"><div class="align-self-center  w-100">3</div></div>
                    </div>
                </div>
            </transition>
        </div>
        <div class="w-100 p-0 m-0 d-flex flex-wrap">
            <div id="currentStepNumberWrapper" v-if="params.currentStep === 3"
            :class="`align-items-center w-100 text-center d-flex alert alert-primary py-1 ${params.currentStep === 3?'justify-content-around':''}`">

                <div v-if="params.currentStep === 3"
                class="w-auto h-auto">
                    상대: {{store.state.targetId}}
                </div>

                <div v-if="params.currentStep === 3"
                class="w-auto h-auto">
                    <label>Auto Scroll:</label> &nbsp;<input type="checkbox" name="" id="autoScrollCheck" v-model="params.autoScroll">
                </div>

                <div v-if="params.currentStep === 3"
                class="w-auto h-auto">
                    <div id="disconnectButton" class="btn btn-danger fsps">연결종료</div>
                </div>
                
            </div>
            <transition name="fast-fade" mode="out-in">
                <DmStep1 @GOSTEPTWO="methods.connectRoom" v-if="params.currentStep === 1"/>
                <DmStep3 @CHAT="methods.step3ChatSend" @DISCONNECT="methods.disconnect" :payload="params.chatList" v-else-if="params.currentStep === 3"/>
                <DMWaitting :color="params.waittingColor" :payload="params.currentText" v-else/>
            </transition>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated, watchEffect, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';
import DmStep1 from './dmFolderParts/DmStep1.vue';
import DmStep3 from './dmFolderParts/DmStep3.vue';
import DMWaitting from './dmFolderParts/DMWaitting.vue';

export default {
    components: { DmStep1, DmStep3, DMWaitting },
    name:'DmList',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            currentStep: -1, currentText: '대기중', waittingColor: '', failed: false,
            stepList: [
                '아래 버튼을 눌러 시작해주세요!', 'DM 상대를 입력해주세요!', '처리중입니다.', '<div id="disconnectButton" class="btn btn-danger fsps">연결종료</div>'
            ],
            targetId: null, socket: store.getters.GET_SOCKET, targetName: '',
            chatList: [], autoScroll: true, connectOn: false,
        });

        const methods = {
            resetStep: async (payload)=>{
                store.state.dmIsAlive = false;
                params.value.currentText = '초기화중...';
                params.value.currentStep = -1;
                params.value.waittingColor = 'rgb(98, 0, 255)';

                try {
                    store.state.targetId = null;
                    params.value.targetName = null;
                    await methods.chatListReset();
                    await methods.chatRoomJoin(null);
                    setTimeout(()=>{
                        params.value.currentStep = 1;
                    }, 1500);

                }
                catch (error) {
                    console.log(error);
                }
            },
            connectRoom: (payload)=>{
                params.value.currentText = '연결중...';
                params.value.currentStep = 2;
                params.value.waittingColor = 'rgb(26, 102, 241)';

                store.state.targetId = payload.target;

                console.log(payload);

                methods.chatRoomJoin(store.state.targetId);
            },
            getChatList: async ()=>{
                let result = [];

                try {
                    
                }
                catch (error) {
                    console.log(error);
                }

                return result;
            },
            step3ChatSend: (payload)=>{
                if(payload.text.length > 0)
                    params.value.socket.emit("chatSend", {sendText: payload.text});
            },
            chatListReset: ()=>{
                store.state.chatList = [];
            },
            chatRoomJoin: (targetId)=>{ // null is room leave
                params.value.socket.emit("joinRoom", {targetID: targetId});
            },
            disconnect: ()=>{
                methods.resetStep();
            },
            changeCurrentText: (payload)=>{
                params.value.currentText = payload.text;
            },
        };

        watch(()=>params.value.autoScroll, (after, before)=>{
            // console.log(after, before);
        });

        onMounted(()=>{
            $('#DMRootContainer').animate({scrollTop: $('#DMRootContainer').scrollTop()+$('#DmRootWrapper').offset().top}, 300);

            if(store.state.dmIsAlive && !(route.query['match'] || route.query['target'])){
                params.value.currentStep = 3;
            } else {
                params.value.socket.on("joinRoomResult", (payload)=>{
                    // console.log(payload);
                    if(payload.code === 10 && params.value.currentStep === 2){
                        setTimeout(()=>{
                            params.value.targetName = payload.result;

                            params.value.currentText = '대화 불러오는중...';
                            params.value.currentStep = 4;
                            params.value.waittingColor = 'rgb(0, 156, 96)';

                            setTimeout(async ()=>{
                                try {
                                    var tempResult = await methods.getChatList();

                                    if(tempResult){
                                        store.state.chatList.push(...tempResult);
                                        params.value.socket.on("chatReceive", (payload)=>{
                                            store.state.chatList.push(payload);

                                            var chatWrapper = $('#chatContentWrapper');

                                            if(chatWrapper && params.value.autoScroll){
                                                chatWrapper.animate({scrollTop: chatWrapper.prop('scrollHeight')-1}, 300);
                                            }
                                        });
                                    }

                                    if(params.value.currentStep === 4){
                                        params.value.currentStep = 3;
                                    } else{
                                        methods.resetStep();
                                    }
                                }
                                catch (error) {
                                    console.log(error);

                                    methods.resetStep();
                                }
                            }, 1500);
                        }, 1500);
                    } else{
                        params.value.socket.off("chatReceive");

                        if(payload.code === -1){
                            params.value.failed = true;
                            params.value.currentText = '존재하지 않는 유저입니다.';

                            params.value.waittingColor = 'rgb(255, 51, 51)';
                            
                            setTimeout(()=>{
                                params.value.failed = false;
                                params.value.currentStep = 1;
                                store.state.targetId = null;
                                params.value.targetName = null;
                            }, 1500);
                        } else if(payload.code === -2){
                            params.value.failed = true;
                            params.value.currentText = '처리중 문제가 발생했습니다.';

                            params.value.waittingColor = 'rgb(255, 51, 51)';
                            
                            setTimeout(()=>{
                                params.value.failed = false;
                                params.value.currentStep = 1;
                                store.state.targetId = null;
                                params.value.targetName = null;
                            }, 1500);
                        }
                    }
                });

                methods.resetStep();
            }            
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{
            if(store.state.dmIsAlive === false){
                methods.resetStep();
            }
            
        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
#DmPartWrapper{
    min-height: 150px;
}

#currentStepNumberWrapper{
    height: fit-content;
}

.line{
    height: 3px;
    background-color: black;
}

.step{
    width: 50px;
    height: 50px;
    border-radius: 30%;
    border: 5px solid rgba(0, 0, 0, 0.4);
}

.current-step-1{
    border-color: rgb(98, 0, 255);
}

.current-step-exp{
    border-color: rgb(255, 51, 51);
}

.current-step-2{
    border-color: rgb(26, 102, 241);
}

.current-step-3{
    border-color: rgb(5, 250, 156);
}


</style>
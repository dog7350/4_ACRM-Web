<template>
    <div id="commentWriteBoxWrapper" class="d-flex flex-column px-0 mx-0 border-radius-b" style="z-index:1;">
        <div id="commentWriteBox" class="container-fluid d-flex flex-column p-0">
            <div id="commentWriteBoxTextWrapper" class="d-flex">
                <textarea 
                @keydown="methods.resizeTextArea"
                @keyup="methods.resizeTextArea"
                v-model="params.textValue"
                id="commentWriteBoxText" 
                class="flex-grow-1 fspm border-radius-b thin-y-scrollbar" 
                placeholder="댓글을 입력해주세요."></textarea>
            </div>

            <div id="commentWriteBoxSenderWrapper" class="d-flex justify-content-end">
                <button
                @mouseover="methods.hoverTextAreaValue"
                @click="methods.debouncedClickTextAreaValue"
                id="commentWriteBoxSender"
                class="border-radius-a">전송</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'UserCommentWriteVue',
    props: {
        currentBindex: JSON,
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            textValue: ''
        });

        const intervals = {
            textareaIntervals: null,
        };

        const methods = {
            hoverTextAreaValue: (e)=>{
                if(params.value.textValue.length > 0){
                    $('#commentWriteBoxSender').removeClass('is-not-ok');
                    $('#commentWriteBoxSender').addClass('is-ok');
                } else{
                    $('#commentWriteBoxSender').removeClass('is-ok');
                    $('#commentWriteBoxSender').addClass('is-not-ok');
                }
            },
            clickTextAreaValue: ()=>{
                if(store.getters.GET_IS_LOGIN){
                    if(params.value.textValue.length > 0){
                        var bodyData = {
                            bindex: props.currentBindex.index,
                            content: params.value.textValue,
                        };

                        var callback = ()=>{
                            try {
                                context.emit("CALL_COMMENT_UPDATE", {'bindex': bodyData.bindex});
                            } catch (error) {
                                console.log(error);
                            }
                        };

                        AXIOS.post('/community/comment', bodyData)
                        .then((response)=>{
                            console.log(response.data.result);
                            params.value.textValue = '';
                            callback();
                        })
                        .catch((error)=>{
                            console.log(error.response.data.result);
                        });
                    } else{
                        $('#commentWriteBoxSender').removeClass('is-ok');
                        $('#commentWriteBoxSender').addClass('is-not-ok');
                    }
                } else{
                    store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'});
                    store.commit('CREATE_ALERT', {msg:'로그인이 필요한 서비스 입니다.', time: 2, type:"danger"});
                }
            },
            resizeTextArea: (e)=>{
                if($('#commentWriteBoxText').prop('scrollHeight') >= 67 || $('#commentWriteBoxText').prop('scrollHeight') <= 130){
                    $('#commentWriteBoxText').css('height', 'auto');
                    $('#commentWriteBoxText').css('height', $('#commentWriteBoxText').prop('scrollHeight'));
                }
            },
            debouncedClickTextAreaValue: null,
        };

        methods.debouncedClickTextAreaValue = _.debounce(methods.clickTextAreaValue, 200);

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

input[type='text']{
    border: none;
    outline: none;
}

textarea{
    border: none;
    outline: solid transparent;
    overflow-x: hidden;
    overflow-y: scroll;
    resize: none;
    margin-bottom: 1.3vmin;
    max-height: 120px;
    padding: 1vmin;

    transition: all 0.3s ease;
}

textarea:focus{
    outline: solid rgb(43, 168, 120);
}

#commentWriteBoxSender{
    border: none;
    outline: none;
    background: white;
    color: black;
    transition: all 0.3s ease;
}

#commentWriteBoxSender.is-ok:hover{
    color: white;
    background: rgb(44, 93, 255);
}

#commentWriteBoxSender.is-not-ok:hover{
    color: white;
    background: rgb(255, 51, 51);
}

.thin-y-scrollbar::-webkit-scrollbar{
    width: 7px;
}

.thin-y-scrollbar::-webkit-scrollbar-thumb{
    border-radius: 4px;
    background-color: rgb(44, 93, 255);
}

.thin-y-scrollbar::-webkit-scrollbar-track{
    background-color: transparent;
    margin: 5px 2px 5px 0;
}

.thin-y-scrollbar::-webkit-scrollbar-button{
    display: none;
}

.thin-y-scrollbar::-webkit-scrollbar-corner{
    display: none;
}

.thin-y-scrollbar::-webkit-scrollbar-track-piece{
    display: none;
}

.thin-y-scrollbar::-webkit-resizer{
    display: none;
}

</style>
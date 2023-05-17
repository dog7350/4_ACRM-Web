<template>
    <div id="QuestionRegistRootWrapper" class="w-100 d-flex flex-wrap m-0 p-0 border-radius-c">
        <div @click="methods.changeSelected(true)"
        :style="`background-color: #f8d7da; color: #842029; border: 2px solid #f5c2c7`"
        :class="`w-100 d-flex flex-wrap border-radius-c p-2 over-cursor`">
            <div class="w-100 d-flex flex-wrap mb-2">
                제목: {{params.data.title}}
            </div>
            <div class="w-100 d-flex flex-wrap m-0 p-0 fsps">
                질문일자: {{yyyymmdd_HHMMSS(params.data.uploadDate)}}
            </div>
            <transition mode="out-in" name="fast-fade">
                <div 
                v-if="params.selected"
                :style="`background-color: #f8d7da; color: #842029; border: 2px solid #842029;`"
                class="d-flex flex-wrap w-100 m-2 p-2 text-start">
                    <div class="w-100 d-flex flex-wrap m-0 p-0">
                         Q&amp;A 내용: <br>{{params.data.contents}}
                    </div>
                    <div
                    style="border-top: 3px solid black;"
                    class="w-100 d-flex flex-wrap m-0 p-0">
                        <div class="w-100 d-flex flex-wrap m-0 p-0">
                            답변 내용: <br>{{params.data.asnwerContents}}
                            <textarea v-model="params.answerContent"
                            class="w-100 m-0 p-0 d-flex flex-wrap awesome-scroll">

                            </textarea>
                            <div @click="methods.debouncedAnswer"
                            class="w-100 d-flex flex-wrap justify-content-center m-0 p-0 btn btn-primary">
                                답변하기
                            </div>
                        </div>
                    </div>
                </div>
                <div
                v-else 
                :style="`background-color: #f8d7da; color: #842029; border: 2px solid #842029;`"
                class="d-flex flex-wrap w-100 m-2 p-2">
                    누르면 내용을 볼 수 있습니다.
                </div>
            </transition>
        </div>
    </div>
</template>


    
    

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../../VXS/VuexStore'
import AXIOS from 'axios';

import { debounce } from 'lodash';

const yyyymmdd_HHMMSS = (dateTime)=>{
    let result = 'yyyy-mm-dd HH:MM:ss';
    try{
        var timeZone = new Date(dateTime);
        var time = timeZone.toString().split(' ')[4];
        var date = null;

        var year = timeZone.getFullYear();
        var month = timeZone.getMonth()+1;
        var day = timeZone.getDate();

        date = `${year}-${("00"+month.toString()).slice(-2)}-${("00"+day.toString()).slice(-2)}`;
        result = date + ' ' + time;
    }
    catch(error){
        console.log(error);
    }

    return result;
}

export default {
    name:'AnswerQnaPart',
    props: {
        data: JSON
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            data: props.data,
            selected: false,
            answerContent: props.data.asnwerContents? props.data.asnwerContents: '',
        });

        const methods = {
            getMyQna: ()=>{
                
            },
            changeSelected: (next)=>{
                params.value.selected = next;
            },
            answer: ()=>{
                AXIOS.post('/qna/answer', {qindex: params.value.data.qindex, asnwerContents: params.value.answerContent})
                .then((response)=>{
                    store.commit("CREATE_ALERT", {msg: response.data.result, time: 2, type:"success"});
                    context.emit("CHANGEPAGE", 0);
                })
                .catch((error)=>{
                    store.commit("CREATE_ALERT", {msg: error.response.data.result, time: 2, type:"danger"});
                });
            },
            debouncedAnswer: null,
        };

        methods.debouncedAnswer = debounce(methods.answer, 1000);

        onMounted(()=>{

        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{

        });

        return{
            params, methods, store, props, yyyymmdd_HHMMSS
        };
    },
}
</script>

<style scoped>

/* #QuestionRegistRootWrapper{
    border: 3px solid rgb(255, 101, 101); 
    background-color: rgb(95, 209, 164);
} */

</style>
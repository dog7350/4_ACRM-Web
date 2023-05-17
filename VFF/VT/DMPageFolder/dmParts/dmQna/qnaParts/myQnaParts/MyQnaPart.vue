<template>
    <div id="QuestionRegistRootWrapper" class="w-100 d-flex flex-wrap m-0 p-0 border-radius-c">
        <div @click="methods.changeSelected"
        :style="`${params.data.isAnswerd? 'background-color: #cfe2ff; color: #084298; border: 2px solid #b6d4fe;': 'background-color: #f8d7da; color: #842029; border: 2px solid #f5c2c7;'}`"
        :class="`w-100 d-flex flex-wrap border-radius-c p-2 over-cursor`">
            <div class="w-100 d-flex flex-wrap mb-2">
                제목: {{params.data.title}}
            </div>
            <div class="w-100 d-flex flex-wrap m-0 p-0 fsps">
                {{yyyymmdd_HHMMSS(params.data.uploadDate)}}
            </div>
            <transition mode="out-in" name="fast-fade">
                <div 
                v-if="params.selected"
                :style="`${params.data.isAnswerd? 'background-color: #cfe2ff; color: #084298; border: 2px solid #084298;': 'background-color: #f8d7da; color: #842029; border: 2px solid #842029;'}`"
                class="d-flex flex-wrap w-100 m-2 p-2 text-start">
                    <div class="w-100 d-flex flex-wrap m-0 p-0">
                        내용: <br>{{params.data.contents}}
                    </div>
                    <div v-if="params.data.isAnswerd"
                    style="border-top: 3px solid black;"
                    class="w-100 d-flex flex-wrap m-0 p-0">
                        <div class="w-100 d-flex flex-wrap m-0 p-0">
                            답변자: {{params.data.answerer}}
                        </div>
                        <div class="w-100 d-flex flex-wrap m-0 p-0 fsps">
                            {{yyyymmdd_HHMMSS(params.data.answerDate)}}
                        </div>
                        <div class="w-100 d-flex flex-wrap m-0 p-0">
                            답변 내용: <br>{{params.data.asnwerContents}}
                        </div>
                    </div>
                </div>
                <div
                v-else 
                :style="`${params.data.isAnswerd? 'background-color: #cfe2ff; color: #084298; border: 2px solid #084298;': 'background-color: #f8d7da; color: #842029; border: 2px solid #842029;'}`"
                class="d-flex flex-wrap w-100 m-2 p-2">
                    누르면 내용을 볼 수 있습니다.
                </div>
            </transition>
            <div class="w-100 d-flex flex-wrap m-0">
                {{
                    params.data.isAnswerd? '답변이 완료된 상태입니다.': '답변이 완료되지 않은 상태입니다.'
                }}
            </div>
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
    name:'MyQnaPart',
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
        });

        const methods = {
            getMyQna: ()=>{
                
            },
            changeSelected: ()=>{
                params.value.selected = !params.value.selected;
            },
        };

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
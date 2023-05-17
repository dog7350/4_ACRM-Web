<template>
    <div id="QuestionRegistRootWrapper" class="w-100 d-flex flex-wrap m-2 p-2 border-radius-c">
        <div class="w-100 d-flex flex-wrap ">
            <div class="w-100 d-flex flex-column my-0">
                <h3><strong>Q&amp;A 등록</strong></h3>
                <div class="w-100 d-flex flex-wrap justify-content-start my-2">
                    <label class="font-bold" for="title">제목:</label>
                    <input v-model="params.title"
                    type="text" class="w-100 form-control" name="title" id="title" placeholder="제목을 입력해주세요.">
                </div>
                <div class="w-100 d-flex flex-wrap justify-content-start my-2">
                    <label class="font-bold" for="contents">내용:</label>
                    <textarea v-model="params.content"
                    style="min-height: 170px;" name="contents" id="contents" class="w-100 awesome-scroll form-control"></textarea>
                </div>
                <input @click="methods.debouncedSend" type="button"
                class="w-100 btn btn-primary my-2" value="제출"/>
                <input @click="methods.cancel" type="button"
                class="w-100 btn btn-danger mt-2" value="취소"/>
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

export default {
    name:'RegistVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            title: '', 
            content: '',
        });

        const methods = {
            send: ()=>{
                if(params.value.title.length < 5){
                    store.commit("CREATE_ALERT", {msg:'제목은 5글자 이상이여야 합니다.', time: 2, type:"danger"});
                } else if(params.value.content.length < 10){
                    store.commit("CREATE_ALERT", {msg:'내용은 10글자 이상이여야 합니다.', time: 2, type:"danger"});
                } else{
                    AXIOS.post('/qna', { title: params.value.title, content: params.value.content})
                    .then((response)=>{
                        store.commit("CREATE_ALERT", {msg: response.data.result, time: 2, type:"success"});
                        context.emit("CHANGEPAGE", 0);
                    })
                    .catch((error)=>{
                        store.commit("CREATE_ALERT", {msg: error.response.data.result, time: 2, type:"danger"});
                    });

                    params.value.title = '';
                    params.value.content = '';
                }
            },
            debouncedSend: null,
            cancel: ()=>{
                context.emit("CHANGEPAGE", 0);
            },
        };

        methods.debouncedSend = debounce(methods.send, 1000);

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



</style>
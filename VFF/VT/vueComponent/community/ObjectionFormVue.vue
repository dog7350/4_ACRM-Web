<template>
    <div id="boardObjectRootWrapper" class="container-fluid d-flex align-self-center align-items-center justify-content-center py-3 test-border border-radius-d fsps" >
        <div id="divUnderRoot" class="d-flex flex-column align-self-center justify-content-center py-4 border-radius-a">
            <div id="objectionIs" class="d-flex align-self-center justify-content-center text-center container-fluid fsplll font-bold">
                신고하기
            </div>

            <div class="container-fluid my-4">
                <div id="objectionRoot" class="d-flex flex-column align-self-center justify-content-center container-fluid">
                    신고사유
                    <select id="obejctionType" v-model="params.objectionType">
                        <option value="비방 및 욕설">비방 및 욕설</option>
                        <option value="음란물 또는 부적절한 홍보 게시물">음란물 또는 부적절한 홍보 게시물</option>
                        <option value="명예훼손/사생활 침해 및 저작권 침해등">명예훼손/사생활 침해 및 저작권 침해등</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                
                <div id="obejectionContentRoot" class="d-flex flex-column align-self-center justify-content-center container-fluid">
                    내용
                    <textarea style="min-height:100px;"
                    id="objectionContent" class="awesome-scroll" v-model="params.objectionContent">

                    </textarea>
                </div>
            </div>
            
            <div id="objectionIsBtn" class="d-flex align-self-center justify-content-center text-center container-fluid">
                <button @mousedown="methods.submit_objection"
                type="submit" class="btn btn-primary container-fluid p-0 m-0">
                    제출
                </button>
            </div>

        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'ObjectionFormVue',
    setup(props, context) {
        const store = Store;

        store.commit('LOGIN_CHECK');

        const params = ref({
            index: -1,
            isBoard: true,
            objectionType: '비방 및 욕설',
            objectionContent: '',

        });

        const methods = {
            submit_objection: ()=>{
                var sendJson = {
                    isupdate: params.value.isBoard? 'b': 'c',
                    index: params.value.index,
                    objectiontext: `${params.value.objectionType} ${params.value.objectionContent}`
                };

                console.log(sendJson);

                AXIOS.put('/community/objection', sendJson)
                .then((response)=>{
                    store.commit('CREATE_ALERT', {msg:response.data.result, time: 2, type:"success"});
                })
                .catch((error)=>{
                    store.commit('CREATE_ALERT', {msg:error.response.data.result, time: 2, type:"danger"});
                });
            },
        }; 

        params.value.index = store.state.objectionIndex;
        params.value.isBoard = store.state.isObjectionBoard;

        onMounted(()=>{
            console.log(params.value.index);

            if(!store.getters.GET_IS_LOGIN){
                store.commit('CREATE_ALERT', {msg:'로그인이 필요한 서비스 입니다.', time: 2, type:"danger"});
                
                store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'});
            }
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
#boardObjectRootWrapper{
    position: fixed;
    background-color: cornflowerblue;
    color: white;
    z-index: 1501;
    height: auto;
    width: 30vw;
    min-width: 300px;
}

#divUnderRoot{
    background-color:white;
    color: black;
    width: 100%;
    border: 1px black solid;
}
</style>
<template>
    <div id="root" class="container-fluid d-flex align-items-center justify-content-center py-3" 
    :style="`background: rgb(204, 235, 255); position:fixed; top:150px; z-index:1501; width:60%; 
    height: auto; min-width:250px;`">
        <div id="divUnderRoot" >
            <div class="container-fluid row d-flex align-items-center m-auto p-auto text-align-center" v-if="true">
                <div class="col-sm-12 my-1">
                    <label for="title">글번호</label>
                    <input type="text" class="form-control" id="title" placeholder="글번호를 입력해주세요." v-model="params.data.bindex">
                </div>

                
                <div class="col-sm-12 my-1">
                    <textarea class="form-control" id="content" placeholder="내용을 입력해주세요." style="height:10em; resize: none;" v-model="params.data.content">

                    </textarea>
                </div>

                
                <div class="form-floating col-sm-12 my-1">
                    <button type="submit" class="btn btn-primary" @click="methods.sendComment">댓글 쓰기</button>
                </div>
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
    name:'WriteFormVue',
    setup(props, context) {
        const store = Store;

        store.commit('LOGIN_CHECK');

        const params = ref({
            data: {
                bindex: '',
                content: ''
            }
        });

        const methods = {
            sendComment: ()=>{
                AXIOS.post('/community/comment', params.value.data)
                .then((response)=>{
                    store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});
                    store.commit('CLOSE_FOREGROUND');
                })
                .catch((error)=>{
                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                });
            },
        };

        onMounted(()=>{
            if(!store.getters.GET_IS_LOGIN){
                store.commit('CREATE_ALERT', {msg:'로그인이 필요한 서비스 입니다.', time: 2, type:"danger"});

                // store.commit('CLOSE_FOREGROUND');
                
                store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'});
            }
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

</style>
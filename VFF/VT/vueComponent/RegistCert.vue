<template>
    <div class="modal-dialog" style="position:fixed; z-index:1501; width:35%; height: auto; min-width:400px;">
        <div class="modal-content">
            <div class="modal-header d-flex justify-content-center">
                <h4 class="modal-title text-align-center">
                    <transition name="login-form-fade" mode="out-in">
                        <span>인증토큰 입력</span>
                    </transition>
                </h4>
            </div>
            <transition name="login-form-fade" mode="out-in">
                <form>
                    <div class="modal-body">
                            <div class="form-floating mb-3 mt-3">
                                <input id="certBox" type="text" :class="`form-control ${params.certValid?'is-valid':'is-invalid'}`" placeholder="Enter Token" v-model="params.certTkn"> 
                                <label for="certBox">{{`${params.certValid?'인증토큰':'인증토큰을 입력해주세요.'}`}}</label>
                            </div>
                    </div>

                    <div class="modal-footer">
                        <input type="submit" class="container-fluid btn btn-success" @click.prevent="methods.regist" value="인증하기">
                    </div>
                    <div class="container-fluid d-flex flex-column">
                        <a class="d-flex justify-content-center mb-2" @click.prevent="methods.changeRegistForm('RegistVue')">아이디가 없으신가요?</a>
                        <a class="d-flex justify-content-center" @click.prevent="methods.changeRegistForm('LoginNOutVue')">로그인 화면으로 돌아가기</a>
                    </div>
                </form>
            </transition>
        </div>
    </div>
</template>

<script>
import { ref, onBeforeMount, onBeforeUnmount, watch, Component, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name: 'RegistNFindVue',
    setup() {
        const store = Store;
        store.commit('LOGIN_CHECK');
        const router = useRouter();

        const params = ref({
            certTkn: null,
            certValid: false,
        });


        const methods = {
            regist: ()=>{
                store.commit('CREATE_LOADING');
                AXIOS.post('/regist/certkn', {'cert': params.value.certTkn})
                .then((response)=>{
                    console.log(response.data);
                    store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});
                    store.commit('CLOSE_FOREGROUND');
                })
                .catch((error)=>{
                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                    params.value.certValid = false;
                })
                .finally((data)=>{
                    store.commit('REMOVE_LOADING');
                });
            },
            registDebounced: null,
            changeRegistForm: (paramName)=>{
                store.commit('CHANGE_FOREGROUND_COMPONENT', {name: paramName});
            },
        };

        watchEffect(()=>{
            if(params.value.certTkn !== null && params.value.certTkn.length > 0){
                params.value.certValid = true;
            } else{
                params.value.certValid = false;
            }
        });

        onMounted(()=>{
            store.commit('LOGIN_CHECK');
            if(store.getters.GET_IS_LOGIN){
                store.commit('CREATE_ALERT', {msg:'로그아웃 후 이용해주시기 바랍니다.', time: 2, type:"danger"});
                store.commit('CLOSE_FOREGROUND');
            } else{
                methods.registDebounced = _.debounce(methods.regist, 500);
            }
        });

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>
a, a:hover{
    text-decoration: none;
    cursor:pointer;
}

</style>
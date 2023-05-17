<template>
    <div class="modal-dialog" style="position:fixed; z-index:1501; width:35%; height: auto; min-width:400px;">
        <div class="modal-content">
            <div class="modal-header d-flex justify-content-center">
                <h4 class="modal-title text-align-center">
                    <transition name="login-form-fade" mode="out-in">
                        <span>아이디 찾기</span>
                    </transition>
                </h4>
            </div>
            <transition name="login-form-fade" mode="out-in">
                <form>
                    <div class="modal-body">
                        <div class="form-floating mb-3 mt-3">
                            <input id="emailBox" type="text" :class="`form-control ${params.emailValid?'is-valid':'is-invalid'}`" placeholder="Enter Token" v-model="params.yourEmail"> 
                            <label for="emailBox">{{`${params.emailValid?'이메일':'이메일을 입력해주세요.'}`}}</label>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <input type="submit" class="container-fluid btn btn-success" @click.prevent="methods.findDebounced" value="찾기">
                    </div>
                    <div class="container-fluid d-flex flex-column">
                        <a class="d-flex justify-content-center mb-2" @click.prevent="methods.changeRegistForm('FindPwVue')">비밀번호 찾으러가기</a>
                        <a class="d-flex justify-content-center mb-2" @click.prevent="methods.changeRegistForm('RegistVue')">아이디가 없으신가요?</a>
                        <a class="d-flex justify-content-center" @click.prevent="methods.changeRegistForm('LoginNOutVue')">로그인 화면으로 돌아가기</a>
                    </div>
                </form>
            </transition>
        </div>
        <transition name="fast-fade" mode="out-in">
            <div id="loadingWrapper">

            </div>
        </transition>
    </div>
</template>

<script>
import { ref, onBeforeMount, onBeforeUnmount, watch, Component, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name: 'FindIdVue',
    setup() {
        const store = Store;
        store.commit('LOGIN_CHECK');
        const router = useRouter();

        const params = ref({
            yourEmail: null,
            emailValid: false,
            processDone: true,
        });

        const EmailRegExp = /^([^\W]{3,})@([^\W]{3,})(\.[a-zA-Z]{2,})+$/; // (3글자이상)

        const methods = {
            findClick: async ()=>{
                store.commit('CREATE_LOADING');

                params.value.processDone = false;
                AXIOS.post('/info/findid', {'email': params.value.yourEmail})
                .then((response)=>{
                    console.log(response.data);
                    store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});
                })
                .catch((error)=>{
                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                    params.value.yourEmail = '';
                    params.value.emailValid = false;

                })
                .finally((data)=>{
                    store.commit('REMOVE_LOADING');
                    params.value.yourEmail = '';
                    params.value.processDone = true;
                });
            },
            findDebounced: null,
            changeRegistForm: (paramName)=>{
                store.commit('CHANGE_FOREGROUND_COMPONENT', {name: paramName});
            },
        };

        watchEffect(()=>{
            if(EmailRegExp.test(params.value.yourEmail)){
                params.value.emailValid = true;
            } else{
                params.value.emailValid = false;
            }
        });

        onMounted(()=>{
            store.commit('LOGIN_CHECK');
            if(store.getters.GET_IS_LOGIN){
                store.commit('CREATE_ALERT', {msg:'로그아웃 후 이용해주시기 바랍니다.', time: 2, type:"danger"});
                store.commit('CLOSE_FOREGROUND');
            } else{
                methods.findDebounced = _.debounce(methods.findClick, 100);
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
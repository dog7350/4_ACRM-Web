<template>
    <div class="modal-dialog" style="position:fixed; z-index:1501; width:35%; height: auto; min-width:400px;">
        <div class="modal-content">
            <div class="modal-header d-flex justify-content-center">
                <h4 class="modal-title text-align-center">
                    <transition name="login-form-fade" mode="out-in">
                        <span>회원가입</span>
                    </transition>
                </h4>
            </div>
            <transition name="login-form-fade" mode="out-in">
                <form>
                    <div id="registDiv" class="modal-body awesome-scroll">
                            <div class="form-floating mb-3 mt-3">
                                <input id="idBox" type="text" :class="`form-control ${params.bodyInfoValider.id?'is-valid':'is-invalid'}`" placeholder="Enter ID"
                                v-model="params.bodyInfo.id"> 
                                <label for="idBox">{{`${params.bodyInfoValider.id?'아이디':'아이디는 3글자 이상이여야 합니다.'}`}}</label>
                            </div>

                            <div class="form-floating mb-3 mt-3">                           
                                <input id="pwBox" type="password" :class="`form-control ${params.bodyInfoValider.pw?'is-valid':'is-invalid'}`" placeholder="Enter password" v-model="params.bodyInfo.pw">
                                <label for="pwBox">{{`${params.bodyInfoValider.pw?'비밀번호':'비밀번호는 6글자 이상이여야 합니다.'}`}}</label>
                            </div>

                            <div class="form-floating mb-3 mt-3">                           
                                <input id="nameBox" type="text" :class="`form-control ${params.bodyInfoValider.name?'is-valid':'is-invalid'}`" placeholder="Enter Name" v-model="params.bodyInfo.name">
                                <label for="nameBox">{{`${params.bodyInfoValider.name?'이름':'이름은 3글자 이상이여야 합니다.'}`}}</label>
                            </div>

                            <div class="form-floating mb-3 mt-3">                           
                                <input id="emailBox" type="text" :class="`form-control ${params.bodyInfoValider.email?'is-valid':'is-invalid'}`" placeholder="Enter Email" v-model="params.bodyInfo.email">
                                <label for="emailBox">{{`${params.bodyInfoValider.email?'이메일':'이메일은 OOO@OOO.OO형식을 맞춰주세요.'}`}}</label>
                            </div>

                            <div class="form-floating mb-3 mt-3">                           
                                <input id="phoneBox" type="text" :class="`form-control ${params.bodyInfoValider.phone?'is-valid':'is-invalid'}`" placeholder="Enter PhoneNumber" v-model="params.bodyInfo.phone">
                                <label for="phoneBox">{{`${params.bodyInfoValider.phone?'휴대폰 번호':'\'-\'을 제외한 휴대폰 번호를 써주세요.'}`}}</label>
                            </div>

                            <input type="submit" class="container-fluid btn btn-primary" @click.prevent="methods.checkAddress" value="주소찾기">

                            <div class="form-floating mb-3 mt-1">                           
                                <input id="postBox" type="text" class="form-control" placeholder="우편번호"
                                v-model="params.bodyInfo.postNumber" disabled>
                                <label for="postBox">우편번호</label>
                            </div>

                            <div class="form-floating mb-3 mt-3">                           
                                <input id="addressBox" type="text" class="form-control" placeholder="주소" 
                                v-model="params.bodyInfo.baseAddr" disabled>
                                <label for="addressBox">주소</label>
                            </div>

                            <div class="form-floating mb-3 mt-3">                           
                                <input id="detailAddressBox" type="text" class="form-control" placeholder="상세주소를 입력해주세요." v-model="params.bodyInfo.address">
                                <label for="detailAddressBox">상세주소</label>
                            </div>
                    </div>

                    <div class="modal-footer">
                        <input type="submit" class="container-fluid btn btn-success" @click.prevent="methods.regist" value="회원가입">
                    </div>
                    <div class="container-fluid d-flex flex-column">
                        <a class="d-flex justify-content-center mb-2" @click.prevent="methods.changeRegistForm('RegistCertVue')">인증토큰 입력하러가기</a>
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

export default {
    name: 'RegistNFindVue',
    setup() {
        const store = Store;
        store.commit('LOGIN_CHECK');
        const router = useRouter();

        const params = ref({
            bodyInfo: {
                id: null,
                pw: null,
                email: null,
                name: null,
                phone: null,
                address: null,
                postNumber: null,
                baseAddr: null,
            },
            bodyInfoValider: {
                id: false,
                pw: false,
                email: false,
                name: false,
                phone: false,
            },
            virtualBodyInfo: {
                id: null, pw: null, email: null, name: null, phone: null, address: null
            },
        });

        const IDRegExp = /^[0-9A-Za-z]{3,}$/; // 특수문자를 금지한 문자 3개이상
        const PWRegExp = /^.{6,}$/; // 아무런 문자 6개 이상
        const EmailRegExp = /^([^\W]{3,})@([^\W]{3,})(\.[a-zA-Z]{2,})+$/; // (3글자이상)
        const NameRegExp = /^[0-9a-zA-Z가-힣_]{3,12}$/; // (_를 포함한 3글자이상 12글자 이하)
        const PhoneRegExp = /^(010){1}[0-9]{8}$/; // 휴대폰번호 12자

        const methods = {
            regist: ()=>{
                params.value.virtualBodyInfo.id = params.value.bodyInfo.id;
                params.value.virtualBodyInfo.pw = params.value.bodyInfo.pw;
                params.value.virtualBodyInfo.email = params.value.bodyInfo.email;
                params.value.virtualBodyInfo.name = params.value.bodyInfo.name;
                params.value.virtualBodyInfo.phone = params.value.bodyInfo.phone;
                params.value.virtualBodyInfo.address = params.value.bodyInfo.postNumber + ", " + params.value.bodyInfo.baseAddr + ", " + params.value.bodyInfo.address;

                console.log(params.value.virtualBodyInfo);

                params.value.bodyInfo = {
                    id: null,
                    pw: null,
                    email: null,
                    name: null,
                    phone: null,
                    address: null,
                    postNumber: null,
                    baseAddr: null,
                };

                let valid = params.value.bodyInfoValider.id 
                && params.value.bodyInfoValider.pw 
                && params.value.bodyInfoValider.name 
                && params.value.bodyInfoValider.email
                && params.value.bodyInfoValider.phone;

                if(valid){
                    store.commit('CREATE_LOADING');
                    AXIOS.post('/regist/reqtkn', params.value.virtualBodyInfo)
                    .then((response)=>{
                        console.log(response.data);
                        store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});
                        store.commit('CHANGE_FOREGROUND_COMPONENT', {name: 'RegistCertVue'});
                        // store.commit('CLOSE_FOREGROUND');
                    })
                    .catch((error)=>{
                        store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                    })
                    .finally((data)=>{
                        store.commit('REMOVE_LOADING');
                        store.commit('LOGIN_CHECK');
                    });
                } else{
                    store.commit('CREATE_ALERT', {msg:"회원가입 폼을 다시 확인해주세요!", time: 2, type:"danger"});
                }
            },
            checkAddress: ()=>{
                new daum.Postcode({
                    oncomplete: function(data) {
                        console.log(data);
                        params.value.bodyInfo.postNumber = data.zonecode;

                        var addr = ''; // 주소 변수
                        var extraAddr = ''; // 참고항목 변수

                        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                            addr = data.roadAddress;
                        } else { // 사용자가 지번 주소를 선택했을 경우(J)
                            addr = data.jibunAddress;
                        }

                        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                        if(data.userSelectedType === 'R'){
                            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                                extraAddr += data.bname;
                            }
                            // 건물명이 있고, 공동주택일 경우 추가한다.
                            if(data.buildingName !== '' && data.apartment === 'Y'){
                                extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                            }
                            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                            if(extraAddr !== ''){
                                extraAddr = ' (' + extraAddr + ')';
                            }
                        }

                        params.value.bodyInfo.baseAddr = addr + " " + extraAddr;
                    }
                }).open();
            },
            changeRegistForm: (paramName)=>{
                store.commit('CHANGE_FOREGROUND_COMPONENT', {name: paramName});
            },
        };

        watchEffect(()=>{
            try { // id 체크
                if(params.value.bodyInfo.id !== null && IDRegExp.test(params.value.bodyInfo.id)) params.value.bodyInfoValider.id = true;
                else params.value.bodyInfoValider.id = false;

                // console.log(IDRegExp.test(params.value.bodyInfo.id), params.value.bodyInfo.id);
            } catch (error) {
                
            }
            
            try { // pw 체크
                if(params.value.bodyInfo.pw !== null && PWRegExp.test(params.value.bodyInfo.pw)) params.value.bodyInfoValider.pw = true;
                else params.value.bodyInfoValider.pw = false;
            } catch (error) {
                
            }

            try { // email 체크
                if(params.value.bodyInfo.email !== null && EmailRegExp.test(params.value.bodyInfo.email)) params.value.bodyInfoValider.email = true;
                else params.value.bodyInfoValider.email = false;
            } catch (error) {
                
            }

            try { // 이름 체크
                if(params.value.bodyInfo.name !== null && NameRegExp.test(params.value.bodyInfo.name)) params.value.bodyInfoValider.name = true;
                else params.value.bodyInfoValider.name = false;
            } catch (error) {
                
            }

            try { // 번호 체크
                if(params.value.bodyInfo.phone !== null && PhoneRegExp.test(params.value.bodyInfo.phone)) params.value.bodyInfoValider.phone = true;
                else params.value.bodyInfoValider.phone = false;
            } catch (error) {
                
            }
            
        });

        onMounted(()=>{
            store.commit('LOGIN_CHECK');
            if(store.getters.GET_IS_LOGIN){
                store.commit('CREATE_ALERT', {msg:'로그아웃 후 이용해주시기 바랍니다.', time: 2, type:"danger"});
                store.commit('CLOSE_FOREGROUND');
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

#registDiv{
    height: 40vh;
    overflow-y: auto;
}

</style>
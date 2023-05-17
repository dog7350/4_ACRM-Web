<template>
    <div class="modal-dialog" style="position:fixed; z-index:1501; width:35vw; height: auto; min-width:300px; max-width:600px;">
        <div class="modal-content awesome-scroll" style="max-height: 500px; overflow-y: scroll; overflow-x: hidden;">
            <div class="modal-header d-flex justify-content-center" style="position: sticky; z-index: 30; top: 0; background-color: white;">
                <div class="fsplll modal-title text-align-center">
                    <transition name="login-form-fade" mode="out-in">
                        <span v-if="!store.getters.GET_IS_LOGIN">로그인</span>
                        <span v-else>내 정보</span>
                    </transition>
                </div>
            </div>
            <transition name="login-form-fade" mode="out-in">
                <form class="fspms" v-if="!store.getters.GET_IS_LOGIN">
                    <div class="modal-body">
                        <div class="form-floating mb-3 mt-3">
                            <input id="idBox" type="text" class="form-control" placeholder="Enter ID" v-model="params.inputId"> 
                            <label for="idBox">ID</label>
                        </div>

                        <div class="form-floating mb-3 mt-3">                           
                            <input id="pwBox" type="password" class="form-control" placeholder="Enter password" v-model="params.inputPw">
                            <label for="pwBox">Password</label>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <input type="submit" :class="`container-fluid mb-1 btn btn-success`"
                        @click.prevent="methods.loginNout" value="로그인">
                    </div>
                    <div class="container-fluid d-flex flex-column fsps" v-if="!store.getters.GET_IS_LOGIN">
                        <a class="d-flex justify-content-center mb-2" @click.prevent="methods.changeRegistForm('FindIdVue')">아이디 찾으러가기</a>
                        <a class="d-flex justify-content-center mb-2" @click.prevent="methods.changeRegistForm('FindPwVue')">비밀번호 찾으러가기</a>
                        <a class="d-flex justify-content-center mb-2" @click.prevent="methods.changeRegistForm('RegistVue')">아이디가 없으신가요?</a>
                        <a class="d-flex justify-content-center" @click.prevent="methods.changeRegistForm('RegistCertVue')">인증토큰 입력하러가기</a>
                    </div>
                </form>
                <div v-else>
                    <div class="modal-body d-flex flex-column" :style="`background-color: #e7e7e7; ${params.step === 2? 'overflow:scroll;': ''}`">
                        <transition name="fast-fade" mode="out-in">
                            <div v-if="params.step === 100 || params.step === -1" class="container-fluid d-flex flex-wrap justify-content-center text-center">
                                <div id="loadingding" class="d-flex justify-content-center">
                                    <i class="bi bi-hourglass align-self-center icon-size-standard"></i>
                                </div>
                                <div class="container-fluid ">{{params.waittingString}}</div>                
                            </div>
                            <div v-else-if="params.step === 0" class="container-fluid d-flex flex-wrap justify-content-center text-center p-0">
                                <div class="w-100 d-flex row justify-content-center border-radius-c" style="border: 3px #767676 solid;background-color: white; padding: 0 0 1rem 0;">
                                    <div class="p-0 m-3" style="width:70px;align-self:center;height:70px;border-radius: 50%;box-shadow: 0 0 1px 1px black;overflow: hidden;">
                                        <img :src="params.myInfo.logoPath? params.myInfo.logoPath: '/images/board/logos/none.png'" @error="(e)=>{e.target.src='/images/board/logos/none.png'}" alt="" srcset="" class="w-100 h-100" >
                                    </div>
                                    <div class="d-flex flex-wrap py-0 px-4" style="text-align: center;">
                                        <div class="fspll w-100" style="align-self:end;">{{params.myInfo.name}}</div>
                                        <div class="fspm w-100"><i class="bi bi-envelope"></i>&nbsp;{{params.myInfo.email}}</div>
                                    </div>
                                </div>

                                <div class="w-100 d-flex row justify-content-center border-radius-c px-3 py-2 mt-2" style="border: 3px #767676 solid;background-color: white;">
                                    <div class="d-flex flex-wrap m-0 p-0" style="width: 100%;text-align: start;">
                                        <div class="fspm w-100 mt-2 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-cash-coin"></i>
                                            </div>
                                            <div class="">
                                                {{params.myInfo.cash}}
                                            </div>
                                            
                                            <div class="container-fluid d-flex justify-content-end p-0" v-if="store.getters.GET_BROWSER_SIZE >= 910">
                                                <div class="btn btn-success btn-sm mx-2" @click="methods.openLo3">
                                                    캐쉬내역
                                                </div>

                                                <div class="btn btn-primary btn-sm" @click="methods.changeCashChargeForm">
                                                    지갑충전
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fspm w-100 mt-2 d-flex" v-if="store.getters.GET_BROWSER_SIZE < 910">                                          
                                            <div class="container-fluid d-flex justify-content-around p-0">
                                                <div class="btn btn-success btn-sm me-1 container-fluid" @click="methods.openLo3">
                                                    캐쉬내역
                                                </div>

                                                <div class="btn btn-primary btn-sm ms-1 container-fluid" @click="methods.changeCashChargeForm">
                                                    지갑충전
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fspm w-100 mt-3 mb-2 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-cash"></i>
                                            </div>
                                            <div class="">
                                                {{params.myInfo.money}}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="w-100 d-flex row justify-content-center border-radius-c px-3 py-2 mt-2" style="border: 3px #767676 solid;background-color: white;">
                                    <div class="d-flex flex-wrap m-0 p-0" style="width: 100%;text-align: start;">
                                        <div class="fspm w-100 mt-2 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-phone"></i>
                                            </div>
                                            <div class="">
                                                {{methods.printPhoneNum(false)}}
                                            </div>
                                        </div>
                                        
                                        <!-- <div class="w-100" style="border-top: 0.5px black solid; height:1px;"></div> -->

                                        <div class="fspm w-100 mt-3 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-house"></i>
                                            </div>
                                            <div class="">
                                                {{params.myInfo.address}}
                                            </div>
                                        </div>

                                        <div class="fspm w-100 mt-3 mb-2 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-award"></i>
                                            </div>
                                            <div class="">
                                                {{params.myInfo.admin==='o'? '관리자': params.myInfo.admin==='m'? '매니저': '유저'}}
                                            </div>
                                        </div>

                                        <!-- <div class="w-100" style="border-top: 0.5px black solid; height:1px;"></div> -->
                                        <div class="container-fluid is-have-plain-transition mt-5 d-flex flex-wrap justify-content-center px-0">
                                            <transition name="fast-fade">
                                                <div v-if="params.deleteCounter === 1" class="w-100 p-2 mb-2" style="border: 1px solid black; color:red;">
                                                    회원탈퇴 시 개인정보 및 AccroMemories에서 만들어진 모든 데이터는 삭제됩니다. 
                                                </div>
                                            </transition>
                                            <transition name="fast-fade">
                                                <input 
                                                v-if="params.deleteCounter === 1" 
                                                class="w-100 none-outline input-transparent" id="outAuth" type="text" placeholder="비밀번호를 입력해주세요.">
                                            </transition>
                                        </div>

                                        <input
                                        type="submit" id="outAuthButton"
                                        :class="`container-fluid is-have-plain-transition btn btn-${params.deleteTest[params.deleteCounter].btnClass} mt-2 mb-1`"
                                        @click.prevent="methods.deleteId"
                                        :value="params.deleteTest[params.deleteCounter].value">
                                    </div>
                                </div>

                                <div class="w-100 d-flex row justify-content-center border-radius-c px-3 py-2 mt-2" style="border: 3px #767676 solid;background-color: white;">
                                    <div class="d-flex flex-wrap m-0 p-0" style="width: 100%;text-align: start;">
                                        <input
                                        type="submit" id="feedbackOn"
                                        :class="`container-fluid is-have-plain-transition btn btn-success mt-2 mb-1`"
                                        @click.prevent="methods.openLo7"
                                        :value="'전체 피드백 보기'">
                                    </div>
                                    <div class="d-flex flex-wrap m-0 p-0" style="width: 100%;text-align: start;">
                                        <input
                                        type="submit" id="feedbackOn"
                                        :class="`container-fluid is-have-plain-transition btn btn-primary mt-2 mb-1`"
                                        @click.prevent="methods.openLo5"
                                        :value="'피드백 작성'">
                                    </div>
                                </div>
                                <!-- <input type="file" @change.capture="methods.valuedChange" id="imageFiles" accept="image/gif, image/jpeg, image/png">
                                <input type="submit" placeholder="변경" @click.prevent="methods.changeLogo"> -->
                            </div>
                            <div v-else-if="params.step === 1" class="container-fluid d-flex flex-wrap justify-content-center text-center p-0">
                                <div class="w-100 d-flex row justify-content-center border-radius-c" style="border: 3px #767676 solid;background-color: white; padding: 0 0 0 0;">
                                    <div class="p-0 mt-3" style="width:70px;align-self:center;height:70px;border-radius: 50%;box-shadow: 0 0 1px 1px black;overflow: hidden;">
                                        <img @click="methods.logoImageChange" @error="(e)=>{e.target.src='/images/board/logos/none.png'}"
                                        id="previewLogo" :src="params.myInfo.logoPath? params.myInfo.logoPath: '/images/board/logos/none.png'" alt="" srcset="" class="w-100 h-100 over-cursor" >
                                    </div>
                                    <div class="d-flex container-fluid justify-content-center mb-3">
                                        <input
                                        type="file" @change.capture="methods.valuedChange" id="imageFiles" accept="image/gif, image/jpeg, image/png">
                                    </div>
                                </div>

                                <div class="w-100 d-flex row justify-content-center border-radius-c px-3 py-2 mt-2" style="border: 3px #767676 solid;background-color: white;">
                                    <div class="d-flex flex-wrap m-0 p-0" style="width: 100%;text-align: start;">
                                        <div class="fspm w-100 mt-2 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-tag"></i>
                                            </div>
                                            <div class="d-flex">
                                                <input id="changeName" type="text" v-model="params.updateInfo.name.after"
                                                @change="methods.change(1)">
                                                <div id="nameSide" class="jjollu is-have-plain-transition"></div>
                                            </div>
                                        </div>

                                        <div class="fspm w-100 mt-3 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-envelope"></i>
                                            </div>
                                            <div class="d-flex">
                                                <input id="changeEmail" type="text" v-model="params.updateInfo.email.after"
                                                @change="methods.change(2)">
                                                <div id="emailSide" class="jjollu is-have-plain-transition"></div>
                                            </div>
                                        </div>

                                        <div class="fspm w-100 mt-3 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-phone"></i>
                                            </div>
                                            <div class="d-flex">
                                                <input id="changePhone" type="text" v-model="params.updateInfo.phone.after"
                                                 @change="methods.change(3)">
                                                <div id="phoneSide" class="jjollu is-have-plain-transition"></div>
                                                <!-- {{methods.printPhoneNum()}} -->
                                            </div>
                                        </div>
                                        
                                        <!-- <div class="w-100" style="border-top: 0.5px black solid; height:1px;"></div> -->

                                        <div class="fspm w-100 mt-3 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-house"></i>
                                            </div>
                                            <div class="d-flex flex-wrap">
                                                <div class="w-100 btn btn-success btn-sm" @click="methods.changeAddress">
                                                    주소찾기
                                                </div>
                                                <input class="w-100 mt-1" id="changePostNumber" type="text" v-model="params.virtualAddr.postNumber" disabled>
                                                <input class="w-100 mt-1" id="changeAddr" type="text" v-model="params.virtualAddr.baseAddr" disabled>
                                                <input class="w-100 mt-1" id="changeDetailAddr" type="text" v-model="params.virtualAddr.detailAddr">
                                            </div>
                                        </div>

                                        <!-- <div class="fspm w-100 mt-3 mb-2 d-flex">
                                            <div class="align-self-center fspl" style="margin-right:15px;">
                                                <i class="bi bi-award"></i>
                                            </div>
                                            <div class="">
                                                {{params.myInfo.admin==='o'? '관리자': params.myInfo.admin==='m'? '매니저': '유저'}}
                                            </div>
                                        </div> -->

                                        <!-- <div class="w-100" style="border-top: 0.5px black solid; height:1px;"></div> -->
                                    </div>
                                </div>

                                <!-- <input type="submit" placeholder="변경" @click.prevent="methods.changeLogo"> -->
                            </div>
                            <div v-else-if="params.step === 2" class="container-fluid d-flex flex-wrap justify-content-center text-center p-0"
                            :style="'min-width: 426px;'">
                                <div class="w-100 d-flex row justify-content-center border-radius-c" style="border: 3px #767676 solid;background-color: white; padding: 0 0 0 0;">
                                    <table class="table w-100 m-0 p-0">
                                        <thead class="fspm w-100">
                                            <tr>
                                                <th>날짜</th>
                                                <!-- <th>IP</th> -->
                                                <th>기록</th>
                                                <th>금액</th>
                                            </tr>
                                        </thead>
                                        <transition-group tag="tbody" mode="out-in" name="fast-fade">
                                            <tr class="fspm w-100 mt-3" v-for="item, index in params.cashLog" :key="index">
                                                <td>{{methods.changeDate(item.timeStamp).split(' ')[0]}}</td>
                                                <!-- <td>{{item.ip}}</td> -->
                                                <td>{{item.type}}</td>
                                                <td>{{item.price}}</td>
                                            </tr>
                                        </transition-group>
                                    </table>
                                </div>
                                <div class="w-100 d-flex justify-content-center border-radius-c mt-3" style="border: 3px #767676 solid;background-color: white; padding: 0 0 0 0;">
                                    <div class="d-flex justify-content-center">
                                        <div v-for="index in params.cashPage" :key="index"
                                        :class="`fspl ${(params.currentPage === index)? 'font-blue': 'over-cursor over-blue'} mx-2`"
                                        @click="(params.currentPage !== index)? methods.getCashPage(index): ''">
                                            {{index}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="params.step === 3" class="container-fluid d-flex flex-wrap justify-content-center text-center p-0">
                                <FeedBackParts @OKBACK="methods.openLo6" />
                            </div>
                            <div v-else-if="params.step === 4" class="container-fluid d-flex flex-wrap justify-content-center text-center mt-2 p-0">
                                <FeedBackList @OKBACK="methods.openLo8" />
                            </div>
                        </transition>
                        
                    </div>

                    <div class="modal-footer fspm">
                        <transition name="fast-fade" mode="out-in">
                            <input v-if="params.step === 0" type="submit" class="container-fluid btn btn-success mb-1" 
                            @click="methods.openLo1" :value="'정보수정'">

                            <input v-else-if="params.step === 1" type="submit" class="container-fluid btn btn-success mb-1" 
                            @click="methods.openLo2" :value="'변경'">

                            <input v-else-if="params.step === 2 || params.step === 3 || params.step === 4" type="submit" class="container-fluid btn btn-success mb-1" 
                            @click="methods.openLo4" :value="'돌아가기'">
                        </transition>

                        <input type="submit" :class="`container-fluid mb-1 btn btn-danger`" :disabled="params.step === -1 || params.step === 100"
                        @click.prevent="methods.loginNout" value="로그아웃">
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { ref, onBeforeMount, onBeforeUnmount, watch, Component, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

import FeedBackParts from './feedbackParts/FeedBackParts.vue';
import FeedBackList from './feedbackParts/FeedBackList.vue';

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
    name: 'LoginNOutVue',
    components: {
        FeedBackParts, FeedBackList
    },
    setup() {
        const store = Store;
        store.commit('LOGIN_CHECK');
        const router = useRouter();

        const fileReader = new FileReader();

        const IDRegExp = /^[0-9A-Za-z]{3,}$/; // 특수문자를 금지한 문자 3개이상
        const PWRegExp = /^.{6,}$/; // 아무런 문자 6개 이상
        const EmailRegExp = /^([^\W]{3,})@([^\W]{3,})(\.[a-zA-Z]{2,})+$/; // (3글자이상)
        const NameRegExp = /^[0-9a-zA-Z가-힣_]{3,12}$/; // (_를 포함한 3글자이상 12글자 이하)
        const PhoneRegExp = /^(010){1}[0-9]{8}$/; // 휴대폰번호 12자
        
        const { IMP } = window;
        
        IMP.init('imp84365986');


        const params = ref({
            inputId: '',
            inputPw: '',
            myInfo: null,
            updateInfo: {
                logo: {after: null, isChanged: false},
                name: {after: null, isChanged: false},
                pw: {after: null, isChanged: false},
                phone: {after: null, isChanged: false},
                email: {after: null, isChanged: false},
                address: {after: null, isChanged: false},
            },
            deleteTest: [
                { btnClass: 'outline-dark', value: "회원탈퇴" },
                { btnClass: 'dark', value: "탈퇴하기" },
            ], deleteCounter: 0, 
            virtualAddr: {
                postNumber: '', baseAddr: '', detailAddr: ''
            },
            cashLog: [], cashPage: 1, currentPage: 1,
            resultKey: [],
            step: 100, waittingString: '불러오는 중',
        });
        const methods = {
            login: ()=>{
                // store.commit('CREATE_LOADING');
                AXIOS.post(
                    '/login', 
                    {
                        'id': params.value.inputId, 
                        'pw': params.value.inputPw, 
                        // 'oneTimeCookie': params.value.params
                        }, 
                    { withCredentials: true,})
                .then((response)=>{
                    console.log(response.data);
                    store.commit('CREATE_ALERT', {msg:'성공적으로 로그인 됐습니다.', time: 2, type:"success"});
                    //store.commit('CLOSE_FOREGROUND', {});
                    methods.myInfo();
                })
                .catch((error)=>{
                    store.commit('CREATE_ALERT', {msg:error.response.data.result, time: 2, type:"danger"});
                })
                .finally((data)=>{
                    params.value.inputId = '';
                    params.value.inputPw = '';
                    // store.commit('REMOVE_LOADING');
                    store.commit('LOGIN_CHECK');
                });
            },
            logout: ()=>{
                // store.commit('CREATE_LOADING');
                AXIOS.post(
                    '/logout', 
                    { withCredentials: true,})
                .then((response)=>{
                    console.log(response.data);
                    store.commit('CREATE_ALERT', {msg:'성공적으로 로그아웃 됐습니다.', time: 2, type:"success"});
                    params.value.myInfo = null;
                    // store.commit('CLOSE_FOREGROUND', {});
                })
                .catch((error)=>{
                    console.log(error);
                })
                .finally((data)=>{
                    // store.commit('REMOVE_LOADING');
                    store.commit('LOGIN_CHECK');
                });
            },
            loginNout: ()=>{
                if(store.getters.GET_IS_LOGIN) { // 로그인 된 상태
                    methods.logout();
                } else{ // 로그아웃 된 상태
                    methods.login();
                }
            },
            routeURL: (url)=>{
                store.commit('CLOSE_FOREGROUND', {});
                router.push(url);
            }, 
            changeRegistForm: (paramName)=>{
                store.commit('CHANGE_FOREGROUND_COMPONENT', {name: paramName});
            },
            changeCashChargeForm: ()=>{ 
                store.commit('CHANGE_FOREGROUND_COMPONENT', {name: 'CashChargeVue'});
            },
            myInfo: async ()=>{
                try{
                    methods.openLo0();
                    // store.commit('UPDATE_INFO');

                    // params.value.myInfo = null;

                    // setTimeout(()=>{
                    //     params.value.myInfo = store.getters.GET_MY_INFO;
                    //     console.log(params.value.myInfo);
                    // }, 1500);
                }
                catch(error){
                    console.log(error);
                }
            },
            deleteId: ()=>{
                // store.commit('CREATE_LOADING');

                if(!params.value.deleteCounter){
                    params.value.deleteCounter++;
                    document.getElementById('outAuthButton').blur();
                }
                else{
                    let inputPw = document.getElementById('outAuth');


                    // if(PWRegExp.test(inputPw.value)){
                        AXIOS.delete('/info/out', {headers:{}, data:{pw: inputPw.value}})
                        .then((res)=>{
                            // console.log(res.data);
                            store.commit('CREATE_ALERT', {msg:res.data.result, time: 2, type:"success"});
                        })
                        .catch((err)=>{
                            // console.log(err);
                            inputPw.classList.remove('input-transparent');
                            inputPw.classList.add('input-alert');
                            store.commit('CREATE_ALERT', {msg:err.response.data.result, time: 2, type:"danger"});
                        })
                        .finally(()=>{
                            // store.commit('REMOVE_LOADING');
                            store.commit('LOGIN_CHECK');
                        });
                    // } else{
                    //     inputPw.classList.remove('input-transparent');
                    //     inputPw.classList.add('input-alert');
                    // }
                }
            },
            change: (i)=>{
                switch(i){
                    case 0:
                        params.value.updateInfo.logo.isChanged = true;
                    break;

                    case 1:
                        if(NameRegExp.test(document.getElementById("changeName").value)
                            || document.getElementById("changeName").value == params.value.myInfo.name){
                            document.getElementById("nameSide").style.background = "green";

                            if(document.getElementById("changeName").value == params.value.myInfo.name){
                                params.value.updateInfo.name.isChanged = false;
                            } else{
                                params.value.updateInfo.name.isChanged = true;
                            }
                        } else{
                            document.getElementById("nameSide").style.background = "red";
                            params.value.updateInfo.name.isChanged = false;
                        }
                        
                    break;

                    case 2:
                        if(EmailRegExp.test(document.getElementById("changeEmail").value)
                            || document.getElementById("changeEmail").value == params.value.myInfo.email){
                            document.getElementById("emailSide").style.background = "green";

                            if(document.getElementById("changeEmail").value == params.value.myInfo.email){
                                params.value.updateInfo.email.isChanged = false;
                            } else{
                                params.value.updateInfo.email.isChanged = true;
                            }
                        } else{
                            document.getElementById("emailSide").style.background = "red";
                            params.value.updateInfo.email.isChanged = false;
                        }
                        // params.value.updateInfo.email.isChanged = true;
                    break;

                    case 3:
                        if(PhoneRegExp.test(document.getElementById("changePhone").value)
                            || document.getElementById("changePhone").value == params.value.myInfo.phone){
                            document.getElementById("phoneSide").style.background = "green";

                            if(document.getElementById("changePhone").value == params.value.myInfo.phone){
                                params.value.updateInfo.phone.isChanged = false;
                            } else{
                                params.value.updateInfo.phone.isChanged = true;
                            }
                        } else{
                            document.getElementById("phoneSide").style.background = "red";
                            params.value.updateInfo.phone.isChanged = false;
                        }
                        
                        // params.value.updateInfo.phone.isChanged = true;
                    break;

                    case 4:
                        params.value.updateInfo.address.isChanged = true;
                    break;
                }
            },
            changeLogo: ()=>{
                var tempFormData = new FormData();

                var imgFiles = document.getElementById('imageFiles');

                for(var i = 0; i < imgFiles.files.length; i++){
                    tempFormData.append('imageFiles', imgFiles.files[i]);
                }

                

                if(imgFiles.files.length > 0){
                    AXIOS.put(`/community/logo`, tempFormData, {headers:{"Content-Type": "multipart/form-data"}})
                    .then((response)=>{
                        store.commit('CREATE_ALERT', {msg:response.data.result, time: 2, type:"success"});
                        methods.myInfo();
                    })
                    .catch((error)=>{
                        if(error.response.data.result === null ||
                            error.response.data.result === undefined &&
                            error.response.data.indexOf('dGhpc2lzbm90anBlZ3BuZ2pwZ2ltYWdlISE') !== -1){
                            store.commit('CREATE_ALERT', {msg:'이미지 파일을 다시 확인해주세요.', time: 2, type:"danger"});
                        } else{
                            store.commit('CREATE_ALERT', {msg:error.response.data.result, time: 2, type:"danger"});
                        }
                    })
                    .finally((data)=>{
                        store.commit('LOGIN_CHECK');
                    });
                }
                else{
                    store.commit('CREATE_ALERT', {msg:'로고로 사용할 파일을 넣어주세요.', time: 2, type:"danger"});
                }
            },
            valuedChange: (e)=>{
                // console.log(e.target);
                if($(e.target).prop('files').length > 0){
                    // console.log($(e.target).prop('files')[0]);
                    methods.change(0);
                    fileReader.readAsDataURL($(e.target).prop('files')[0]);
                } else{
                    let previewElement = document.getElementById('previewLogo');

                    if(previewElement){
                        previewElement.src = '/images/board/logos/none.png';
                        previewElement.height = previewElement.width;
                    }
                }
            },
            printPhoneNum: (bool)=>{
                if(bool)
                    return `${params.value.myInfo.phone.slice(0,3)}-${params.value.myInfo.phone.slice(3,7)}-${params.value.myInfo.phone.slice(7)}`;
                else 
                    return params.value.myInfo.phone;
            },
            logoImageChange: ()=>{
                methods.change(0);
                document.getElementById('imageFiles').click();
            },
            getLogoHeight: ()=>{
                return document.getElementById('realLogo').width;
            },
            changeAddress: ()=>{
                params.value.updateInfo.address.isChanged = true;
                new daum.Postcode({
                    oncomplete: function(data) {
                        params.value.virtualAddr.postNumber = data.zonecode;

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

                        // document.getElementById('changePostNumber').value = data.zonecode;
                        // document.getElementById('changeAddr').value = addr + " " + extraAddr;
                        // document.getElementById('changeDetailAddr').value = data.zonecode;

                        params.value.virtualAddr.baseAddr = addr + " " + extraAddr;
                        params.value.virtualAddr.detailAddr = '';
                    }
                }).open();
            },
            printQuestion: ()=>{
                // const modifyInfo = (boolstat)=>{
                //     if(boolstat){
                //         console.log("정보 변경 수락", params.value.myInfo);
                //     } else{
                //         console.log("정보 변경 취소");
                //     }

                //     methods.openLo0();
                // };

                // store.commit('CREATE_QUESTION', {questionText: '정보를 변경하시겠습니까?', yesText: '변경하기', noText:'취소', method: modifyInfo});

                console.log();

                methods.openLo0();
            },
            openLo: async (nextStep, waittingString, consoleString, progressCallBack)=>{
                try{
                    params.value.waittingString = waittingString;
                    params.value.deleteCounter = 0;

                    if(params.value.step !== -1){
                        params.value.step = -1;

                        for(var cbFunc in progressCallBack){
                            try{
                                await progressCallBack[cbFunc]();
                            }
                            catch(error){
                                console.log(error);
                            }
                        }

                        setTimeout(()=>{
                            params.value.myInfo = store.getters.GET_MY_INFO;
                            params.value.step = nextStep;  
                            console.log(consoleString);
                        }, 1500);
                    }
                    
                }
                catch(error){
                    console.log(error);
                }
            },
            openLo0:()=>{
                const funcList = [];

                store.commit('UPDATE_INFO');
                methods.openLo(0, "불러오는 중", "내 정보 창 오픈", funcList);
            },
            openLo1:()=>{
                // params.value.updateInfo = {
                //     logo: {after: null, isChanged: false},
                //     name: {after: params.value.myInfo.name, isChanged: false},
                //     pw: {after: null, isChanged: false},
                //     phone: {after: params.value.myInfo.phone, isChanged: false},
                //     email: {after: params.value.myInfo.email, isChanged: false},
                //     address: {after: null, isChanged: false},
                // };

                params.value.updateInfo.name.after = params.value.myInfo.name; params.value.updateInfo.name.isChanged = false;
                params.value.updateInfo.phone.after = params.value.myInfo.phone; params.value.updateInfo.phone.isChanged = false;
                params.value.updateInfo.email.after = params.value.myInfo.email; params.value.updateInfo.email.isChanged = false;

                let splitArr = params.value.myInfo.address.split(', ');

                params.value.virtualAddr.postNumber = '';
                params.value.virtualAddr.baseAddr = '';
                params.value.virtualAddr.detailAddr = '';

                for(var i in splitArr){
                    if(i == 0) {
                        params.value.virtualAddr.postNumber = splitArr[0];
                    } else if(i == 1) {
                        params.value.virtualAddr.baseAddr = splitArr[1];
                    } else if(i == 2) {
                        params.value.virtualAddr.detailAddr = splitArr[2];
                    }
                }

                methods.openLo(1, "변경 창 여는 중", "변경 창 오픈");
            },
            openLo2: ()=>{
                const funcList = [
                    async ()=>{ // logo change request
                        if(params.value.updateInfo.logo.isChanged){
                            try {
                                let tempFormData = new FormData();
                                let imgFiles = document.getElementById('imageFiles');

                                for(var i = 0; i < imgFiles.files.length; i++){
                                    tempFormData.append('imageFiles', imgFiles.files[i]);
                                }

                                let result = await AXIOS.put(`/community/logo`, tempFormData, {headers:{"Content-Type": "multipart/form-data"}});
                                
                                if(result.status === 200){
                                    // params.value.waittingString = result.data.result;
                                } else{
                                    params.value.waittingString = "로고 변경에 실패했습니다.";
                                }
                            }
                            catch (error) {
                                console.log(error);
                                // throw error;
                            }
                        }
                    },
                    async ()=>{ // name change
                        if(params.value.updateInfo.name.isChanged){
                            try{
                                // console.log("바뀔 이름 "+document.getElementById("changeName").value);
                                
                                let body = {
                                    after: document.getElementById("changeName").value
                                };

                                let result = await AXIOS.put(`/info/name`, body);

                                if(result.status === 200){
                                    // params.value.waittingString = result.data.result;
                                } else{
                                    params.value.waittingString = "이름 변경에 실패했습니다.";
                                }
                            }
                            catch(error){
                                console.log(error);
                                // throw error;
                            }
                        }
                    },
                    async ()=>{ // name change
                        if(params.value.updateInfo.phone.isChanged){
                            try{
                                // console.log("바뀔 번호 "+document.getElementById("changePhone").value);

                                let body = {
                                    after: document.getElementById("changePhone").value
                                };

                                let result = await AXIOS.put(`/info/phone`, body);

                                if(result.status === 200){
                                    // params.value.waittingString = result.data.result;
                                } else{
                                    params.value.waittingString = "휴대폰 번호 변경에 실패했습니다.";
                                }
                            }
                            catch(error){
                                console.log(error);
                                // throw error;
                            }
                        }
                    },
                    async ()=>{ // name change
                        if(params.value.updateInfo.email.isChanged){
                            try{
                                // console.log("바뀔 이메일 "+document.getElementById("changeEmail").value);

                                let body = {
                                    after: document.getElementById("changeEmail").value
                                };

                                let result = await AXIOS.put(`/info/email`, body);

                                if(result.status === 200){
                                    // params.value.waittingString = result.data.result;
                                } else{
                                    params.value.waittingString = "이메일 변경에 실패했습니다.";
                                }
                            }
                            catch(error){
                                console.log(error);
                                // throw error;
                            }
                        }
                    },
                    async ()=>{ // name change
                        if(params.value.updateInfo.address.isChanged){
                            try{
                                // console.log("바뀔 주소 ", params.value.virtualAddr);
                                let body = {
                                    after: params.value.virtualAddr.postNumber+", "+params.value.virtualAddr.baseAddr+", "+params.value.virtualAddr.detailAddr
                                };

                                // let post = document.getElementById('changePostNumber').value;
                                // let addr = document.getElementById('changeAddr').value;
                                // let detailAddr = document.getElementById('changeDetailAddr').value;

                                // let body = {
                                //     after: post+", "+addr+", "+detailAddr
                                // };

                                let result = await AXIOS.put(`/info/address`, body);

                                if(result.status === 200){
                                    // params.value.waittingString = result.data.result;
                                } else{
                                    params.value.waittingString = "주소 변경에 실패했습니다.";
                                }
                            }
                            catch(error){
                                console.log(error);
                                // throw error;
                            }
                        }
                    },
                    async ()=>{ // name change
                        if(params.value.updateInfo.pw.isChanged){
                            try{

                            }
                            catch(error){
                                throw error;
                            }
                        }
                    },
                    async ()=>{
                        try{
                            // console.log(params.value.updateInfo);
                            await store.commit('UPDATE_INFO');
                        }
                        catch(error){
                            console.log(error);
                        }
                    }
                ];



                methods.openLo(0, "변경 중", "변경 후 내 정보 창 오픈", funcList);
            },
            openLo3: async ()=>{
                const funcList = [
                    async ()=>{
                        try{
                            await methods.getCashPage(1);
                        }
                        catch(error){
                            console.log(error);
                        }
                        
                    },
                ];

                methods.openLo(2, "내역 불러오는 중", "내역불러오기", funcList);
            },
            openLo4: async ()=>{
                const funcList = [];

                methods.openLo(0, "불러오는 중", "내 정보 창 오픈", funcList);
            },
            openLo5: async ()=>{
                const funcList = [];

                methods.openLo(3, "피드백 작성창 여는중", "피드백 작성창 여는중", funcList);
            },
            openLo6: async ()=>{
                const funcList = [];

                methods.openLo(0, "피드백 전송에 성공했습니다.", "내 정보 창 여는중", funcList);
            },
            openLo7: async ()=>{
                const funcList = [];

                methods.openLo(4, "피드백 여는중", "피드백 여는중", funcList);
            },
            openLo8: async ()=>{
                const funcList = [];

                methods.openLo(0, "내 정보 불러오는 중", "내 정보 불러오는 중", funcList);
            },
            getCashPage: async (page)=>{
                try{
                    params.value.currentPage = page;
                    let result = await AXIOS.get(`/info/cashistory?page=${page}`);

                    if(result.status === 200){
                        console.log(result.data.result.cashLog);
                        
                        params.value.cashLog = result.data.result.cashLog;
                        params.value.cashPage = result.data.result.availCashPage;
                    } else{
                        params.value.cashLog = [];
                        params.value.cashPage = 1;
                    }
                }
                catch(error){
                    console.log(error);
                }
            },
            changeDate: (date)=>{
                return yyyymmdd_HHMMSS(date);
            }
        };

        onMounted(()=>{
            console.log('onMounted');
            if(store.getters.GET_IS_LOGIN){
                methods.openLo0();
            }

            fileReader.onload = (e)=>{
                let previewElement = document.getElementById('previewLogo');
                if(previewElement){
                    previewElement.src = e.target.result;
                    previewElement.height = previewElement.width;
                }
            };

            console.log(params.value.myInfo);
        });

        if(store.getters.GET_IS_LOGIN){
            methods.myInfo();
        }

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>
a, a:hover{
    text-decoration: none;
    cursor: pointer;
}

.login-form-fade-enter-from,
.login-form-fade-leave-to{
    opacity: 0;
}

.login-form-fade-enter-active,
.login-form-fade-leave-active{
    transition: all 0.5s ease;
}

#loadingding{
    animation: loadingAnimation 2s infinite ease;
}

.jjollu{
    margin: 0 0 0 15px;
    padding: 0;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: green;
    align-self: center;
}

.none-outline{
    outline: none;
}

.input-transparent{
    border: 1px black solid;
}

.input-alert{
    border: 1px red solid;
    box-shadow: 0px 0px 3px 1px red;
}

@keyframes loadingAnimation {
    0%{

    }
    100%{
        transform: rotate(2turn);
    }
}

</style>
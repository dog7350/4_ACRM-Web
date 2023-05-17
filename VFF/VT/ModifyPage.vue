<template>
    <div class="container-fluid d-flex justify-content-center">
        <table class="table white-font">
            <thead>
                <th>Info</th>
                <th>CurrentValue</th>
                <th>ChangeValue</th>
                <th>Submit</th>
            </thead>
            <tbody>
                <tr v-for="item in params.resultKey" :key="item.id">
                    <td>{{item}}</td>
                    <td>{{params.myInfo[item]}}</td>

                    <td>
                        <input 
                        type="submit" 
                        value="주소찾기" 
                        @click.prevent="methods.checkAddress" 
                        v-if="item==='address'">

                        <input 
                        :id="item"
                        type="text" 
                        placeholder="변경할 값" 
                        v-if="!(item==='money' || item==='admin' || item==='cash')">
                    </td>

                    <td>
                        <input
                        type="submit"
                        placeholder="변경"
                        @click.prevent="methods.debouncedChangeValue(item)"
                        v-if="!(item==='money' || item==='admin' || item==='cash')">
                    </td>
                </tr>
                <tr>
                    <td>로고바꾸기</td>
                    <td>
                        <input type="file" id="imageFiles" accept="image/gif, image/jpeg, image/png">
                    </td>
                    <td>
                        <input type="submit" placeholder="변경" @click.prevent="methods.changeLogo">
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'ModifyPage',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        store.commit('LOGIN_CHECK');

        

        const params = ref({
            myInfo: null,
            resultKey: null,
            unVisibleOption: ['money', 'cash', 'admin'],
        });

        const methods = {
            changeValue: (idName)=>{
                var text = document.getElementById(idName).value;
                document.getElementById(idName).value = '';
                console.log(idName, text);

                AXIOS.put(`/info/${idName}`, {after: text})
                .then((response)=>{
                    store.commit('CREATE_ALERT', {msg:response.data.result, time: 2, type:"success"});
                })
                .catch((error)=>{
                    console.log(error);
                    store.commit('CREATE_ALERT', {msg:error.response.data.result, time: 2, type:"danger"});
                })
                .finally((data)=>{
                    store.commit('LOGIN_CHECK');
                });
            },
            debouncedChangeValue: null,
            checkAddress: ()=>{
                new daum.Postcode({
                    oncomplete: function(data) {
                        var postCode = data.zonecode; // 우편번호
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
                        
                        document.getElementById('address').value = postCode+", "+ addr + " " + extraAddr;
                    }
                }).open();
            },
            changeLogo: ()=>{
                var tempFormData = new FormData();

                var imgFiles = document.getElementById('imageFiles');

                for(var i = 0; i < imgFiles.files.length; i++){
                    tempFormData.append('imageFiles', imgFiles.files[i]);
                }

                console.log(imgFiles.files[0]);

                if(imgFiles.files.length > 0){
                    AXIOS.put(`/community/logo`, tempFormData, {headers:{"Content-Type": "multipart/form-data"}})
                    .then((response)=>{
                        store.commit('CREATE_ALERT', {msg:response.data.result, time: 2, type:"success"});
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
        };

        methods.debouncedChangeValue = _.debounce(methods.changeValue, 500);

        let checkInterval = null;

        onMounted(()=>{
            setTimeout(()=>{
                try{
                    if(!store.getters.GET_IS_LOGIN){
                        store.commit('CREATE_ALERT', {msg:'로그인 후 이용해주시기 바랍니다.', time: 2, type:"danger"});
                        router.push('/main');
                    }

                    params.value.myInfo = store.getters.GET_MY_INFO;
                    if(params.value.myInfo !== null){
                        params.value.resultKey = Object.keys(params.value.myInfo);
                    }

                    checkInterval = setInterval(()=>{
                        try{
                            store.commit("LOGIN_CHECK");

                            if(!store.getters.GET_IS_LOGIN){
                                store.commit('CREATE_ALERT', {msg:'로그아웃이 감지되었습니다.', time: 2, type:"danger"});
                                router.push('/main');
                            }
                            else{
                                params.value.myInfo = store.getters.GET_MY_INFO;
                                if(params.value.myInfo !== null){
                                    params.value.resultKey = Object.keys(params.value.myInfo);
                                }
                            }
                        }
                        catch(error){
                            console.log(error);
                        }
                    }, 1000);
                }
                catch(error){
                    console.log(error);
                }
            }, 100);
            
        });

        onUnmounted(()=>{
            try{
                clearInterval(checkInterval);
            }
            catch(error){
                console.log(error);
            }
        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>

</style>
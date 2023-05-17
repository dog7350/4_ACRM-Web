<template>
    <div :id="`requestUrlWrapper${props.parentUnique}${params.form.titleInfo.unique}`" :class="`${params.isOpen?'opend':''} container-fluid d-flex flex-wrap justify-content-center`">
        <div @click="methods.click"
        id="collapseToggle" class="container-fluid over-cursor d-flex justify-content-between">
            <div id="actionWrapper" class="align-self-center border-radius-a test-border d-flex justify-content-center">
                <span class="align-self-center text-center font-bold">
                    {{params.protocolName[params.form.titleInfo.protocol]}}
                </span>
            </div>
            <div id="actionNameWrapper" class="align-self-center d-flex justify-content-start text-start">
                <span class="align-self-center text-start font-bold">
                    {{params.form.titleInfo.actionName}}
                </span>
            </div>
            <div id="URLVibiler" class="align-self-center flex-grow-1 text-start fspm">
                {{params.form.titleInfo.url}}
            </div>
            <div id="toggleButton" :class="`align-self-center is-have-plain-transition ${params.isOpen? 'is-opend': ''}`">
                <i class="bi bi-code-slash icon-size-standard is-have-plain-transition "></i>
            </div>
        </div>

        <transition name="url-fade" mode="out-in">
        <div v-if="params.isOpen"
        id="collapserWrapper">

            <div id="infoWrapper" class="start-box my-py-1">
                <div class="text-start">
                    <div class="fspll font-bold my-px-1 my-pb-1">설명</div>
                    <div class="my-px-2 my-pb-1">{{params.form.titleInfo.info}}</div>
                </div>
            </div>

            <div id="queryWrapper" class="start-box my-mt-1">
                <div class="text-start">
                    <div class="fspll font-bold my-px-1">query</div>
                </div>

                <table v-if="params.form.queryInfo.length > 0"
                class="table white-font">
                    <thead>
                        <tr class="fspm font-bold">
                            <th></th>
                            <th>타입</th>
                            <th>정보</th>
                            <th>범위</th>
                            <th>입력</th>
                        </tr>
                    </thead>
                    <tbody class="text-start fspms">
                        <tr 
                        class="my-px-2" 
                        v-for="queryItem, index in params.form.queryInfo" :key="index" >
                            <td :class="`mr-1 font-bold ${queryItem.isRequired? 'is-required': ''}`">{{`${queryItem.name}${queryItem.isRequired? '(*)': ''}`}}</td>
                            <td class="mr-1">{{queryItem.info.type}}</td>
                            <td class="mr-1">{{queryItem.info.isWhat}}</td>
                            <td class="mr-1">{{queryItem.info.valueSpectrum}}</td>
                            <td class="mr-1">
                                <input
                                :id="queryItem.name+''+params.form.titleInfo.unique"
                                :class="`adminInput ${queryItem.isRequired?'is-required-value':''}`" 
                                type="text" 
                                :disabled="queryItem.info.inputPin"
                                :required="queryItem.isRequired" 
                                :value="queryItem.info.defaultValue">
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else
                class="text-start my-mb-1">
                    <div class="fspm my-px-2 my-py-1">전달에 포함시킬 값이 없습니다.</div>
                </div>
            </div>

            <div id="bodyWrapper" class="start-box my-mt-1">
                <div class="text-start">
                    <div class="fspll font-bold my-px-1">body</div>
                </div>

                <table  v-if="params.form.bodyInfo.length > 0"
                class="table white-font">
                    <thead>
                        <tr class="fspm font-bold">
                            <th></th>
                            <th>타입</th>
                            <th>정보</th>
                            <th>범위</th>
                            <th>입력</th>
                        </tr>
                    </thead>
                    <tbody class="text-start fspms">
                        <tr 
                        class="my-px-2" 
                        v-for="bodyItem, index in params.form.bodyInfo" :key="index" >
                            <td :class="`mr-1 font-bold ${bodyItem.isRequired? 'is-required': ''}`">{{`${bodyItem.name}${bodyItem.isRequired? '(*)': ''}`}}</td>
                            <td class="mr-1">{{bodyItem.info.type}}</td>
                            <td class="mr-1">{{bodyItem.info.isWhat}}</td>
                            <td class="mr-1">{{bodyItem.info.valueSpectrum}}</td>
                            <td class="mr-1">
                                <input :id="bodyItem.name+''+params.form.titleInfo.unique"
                                :class="`adminInput ${bodyItem.isRequired?'is-required-value':''}`" 
                                type="text" 
                                :disabled="bodyItem.info.inputPin" 
                                :required="bodyItem.isRequired" 
                                :value="bodyItem.info.defaultValue">
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else
                class="text-start my-mb-1">
                    <div class="fspm my-px-2 my-py-1">전달에 포함시킬 값이 없습니다.</div>
                </div>
            </div>

            <div @click="methods.silhangClick"
            class="container-fluid btn btn-primary font-bold">
                실행
            </div>

            <div id="resultWrapperWrapper" :class="`start-box my-py-1 ${params.silhangClickIsOver === 0? '': 'rww-m2'}`">
                <transition name="fast-fade" mode="out-in">
                    <div class="text-start container-fluid d-flex justify-content-between" v-if="params.silhangClickIsOver !== 0">
                        <div class="fspll font-bold my-px-1">실행결과{{` (${params.silhangResult[params.silhangClickIsOver]}${params.resultTotal?`-${params.resultTotal}`:''}) `}}</div>

                        <div id="resultProcessWrapper">
                            <div @click="methods.viewRequest(!params.lastSendLogView)" class="btn btn-dark font-bold mr-1">
                                실행내역
                            </div>
                            <div @click="methods.saveFile" class="btn btn-success font-bold mr-1">
                                결과저장
                            </div>
                            <div @click="methods.endClick" class="btn btn-danger font-bold">
                                결과삭제
                            </div>
                        </div>
                    </div>
                </transition>

                <transition name="fast-fade" mode="out-in">
                    <request-result-vue v-if="params.lastSendLogView && params.lastSendLog !== null"
                    :resultJson="params.lastSendLog"></request-result-vue>
                </transition>

                <transition name="fast-fade" mode="out-in">
                    <request-result-vue v-if="params.silhangClickIsOver !== 0 && params.silhangClickIsOver !== 1"
                    :resultJson="params.requestResult" :filter="params.form.resultFilter"></request-result-vue>

                    <result-loading-vue v-else-if="params.silhangClickIsOver === 1"
                    ></result-loading-vue>
                </transition>
            </div>

            
        </div>
        </transition>

    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';
import RequestResultVue from './geotikaFolder/RequestResultVue.vue';
import ResultLoadingVue from './geotikaFolder/ResultLoadingVue.vue';
import axios from 'axios';

export default {
    components: { RequestResultVue, ResultLoadingVue },
    name:'RequestUrlVue',
    props: {
        infoForm: JSON, parentUnique: Number
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        
        const params = ref({
            isOpen: false,
            protocolName: [ "GET", "POST", "PUT", "DELETE" ],
            silhangResult: ['실행준비', '결과대기중', '성공', '실패', '양식 불충분'],
            form: props.infoForm? props.infoForm: {},
            silhangClickIsOver: 0, // 0 - 실행대기, 1 - 실행중, 2 - 성공, 3 - 실패, 4 - 값 오류
            requestResult: '{}',
            resultTotal: null, isSaveEnd: true, lastSendLog: null, lastSendLogView: false
        });

        const methods = {
            saveFile: ()=>{
                try{
                    if(navigator.userAgent.indexOf('Chrome') === -1){
                        store.commit('CREATE_ALERT', {msg:`크롬에서만 다운로드할 수 있습니다.`, time: 2, type:"danger"});
                    } else if(params.value.isSaveEnd){
                        params.value.isSaveEnd = false;
                        let blob = new Blob([JSON.stringify(params.value.requestResult, null, 2)], {type: 'text/plain'});
                        let file = URL.createObjectURL(blob);

                        let a = document.createElement('a');   

                        a.download = 'untitle.txt';
                        a.href = file;
                        a.click();


                        URL.revokeObjectURL(file);
                        params.value.isSaveEnd = true;
                    }
                }
                catch(error){
                    console.log(error);
                }
            },
            click: ()=>{
                params.value.isOpen = !params.value.isOpen;
            },
            silhangClick: ()=>{
                if(params.value.silhangClickIsOver !== 1){
                    params.value.silhangClickIsOver = 1;

                    var valid = true;
                    var queryList = '';
                    var bodyForm = {};

                    for(var index in params.value.form.queryInfo){
                        var tempName = params.value.form.queryInfo[index].name;
                        var tempValue = $(`#${tempName}${params.value.form.titleInfo.unique}`).val().trim();

                        if(params.value.form.queryInfo[index].isRequired && tempValue.length <= 0){
                            valid = false;
                        }

                        queryList += `${params.value.form.queryInfo[index].name}=${tempValue}&`;
                    }

                    for(var index in params.value.form.bodyInfo){
                        var tempName = params.value.form.bodyInfo[index].name;
                        var tempValue = $(`#${tempName}${params.value.form.titleInfo.unique}`).val().trim();
                        
                        if(params.value.form.bodyInfo[index].isRequired && tempValue.length <= 0){
                            valid = false;
                        }

                        bodyForm[`${tempName}`] = tempValue;
                    }

                    // console.log(queryList, bodyForm, valid);

                    try{
                        if(valid)
                            methods.sendRequest(queryList, bodyForm);
                        else{
                            params.value.requestResult = {
                                baseUrl: params.value.form.titleInfo.url,
                                query: queryList,
                                bodyData: bodyForm,
                                error: '필수로 입력해야하는 값을 확인해주세요.'
                            };
                            params.value.silhangClickIsOver = 4;
                            params.value.resultTotal = '';
                        }
                    }
                    catch(error){
                        console.log(error);
                    }
                    
                }
            },
            sendRequest: async (query, bodyData)=>{
                try {
                    var lastUrl = `${params.value.form.titleInfo.url}?${query}`;
                    var method = '';

                    if(params.value.form.titleInfo.protocol === 0){
                        method = 'get';
                    } else if(params.value.form.titleInfo.protocol === 1){
                        method = 'post';
                    } else if(params.value.form.titleInfo.protocol === 2){
                        method = 'put';
                    } else if(params.value.form.titleInfo.protocol === 3){
                        method = 'delete';
                    }

                    params.value.lastSendLog = {
                        'method': method,
                        'url': lastUrl,
                        'data': bodyData,
                    };

                    AXIOS.request({
                        'method': method,
                        'url': lastUrl,
                        'data': bodyData,
                    })
                    .then((response)=>{
                        params.value.requestResult = response.data;
                    })
                    .catch((error)=>{
                        params.value.requestResult = error.response.data;
                    })
                    .finally((data)=>{
                        if(params.value.requestResult.code === 200){
                            params.value.silhangClickIsOver = 2;
                        } else{
                            params.value.silhangClickIsOver = 3;
                        }

                        params.value.resultTotal = params.value.requestResult.code;
                    });

                    
                }
                catch (error) {
                    console.log(error);
                }
            },
            endClick: ()=>{
                params.value.silhangClickIsOver = 0;
                params.value.requestResult = {};
                params.value.resultTotal = null;
                methods.viewRequest(false);
            },
            viewRequest: (value)=>{
                params.value.lastSendLogView = value;
            }
        }

        onMounted(async ()=>{
            // methods.sendRequest();
            // console.log(params.value.form);
        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
/* #collapser{
    padding-top: 0;
} */

.padding-ten{
    padding: 10px;
}

#requestURLWrapper{
    position: relative;
    overflow: hidden;
    padding: 0;
    z-index: 4;
    margin-top: 15px;
    background-color: black;
    
}

#requestURLWrapper{

}

#collapseToggle{
    padding: 1em 1.2em;
    /* border-bottom: .5px white solid; */
}
/* rgb(0, 206, 79) */
#collapserWrapper{
    position: relative;
    width: 100%;
    z-index: 3;
    padding: 1em 1.2em;
    border: .5px white solid;
    margin: 0.5em 0 1.5em 0;
    /* border-top: none; */
}

#actionWrapper, #actionNameWrapper{
    padding: 2px;
    min-width: 7em;
    height: 100%;
}

#actionWrapper{
    margin-right: 1.5em;
}

#URLVibiler{
    padding: 0 1.5em;
}

.url-fade-enter-from{
    opacity: 0;
}

.url-fade-leave-to{
    opacity: 0;
}

.url-fade-enter-active, .url-fade-leave-active{
    transition: all 0.5s ease;
}

.is-opend{
    /* transform: rotate(-180deg); */
}

.my-mx-1{
    margin-left: 10px;
    margin-right: 10px;
}

.my-mx-2{
    margin-left: 20px;
    margin-right: 20px;
}

.my-px-1{
    padding-left: 10px;
    padding-right: 10px;
}

.my-px-2{
    padding-left: 20px;
    padding-right: 20px;
}

.my-py-1{
    padding-top: 10px;
    padding-bottom: 10px;
}

.my-py-2{
    padding-top: 20px;
    padding-bottom: 20px;
}

.my-pt-1{
    padding-top: 10px;
}

.my-pb-1{
    padding-bottom: 10px;
}

.mr-1{
    margin-right: 1em;
}

.my-mb-1{
    margin-bottom: 1em;
}

.is-required{
    color: rgb(133, 100, 255)
}

tr{
    border: 1px transparent solid;
}

th{
    padding-top: 0;
}

input[type=text]{
    border: none;
    outline: none;
    font-weight: bold;
}

input[type=text].is-required-value:invalid{
    outline: 3px rgb(255, 79, 79) solid;
}

input[type=text].is-required-value:valid{
    outline: 3px rgb(0, 173, 107) solid;
}

input[type=text]:focus{
    outline: 3px cornflowerblue solid;
}

input[type=text]:disabled{
    outline: 3px rgb(0, 173, 107) solid;
    background-color: rgb(175, 175, 175);
    color:black
}

.rww-m2{
    margin-top: 2em;
}

#actionNameWrapper{
    min-width: 15em;
}

.requestDiv{
    border: 1px rgb(255, 255, 255) solid;
    background: rgb(44, 44, 44);
}
</style>
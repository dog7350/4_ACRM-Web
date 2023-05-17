<template>
    <div id="chatContainer" class="w-100 m-0 p-0 d-flex flex-wrap">
        <div class="d-flex w-100">
            <div class="input-group mb-3 w-100 d-flex flex-wrap">
                <label class="w-100" for="inputCond">검색 조건</label>
                <input 
                @keypress.enter="methods.addCondition" placeholder="검색할 조건을 입력해 주세요."
                list="browsers" type="text" id="inputCond"
                :class="`${params.isValid?'':'invalid'} form-controll w-75`" v-model="params.inputText">
                <datalist id="browsers">
                    <option value="user:"/>
                    <option value="content:"/>
                    <option value="cmd:"/>
                    <option value="opt:"/>
                    <option value="roomName:"/>
                    <option value="start:"/>
                    <option value="end:"/>
                    <option value="order:"/>
                </datalist>
                <button @click="methods.addCondition"
                class="btn btn-primary w-25" type="button">추가하기</button>
            </div>
        </div>
        
        
        <div class="d-flex flex-wrap w-100 mb-3">
            <div class="w-100 mb-3">현재 검색 조건&nbsp;:&nbsp;{{params.parameterList.length}}</div>

            <transition-group 
            name="fast-fade" mode="out-in" tag="div" class="w-100 h-auto d-flex flex-wrap blockContainer border-radius-a">
                <ConditionBlock v-for="item, index in params.parameterList" :key="index"
                @DELETE="methods.delteCondition"
                :queryName="item.forward" :index="item.customIndex" :type="0" :value="item.backward"/>
            </transition-group>
        </div>

        <div class="d-flex flex-wrap w-100">
            
        </div>
    </div>  
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';

import ConditionBlock from './ConditionBlock.vue';

export default {
    components: { ConditionBlock },
    name:'ChatContainer',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        
        const params = ref({
            parameterList: [], customIndex: 0,
            inputText: '', isValid: true,
        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
            },
            delteCondition: (index)=>{
                // console.log(`indexindexindexindexindex ${index}`);
                params.value.parameterList = params.value.parameterList.filter((item)=>{
                    return item.customIndex != index;
                });
            },
            valid: (text)=>{
                let result = true;

                try{
                    if(text.indexOf(':') == -1){
                        result = false;

                    }
                }
                catch(e){
                    console.log(e);
                    result = false;
                }

                params.value.isValid = result;

                return result;
            },
            addCondition: ()=>{
                if(methods.valid(params.value.inputText)){
                    let result = {};
                    let [forward, backward] = params.value.inputText.split(':');
                    
                    [forward, backward] = [forward.trim(), backward.trim()];

                    // result[forward] = backward;

                    result = {
                        'forward': forward, 'backward': backward, 'customIndex': params.value.customIndex
                    }

                    params.value.customIndex = params.value.customIndex + 1;

                    params.value.inputText = '';
                    params.value.parameterList.push(result);
                } else{

                }
            },
        }

        onMounted(()=>{

        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>

.invalid, .invalid:focus{
    outline: none;
    border: 2px red solid;
    box-shadow: 0px 0px 5px 1px red;
}

.blockContainer{
    padding: 10px;
    border: 2px rgb(8, 90, 243) solid;
}

</style>
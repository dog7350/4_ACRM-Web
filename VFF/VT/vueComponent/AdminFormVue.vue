<template>
    <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
        <h1></h1>
        <form class="container-fluid">
                <div class="form-floating mb-3 mt-3" v-for="item in params.formArray" :key="item.id">
                    <input :id="item.id" type="text" class="form-control" :placeholder="item.msg"> 
                    <label :for="item.id">{{item.msg}}</label>
                </div>

                <div class="d-grid">
                    <input type="submit" :class="`btn btn-success ${params.sendStatus?'disabled':''}`" @click.prevent="methods.onSubmit" :value="params.buttonName">
                </div>
        </form>
        <transition name="table-fade" mode="out-in">
            <div class="container-fluid" v-if="params.result == null">
                <div v-if="params.sendStatus === 0">
                    요청해주세요!
                </div>
                <div v-else-if="params.sendStatus === 1">
                    현재 요청 결과를 기다리는 중 입니다.
                </div>
            </div>
            <div class="container-fluid" v-else-if="params.result != null">
                <transition name="table-fade" mode="out-in">
                    <table class="table table-striped" v-if="params.resultCode == 200 && params.methodType === 'post' && params.url === '/info/adminr'">
                        <thead>
                            <th v-for="key in params.colStorage" :key="key">{{key}}</th>
                        </thead>
                        <tbody >
                            <tr v-for="item in params.result" :key="item">
                                <td v-for="key in params.colStorage" :key="key">{{item[key]}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else>
                        결과: {{params.result}}<br>
                        응답코드: {{params.resultCode}}
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore';
import AXIOS from 'axios';

export default {
    name:'AdminPage',
    props:{
        formJson: JSON
    },
    setup(props) {
        const store = Store;
        const router = useRouter();

        const params = ref({
            formArray: props.formJson.formArray,
            buttonName: props.formJson.buttonName,
            methodType: props.formJson.methodType,
            url: props.formJson.url,
            result: null,
            sendStatus: 0,
            resultCode: null,
            colStorage: [],
        });

        const methods = {
            onSubmit: ()=>{
                let querystring = '?';
                let body = {};

                for(var item in params.value.formArray){
                    item = params.value.formArray[item];

                    if(item.type === 'qs') querystring = querystring.concat(item.id, '=', document.getElementById(item.id).value, '&');
                    else if(item.type === 'body'){
                        body[item.id] = document.getElementById(item.id).value;
                    }
                }

                if(params.value.sendStatus === 0){
                    params.value.sendStatus = 1;
                    params.value.result = null;
                    params.value.resultCode = null;
                    params.value.colStorage = null;

                    if(params.value.methodType === 'post'){
                        AXIOS.post(params.value.url+querystring, body)
                        .then((res)=>{
                            console.log(res.data);

                            params.value.result = res.data.result;
                            params.value.resultCode = res.data.code;

                            if(params.value.result.length > 0)
                                params.value.colStorage = Object.keys(params.value.result[0]);
                        })
                        .catch((err)=>{
                            console.log(err.response.data);
                            params.value.result = err.response.data.result;
                            params.value.resultCode = err.response.data.code;
                        })
                        .finally((data)=>{
                            params.value.sendStatus = 0;
                        });

                    } else if(params.value.methodType === 'put'){
                        var tempBody = body;
                        tempBody.code = 0;
                        AXIOS.put(params.value.url+querystring, tempBody)
                        .then((res)=>{
                            console.log(res.data);

                            params.value.result = `${res.data.result}개의 행을 성공적으로 수정했습니다.`;
                            params.value.resultCode = res.data.code;
                        })
                        .catch((err)=>{
                            console.log(err.response.data);
                            params.value.result = err.response.data.result;
                            params.value.resultCode = err.response.data.code;
                        })
                        .finally((data)=>{
                            params.value.sendStatus = 0;
                        });

                    } else if(params.value.methodType === 'delete'){
                        AXIOS.delete(params.value.url+querystring, {data: body})
                        .then((res)=>{
                            console.log(res.data);

                            params.value.result = `${res.data.result}개의 행을 성공적으로 수정했습니다.`;
                            params.value.resultCode = res.data.code;
                        })
                        .catch((err)=>{
                            console.log(err.response.data);
                            params.value.result = err.response.data.result;
                            params.value.resultCode = err.response.data.code;
                        })
                        .finally((data)=>{
                            params.value.sendStatus = 0;
                        });
                    }
                }
            }
        };

        return {
            params, methods
        };
    },
}
</script>

<style scoped>
tr, th{
    text-align: center;
}

.table-fade-enter-from,
.table-fade-leave-to{
    transform: translateY(100%);
    opacity: 0;
}
.table-fade-enter-active,
.table-fade-leave-active{
    transition: all 0.5s ease;
}
</style>
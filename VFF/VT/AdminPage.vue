<template>
    <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
        <div class="container-fluid row">
            <button class="col-xl-3 btn btn-primary" @click="methods.indexChange(0)">SELECT</button>
            <button class="col-xl-3 btn btn-primary" @click="methods.indexChange(1)">UPDATE</button>
            <button class="col-xl-3 btn btn-primary" @click="methods.indexChange(2)">DELETE</button>
            <button class="col-xl-3 btn btn-primary" @click="methods.indexChange(3)">INSERT</button>
        </div>
        <transition name="admin-form-fade" mode="out-in">
            <div class="container-fluid d-flex flex-column my-3 mx-auto p-0">
                <div class="container-fluid d-flex justify-content-center">
                    <h1>관리자 페이지</h1>
                </div>

                <div class="container-fluid d-flex justify-content-center row my-2 mx-auto p-0">
                    <div class="col-sm-4 container-fluid mx-1 p-0"><input type="text" class="form-control"
                    v-model="params.renameForm.userid"
                    placeholder="유저 ID"></div>
                    <div class="col-sm-4 container-fluid mx-1 p-0"><input type="text" class="form-control"
                    v-model="params.renameForm.changename"
                    placeholder="바꿀 이름"></div>
                    <div class="col-sm-3 container-fluid mx-1 p-0"><input type="submit" class="form-control btn btn-dark"
                    @click.prevent="methods.admin(params.renameForm)"
                    value="변경"></div>
                </div>

                <div class="container-fluid d-flex justify-content-center row my-2 mx-auto p-0">
                    <div class="col-sm-4 container-fluid mx-1 p-0"><input type="text" class="form-control"
                    v-model="params.authorizeForm.userid"
                    placeholder="유저 ID"></div>
                    <div class="col-sm-4 container-fluid mx-1 p-0"><input type="text" class="form-control"
                    v-model="params.authorizeForm.changeauth"
                    placeholder="바꿀 권한"></div>
                    <div class="col-sm-3 container-fluid mx-1 p-0"><input type="submit" class="form-control btn btn-dark"
                    @click.prevent="methods.admin(params.authorizeForm)"
                    value="변경"></div>
                </div>

                <div class="container-fluid d-flex justify-content-center row my-2 mx-auto p-0">
                    <div class="col-sm-3 container-fluid mx-1 p-0"><input type="text" class="form-control"
                    v-model="params.banForm.targetid"
                    placeholder="유저 ID"></div>

                    <div class="col-sm-2 container-fluid mx-1 p-0"><input type="text" class="form-control"
                    v-model="params.banForm.bantype"
                    placeholder="x or p"></div>

                    <div class="col-sm-4 container-fluid mx-1 p-0"><input type="text" class="form-control"
                    v-model="params.banForm.because"
                    placeholder="사유"></div>

                    <div class="col-sm-2 container-fluid mx-1 p-0"><input type="submit" class="form-control btn btn-dark"
                    @click.prevent="methods.ban()"
                    value="변경"></div>
                </div>
            </div>
        </transition>
        <transition name="admin-form-fade" mode="out-in">
            <admin-form-vue v-if="params.index === 0"
            :formJson="params.selectForm"></admin-form-vue>
            <admin-form-vue v-else-if="params.index === 1"
            :formJson="params.updateForm"></admin-form-vue>
            <admin-form-vue v-else-if="params.index === 2"
            :formJson="params.deleteForm"></admin-form-vue>
            <admin-form-vue v-else-if="params.index === 3"
            :formJson="params.insertForm"></admin-form-vue>
        </transition>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../VXS/VuexStore'
import AXIOS from 'axios';
import AdminFormVue from './vueComponent/AdminFormVue.vue';

export default {
    components: { AdminFormVue },
    name:'AdminPage',
    setup() {
        const store = Store;
        const router = useRouter();
        
        store.commit('LOGIN_CHECK');
        

        const params = ref({
            index: 0,
            selectForm: {
                formArray:[
                    {id:'table', msg:'tableName', type:'body'},
                    {id:'colname', msg:'colname', type:'body'},
                    {id:'condition', msg:'condition', type:'body'},
                    {id:'page', msg:'page', type:'qs'},
                    {id:'pagesize', msg:'pagesize', type:'qs'}
                ],
                buttonName:'send',
                methodType:'post',
                url: '/info/adminr'
            },
            updateForm: {
                formArray:[
                    {id:'table', msg:'tableName', type:'body'},
                    {id:'colname', msg:'colname', type:'body'},
                    {id:'condition', msg:'condition', type:'body'},
                ],
                buttonName:'send',
                methodType:'put',
                url: '/info/admin'
            },
            deleteForm: {
                formArray:[
                    {id:'table', msg:'tableName', type:'body'},
                    {id:'condition', msg:'condition', type:'body'},
                ],
                buttonName:'send',
                methodType:'delete',
                url: '/info/admin'
            },
            insertForm: {
                formArray:[
                    {id:'table', msg:'tableName', type:'body'},
                    {id:'valueName', msg:'valueName', type:'body'},
                    {id:'value', msg:'value', type:'body'},
                ],
                buttonName:'send',
                methodType:'post',
                url: '/info/admini'
            },
            renameForm: {
                code: 2,
                userid: '',
                changename: ''
            },
            authorizeForm: {
                code: 1,
                userid: '',
                changeauth: ''
            },
            banForm: {
                code: 3,
                targetid: '',
                because: '',
                bentype: '',
            }
        });

        const methods = {
            indexChange: (changeIndex)=>{
                params.value.index = changeIndex;
            },
            admin: (bodyForm)=>{
                console.log(bodyForm);
                
                AXIOS.put('/info/admin', bodyForm)
                .then((response)=>{
                    console.log(response.data);
                    store.commit("CREATE_ALERT", {msg: response.data.result, time: 1, type: 'success'});
                })
                .catch((error)=>{
                    console.log(error.response.data);
                    store.commit("CREATE_ALERT", {msg: error.response.data.result, time: 1, type: 'danger'});
                })
                .finally((result)=>{
                    
                });
                
            },
            ban: ()=>{
                console.log(params.value.banForm);

                AXIOS.put('/info/admin', params.value.banForm)
                .then((response)=>{
                    console.log(response.data);
                    store.commit("CREATE_ALERT", {msg: response.data.result, time: 1, type: 'success'});
                })
                .catch((error)=>{
                    console.log(error.response.data);
                    store.commit("CREATE_ALERT", {msg: error.response.data.result, time: 1, type: 'danger'});
                })
                .finally((result)=>{

                });
            }
        };

        let checkInterval = null;

        onMounted(()=>{
            setTimeout(()=>{
                if(store.getters.GET_AUTH !== 'o'){
                    store.commit('CREATE_ALERT', {msg:'권한이 부족합니다.', time: 2, type:"danger"});
                    router.push('/main');
                } 

                try{
                    checkInterval = setInterval(()=>{
                        try{
                            store.commit("LOGIN_CHECK");

                            if(!store.getters.GET_IS_LOGIN){
                                store.commit('CREATE_ALERT', {msg:'로그아웃이 감지되었습니다.', time: 2, type:"danger"});
                                router.push('/main');
                            } else if(store.getters.GET_AUTH !== 'o'){
                                store.commit('CREATE_ALERT', {msg:'권한이 부족합니다.', time: 2, type:"danger"});
                                router.push('/main');
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
            }, 200);
        });

        onUnmounted(()=>{
            try{
                clearInterval(checkInterval);
            }
            catch(error){
                console.log(error);
            }
        });



        return {
            params, methods
        };
    },
}
</script>

<style>
/* .admin-form-fade-enter-from,
.admin-form-fade-leave-to{
    transform: translateY(100%);
    opacity: 0;
} */

.admin-form-fade-enter-from{
    transform: translateX(-100%);
    opacity: 0;
}

.admin-form-fade-leave-to{
    transform: translateY(100%);
    opacity: 0;
}

.admin-form-fade-enter-active,
.admin-form-fade-leave-active{
    transition: all 0.5s ease;
}
</style>
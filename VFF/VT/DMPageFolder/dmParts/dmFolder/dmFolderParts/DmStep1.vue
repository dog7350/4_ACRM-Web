<template>
    <div id="StepOneWrapper" class="w-100 p-0 d-flex flex-wrap">
        <div id="stepOneInput" class="w-100">
            <input id="dmInputText" type="text" class="w-100 input-not-alert" placeholder="DM을 진행할 ID를 입력해주세요!" v-model="params.dmTarget">
        </div>
        <div id="stepOneList" class="w-100 d-flex flex-wrap">
            <div class="w-100 fspl text-start mt-2">친구:</div>
            <div class="d-flex flex-wrap p-1 mx-2 my-1 alert alert-info border-radius-c fsps over-cursor align-items-center" 
            v-for="item, index in params.friendList" :key="index" @click="methods.changeValue(item.id)">
                <img class="align-self-center me-2" 
                width="30" height="30" :src="item.logo? item.logo: '/images/board/logos/none.png'" 
                alt="" @error="(e)=>e.target.src='/images/board/logos/none.png'">
                <div class="d-flex flex-column">
                    <div><strong>아이디: {{item.id}}</strong></div>
                    <div><strong>닉네임: {{item.name}}</strong></div>
                </div>
            </div>
            <div class="w-100 fspl text-start mt-2">팔로우:</div>
            <div class="d-flex flex-wrap p-1 mx-2 my-1 alert alert-info border-radius-c fsps over-cursor align-items-center" 
            v-for="item, index in params.followList" :key="index" @click="methods.changeValue(item.id)">
                <img class="align-self-center me-2" 
                width="30" height="30" :src="item.logo? item.logo: '/images/board/logos/none.png'" 
                alt="" @error="(e)=>e.target.src='/images/board/logos/none.png'">
                <div class="d-flex flex-column">
                    <div><strong>아이디: {{item.id}}</strong></div>
                    <div><strong>닉네임: {{item.name}}</strong></div>
                </div>
            </div>
        </div>
        <div id="startButton" class="w-100 btn btn-success mt-4" @click="methods.startDM">
            다음
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import AXIOS from 'axios';


export default {
    name:'DmStep1',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const IDRegExp = /^[0-9A-Za-z]{3,}$/; // 특수문자를 금지한 문자 3개이상

        const params = ref({
            friendList: [],
            followList: [],
            dmTarget: '',
        });

        const methods = {
            loadDMList: ()=>{
                AXIOS.get('/info/dmList')
                .then((res)=>{
                    let result = res.data.result;
                    params.value.friendList = result.friend;
                    params.value.followList = result.follow;
                })
                .catch((err)=>{
                    console.log(err);
                });
            },
            changeValue: (item)=>{
                params.value.dmTarget = item;
            },
            startDM: ()=>{
                if(IDRegExp.test(params.value.dmTarget)){
                    context.emit("GOSTEPTWO", {target: params.value.dmTarget});

                    $("#dmInputText").addClass('input-not-alert');
                    $("#dmInputText").removeClass('input-alert');
                } else{
                    $("#dmInputText").addClass('input-alert');
                    $("#dmInputText").removeClass('input-not-alert');
                }
                
            }
        };

        onMounted(()=>{
            methods.loadDMList();
            $('#DMRootContainer').animate({scrollTop: $('#DMRootContainer').scrollTop()+$('#DmRootWrapper').offset().top}, 300);
            if(route.query['match']){
                params.value.dmTarget = route.query['target']? route.query['target']: '';
                router.replace(route.path);

                methods.startDM();
            }
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{

        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
.input-alert{
    border: 1px red solid;
    box-shadow: 0px 0px 3px 1px red;
}

.input-not-alert{
    border: 1px black solid;
    box-shadow: 0px 0px 3px 1px transparent;
}
</style>
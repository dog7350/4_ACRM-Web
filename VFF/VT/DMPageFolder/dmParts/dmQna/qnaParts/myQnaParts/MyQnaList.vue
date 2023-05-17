<template>
    <div id="QuestionRegistRootWrapper" class="w-100 d-flex flex-wrap m-2 p-2 border-radius-c">
        <div @click="methods.cancel" style="height: fit-content;"
        class="w-100 d-flex flex-wrap m-0 p-0 over-cursor alert alert-danger text-center justify-content-center">
            뒤로가기
        </div>
        <div @click="methods.getQnaList" style="height: fit-content;"
        class="w-100 d-flex flex-wrap mt-2 mb-0 mx-0 p-0 over-cursor alert alert-success text-center justify-content-center">
            리스트 새로고침
        </div>

        <transition name="fast-fade" mode="out-in">
            <div v-if="params.isNone"
            class="w-100 m-0 p-0 font-bold text-center">
                내 Q&amp;A가 존재하지 않습니다.
            </div>
            <transition-group v-else
            name="multipleBoardList" mode="out-in" class="container-fluid d-flex flex-wrap mt-3 mb-0 mx-0 p-0" tag="ul" style="listStyle:none;">
                <li class="w-100 my-2 p-0" v-for="item, index in params.myQnaList" :key="index">
                    <MyQnaPart :data="item"/>
                </li>
            </transition-group>
        </transition>

    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../../VXS/VuexStore'
import AXIOS from 'axios';

import { debounce } from 'lodash';

import MyQnaPart from './MyQnaPart.vue';

export default {
    name:'MyQnaList',
    components: {
        MyQnaPart
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            myQnaList: [],
            currentSelectedNumber: -1, 
            isNone: false,
        });

        const methods = {
            getQnaList: ()=>{
                AXIOS.get('/qna/mine')
                .then((response)=>{
                    if(response.data.result.length){
                        params.value.myQnaList = [];
                        params.value.myQnaList.push(...response.data.result);
                        params.value.isNone = false;
                    } else{
                        params.value.isNone = true;
                    }

                    // console.log(params.value.myQnaList);
                })
                .catch((error)=>{
                    store.commit("CREATE_ALERT", {msg: error.response.data.result, time: 2, type:"danger"});
                })
            },
            cancel: ()=>{
                context.emit("CHANGEPAGE", 0);
            },
        };

        onMounted(()=>{
            methods.getQnaList();
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

.multipleBoardList-enter-from, .multipleBoardList-leave-to{
    opacity: 0;
}

.multipleBoardList-enter-active, .multipleBoardList-leave-active{
    transition: all 0.3s ease;
}

</style>
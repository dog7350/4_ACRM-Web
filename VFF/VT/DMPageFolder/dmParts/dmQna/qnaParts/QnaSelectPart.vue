<template>
    <div id="QnaRootPart" :class="`d-flex flex-wrap container-fluid justify-content-center align-items-center text-center font-bold`">
        <div @click="methods.changePage(1)"
        id="questionRegist" class="w-40 m-2 p-2 alert alert-info over-cursor common-style">
            <strong>
                Q&amp;A 등록
            </strong>
        </div>

        <div @click="methods.changePage(2)"
        id="myQuestion" class="w-40 m-2 p-2 alert alert-primary over-cursor common-style">
            <strong>
                내 Q&amp;A
            </strong>
        </div>

        <div id="commonQuestiuon" :class="`w-${['o', 'm'].indexOf(store.getters.GET_AUTH) === -1? '100': '40'} m-2 p-2 alert alert-danger over-cursor common-style`">
            <strong>
                자주 있는 Q&amp;A
            </strong>
        </div>

        <div @click="methods.changePage(3)"
        id="" class="w-40 m-2 p-2 alert alert-dark over-cursor common-style">
            <strong>
                답변하기
            </strong>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import AXIOS from 'axios';

export default {
    name:'QnaSelectPart',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            
        });

        const methods = {
            changePage: (payload)=>{
                context.emit("CHANGEPAGE", payload);
            },
        };

        onMounted(()=>{

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

.w-40{
    width: 45%;
}

.border-maker{
    border: 3px solid;
}

.common-style{
    height: fit-content;
    border: 3px solid;
}

</style>
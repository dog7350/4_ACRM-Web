<template>
    <div id="QnaRootWrapper" :class="`d-flex flex-wrap container-fluid justify-content-center text-center p-0`">
        <transition name="fast-fade" mode="out-in">
            <QnaSelectPart @CHANGEPAGE="methods.changePage" v-if="params.state === 0" />
            <RegistVue @CHANGEPAGE="methods.changePage" v-else-if="params.state === 1" />
            <MyQnaList @CHANGEPAGE="methods.changePage" v-else-if="params.state === 2" />
            <AnswerQnaList @CHANGEPAGE="methods.changePage" v-else-if="params.state === 3" />
        </transition>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';

import QnaSelectPart from './qnaParts/QnaSelectPart.vue';
import RegistVue from './qnaParts/registParts/RegistVue.vue';
import MyQnaList from './qnaParts/myQnaParts/MyQnaList.vue';
import AnswerQnaList from './qnaParts/answerQnaParts/AnswerQnaList.vue';

export default {
    name:'QnaPart',
    components: {
        QnaSelectPart, RegistVue, MyQnaList, AnswerQnaList
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            state: 0,
        });

        const methods = {
            changePage: (payload)=>{
                params.value.state = payload;
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

#QnaRootWrapper{
    min-height: 150px;
    border: 3px solid rgb(53, 121, 247);
    /* border: 3px solid black; */
}

</style>
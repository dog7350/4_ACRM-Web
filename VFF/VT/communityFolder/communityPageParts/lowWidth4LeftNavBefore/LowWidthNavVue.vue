<template>
    <div id="boardsNCodefTypeRootWrapperByMobile" class="d-flex container-fluid justify-content-center mx-auto my-0 white-font">
        <div id="boardsNCodefTypeWrapperByMobile" class="fspll d-flex container-fluid justify-content-between mx-auto p-0">
            <div :id="`boardsType${index}`" v-for="item, index in params.currentBoardListByMobile" :key="item" class="mx-2 align-self-center">
                <i
                :class="`bi ${item} over-cursor ${index==props.currentBoardType?'is-selected-btype':''} over-cursor-blue`"
                @click="methods.changeBtype(index, params.currentIndexNumberByBtype[index])"
                ></i>
            </div>

            <transition-group name="standard-fade" mode="out-in">
                <div v-show="store.getters.GET_IS_LOGIN"
                :id="`lowCodef${index}`" v-for="item, index in params.currentCodefListByMobile" :key="item" class="mx-2 align-self-center">
                    <i
                    :class="`bi ${item} over-cursor ${store.state.currentCodef === params.currentIndexNumberByCodef[index]? 'is-selected-codef': ''} ${store.getters.GET_IS_MOBILE? '': 'over-cursor-yellow'}`"
                    @click="methods.changeCodef(index)"
                    ></i>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'

export default {
    name:'lowWidth4NavVue',
    props:{
        currentBoardType: String,
        currentOrderType: Number
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            currentCodefListByMobile: {
                '팔로우': 'bi-person-heart',
                '친구': 'bi-person-hearts',
                '새소식': 'bi-people-fill',
            },
            currentBoardListByMobile: {
                '전체': 'bi-archive',
                '잡담': 'bi-chat-dots',
                '유머': 'bi-emoji-laughing',
                '정보': 'bi-boombox',
                '공지': 'bi-broadcast-pin',
            },
            currentIndexNumberByCodef: {
                '팔로우': 3,
                '친구': 4,
                '새소식': 5,
            },
            currentIndexNumberByBtype: {
                '전체': 0,
                '잡담': 1,
                '유머': 2,
                '정보': 3,
                '공지': 4,
            }
        });

        const methods = {
            changeBtype: (bName, index)=>{
                // console.log({emitText: bName, id: `left-router-tab-wrapper-${index}`});
                context.emit('LISTCALLERBTYPE', {emitText: bName, id: `left-router-tab-wrapper-${index}`});
            },
            changeCodef: (codefText)=>{
                // console.log({codef: params.value.currentIndexNumberByCodef[codefText]});
                context.emit('LEFTCODEFCALLER', {codef: params.value.currentIndexNumberByCodef[codefText]});
            }
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
.is-selected-btype{
    color: cornflowerblue;
}

.is-selected-codef{
    color: Yellow;
}

.over-cursor-blue:hover{
    color: cornflowerblue;
}

.over-cursor-yellow:hover{
    color: yellow;
}

#boardsNCodefTypeRootWrapperByMobile{
    width: fit-content;
    padding: 0 1vmin 0 1vmin;
}
</style>
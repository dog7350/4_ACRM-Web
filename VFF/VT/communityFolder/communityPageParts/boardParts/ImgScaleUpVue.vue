<template>
    <div id="ImgScaleUp" class="d-flex justify-content-center align-items-center">
        <div id="img-scale-up-wrapper" class="d-flex justify-content-around m-0 p-0">

            <div id='button-wrapper' class="container-fluid d-flex align-self-center justify-content-around align-items-center fspl" v-if="params.currentImgPath[0].length>1">
                <button class="img-slide-button border-radius-c is-have-plain-transition" @click="methods.changeCurrentVisible(params.currentVisible-1)">
                    <i class="bi bi-chevron-compact-left is-have-plain-transition"></i>
                </button>
                <button class="img-slide-button border-radius-c is-have-plain-transition" @click="methods.changeCurrentVisible(params.currentVisible+1)">
                    <i class="bi bi-chevron-compact-right is-have-plain-transition"></i>
                </button>
            </div>
            <transition-group name="img-scale-fade-silde" mode="out-in">
                <div class="m-0 p-0" v-for="imgSrc, index in params.currentImgPath[0]" :key="imgSrc" v-show="index === params.currentVisible">
                    <img class="iimmgg mx-2 white-font" onerror="this.alt=`사진을 찾지 못했습니다.`"
                    :src="imgSrc" :key="index" v-show="index === params.currentVisible">
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
    name:'ImgScaleUpVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            currentImgPath: store.state.imgMsg,
            currentVisible: null,
        });

        const methods = {
            changeCurrentVisible: (i)=>{
                if(i >= params.value.currentImgPath[0].length) {
                    params.value.currentVisible = 0;
                } else if(i < 0){
                    params.value.currentVisible = params.value.currentImgPath[0].length-1;
                } else{
                    params.value.currentVisible = i;
                }
            }
        };

        onMounted(()=>{
            params.value.currentVisible = params.value.currentImgPath[1];
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{

        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>

.iimmgg{
    max-width: 70vw;
    height: auto;
}

#img-scale-up-wrapper{
    z-index: 2001;
    width: auto;
    height: auto;
}

#ImgScaleUp{
    z-index: 2000;
    width: auto;
    height: auto;
}

.img-slide-button{
    background: rgba(0,0,0,0);
    width: 5vmin;
    height: 5vmin;
    min-width: 30px;
    min-height: 30px;
    max-width: 48px;
    max-height: 48px;
    color: rgba(255, 255, 255, 0.5);
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    border: none;
    outline: none;
}

.img-slide-button:hover{
    background: rgb(78, 78, 78);
    color: white
}

.img-slide-button:hover{
    color: white;
    text-shadow: -2px 0 1px orange, 0 2px 1px orange, 2px 0 1px orange, 0 -2px 1px orange;
}

#button-wrapper{
    position: fixed;
    width: 100%;
    height: auto;
}


.img-scale-fade-silde-enter-from{
    opacity: 0;
}

.img-scale-fade-silde-leave-to{
    width: 0;
    height: 0;
    opacity: 0;
}

.img-scale-fade-silde-enter-active{
    transition: all 0.3s ease;
}

.img-scale-fade-silde-leave-active{
    position: fixed;
    width: 0;
    height: 0;
    transition: all 0.3s ease;
}
</style>
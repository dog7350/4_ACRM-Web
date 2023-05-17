<template>
    <div id="userPostBoxRootWrapper" class="d-flex flex-column container-fluid justify-content-center mx-auto white-font fspm">
        <div id="postInformationText" class="font-bold fspm">
            이건 어떠신가요?
        </div>
        <div id="userPostBoxWrapper" class="d-flex container-fluid justify-content-between mx-auto p-0 black-font">
            <div @click="methods.operWriteForm"
            id="userPostWriteWrapper" class="post-div over-cursor border-radius-a d-flex container-fluid justify-content-around mx-1 p-1 text-center">
                <div :class="`m-0 p-0 d-flex ${store.getters.GET_BROWSER_SIZE <= 500? 'fspll': ''}`">
                    <i id="postIcon" class="bi bi-clipboard-fill align-self-center is-have-fase-transition"></i>
                </div>
                <div class="m-0 p-0 align-self-center" v-if="store.getters.GET_BROWSER_SIZE > 500">
                    글작성
                </div>
                <div class="m-0 p-0 d-flex" v-if="store.getters.GET_BROWSER_SIZE > 500">
                    <i class="bi bi-chevron-double-right align-self-center"></i>
                </div>
            </div>

            <div id="downloadGameWrapper" class="post-div over-cursor border-radius-a d-flex container-fluid justify-content-around mx-1 p-1 text-center">
                <div :class="`m-0 p-0 d-flex ${store.getters.GET_BROWSER_SIZE <= 500? 'fspll': ''}`">
                    <i id="downloadIcon" class="bi bi-device-ssd-fill align-self-center is-have-fase-transition"></i>
                </div>
                <div class="m-0 p-0 align-self-center" v-if="store.getters.GET_BROWSER_SIZE > 500">
                    자료실
                </div>
                <div class="m-0 p-0 d-flex" v-if="store.getters.GET_BROWSER_SIZE > 500">
                    <i class="bi bi-chevron-double-right align-self-center"></i>
                </div>
            </div>

            <div id="userShoppingWrapper" class="post-div over-cursor border-radius-a d-flex container-fluid justify-content-around mx-1 p-1 text-center">
                <div :class="`m-0 p-0 d-flex ${store.getters.GET_BROWSER_SIZE <= 500? 'fspll': ''}`">
                    <i id="shopIcon" class="bi bi-cart4 align-self-center is-have-fase-transition"></i>
                </div>
                <div class="m-0 p-0 align-self-center" v-if="store.getters.GET_BROWSER_SIZE > 500">
                    쇼핑
                </div>
                <div class="m-0 p-0 d-flex" v-if="store.getters.GET_BROWSER_SIZE > 500">
                    <i class="bi bi-chevron-double-right align-self-center"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'

export default {
    name:'UserPostBoxVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            

        });

        const methods = {
            operWriteForm: ()=>{
                store.commit("CHANGE_FOREGROUND_COMPONENT", {name:'WriteFormVue'});
                store.commit("OPEN_FOREGROUND");
            }
        };

        onMounted(()=>{

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

#userPostBoxRootWrapper{
    padding: 0 16px 0 16px;
}

#postInformationText{
    padding: 0 4px 0 4px;
}

#userPostWriteWrapper, #downloadGameWrapper, #userShoppingWrapper{
    background-color: rgb(242, 242, 242);
}

#userPostWriteWrapper:hover{
    background-color: rgb(5, 250, 156);
}

#downloadGameWrapper:hover{
    background-color: rgb(255, 255, 0);
}

#userShoppingWrapper:hover{
    background-color: rgb(255, 51, 51);
}

.post-div{
    margin: 8px 0 0 0;
    transition: all 0.15s ease;
}

i{
    margin: 2px 0 0 0;
}
</style>
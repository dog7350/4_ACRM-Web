<template>
    <div id="GoodsManageListRootWrapper" class="container-fluid d-flex flex-wrap m-0 p-0 d-flex flex-column justify-content-around">
        <div class="container-fluid d-flex flex-wrap justify-content-center text-center">
            <div class="fspll font-bold">
                <!-- 관리창 -->
            </div>
        </div>
        <div class="container-fluid d-flex flex-wrap justify-content-around text-center py-2">
            <!-- <div @click="methods.changeStat(0)"
            class="w-25 over-cursor btn btn-primary">
                굿즈 보기
            </div> -->

            <!-- <div @click="methods.changeStat(1)"
            class="w-25 over-cursor btn btn-danger">
                내 이슈
            </div> -->

            <!-- <div @click="methods.changeStat(2)"
            class="w-25 over-cursor btn btn-success">
                구매내역
            </div> -->

            <div @click="()=>{store.commit('OPEN_FOREGROUND', {name: 'RegistGoodsFormVue'});}"
            class="w-100 over-cursor btn btn-primary">
                상품 올리기
            </div>
        </div>
        <div id="manageDetail" class="container-fluid d-flex flex-wrap justify-content-center text-center">
            <transition name="normal-fade" mode="out-in">
                
            </transition>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import axios from 'axios';



export default {
    name: "GoodsManageList",
    components: {

    },
    props: {
        
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            currentStat: 0,
        });

        const methods = {
            changeStat: (stat)=>{
                // params.value.currentStat = stat;
                store.state.currentShopStat = stat;
            },
            startSearch: ()=>{
                context.emit("CALLSEARCH", {});
            }
        };

        watch(()=>store.getters.GET_IS_LOGIN, (a, b)=>{

        });

        onMounted(()=>{

        });

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

@media screen and (min-width: 1000px) {
    #gunInfoWrapper:hover{
        background-color: rgba(255, 255, 255, 0.3);
    }
}

#isHaveIt{
    color: rgb(71, 131, 241);
}

.none{
    color:white;
}

.on{
    color: rgb(71, 131, 241);
}


.w-30{
    width: 30%;
}
</style>
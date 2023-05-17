<template>
    <div id="GoodsMainPareRootWrapper" class="container-fluid m-0 p-0 d-flex flex-column justify-content-around test-border">
        <div id="myGoodsList" class="container-fluid m-0 p-0">
            <transition name="fast-fade" mode="out-in">
                <GoodsManageList :CALLSEARCH="methods.callSearch"/>
            </transition>
        </div>
        <div id="goodsListWrapper" class="container-fluid m-0 p-0">
            <transition name="fast-fade" mode="out-in">
                <GoodsList :REGISTSEARCH="methods.registSearch" v-if="store.state.currentShopStat === 0" />
            </transition>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import axios from 'axios';

import GoodsList from './parts/mainGoodsPart/GoodsList.vue';
import GoodsManageList from './parts/GoodsManageList.vue';

export default {
    name: "GoodsMainPage",
    components: {
        GoodsList, GoodsManageList, 
    },
    props: {

    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({

        });

        const methods = {
            callSearch: (payload)=>{
                methods.searchMethod(payload);
            },
            registSearch: (payload)=>{
                methods.searchMethod = payload.method;
            },
            searchMethod: null,
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
<template>
    <div id="threeWayStreetWrapper" class="container-fluid d-flex flex-wrap justify-content-center align-content-center white-font text-center">
        <div class="container-fluid d-flex justify-content-center align-content-center text-center fsplll font-bold pt-5">
            다양한 사이트에 접근해보세요!
        </div>
        <div v-if="store.getters.GET_BROWSER_SIZE > 1200"
        id="threeWayStreetContact" class="d-flex flex-wrap justify-content-around align-content-center">
            <three-way-part-vue :contents="{index: 0, title: '자료실', content: '자료실 가기', routeUrl: '/main/storage'}"/>

            <transition name="fast-fade" mode="out-in">
                <three-way-part-vue v-if="store.getters.GET_IS_LOGIN" :contents="{index: 1, title: '상점', content: '상점 가기', routeUrl: '/main/shop'}"/>
            </transition>

            
            <three-way-part-vue :contents="{index: 2, title: '커뮤니티', content: '커뮤니티 가기', routeUrl: '/main/community'}"/>

            <transition name="fast-fade" mode="out-in">
                <three-way-part-vue v-if="store.getters.GET_IS_LOGIN" :contents="{index: 3, title: '관리자 페이지', content: '관리하러 가기', routeUrl: '/main/admin'}"/>
            </transition>
        </div>
        <div v-else
        id="threeWayStreetContact" class="d-flex flex-column justify-content-center align-content-around">
            <div class="container-fluid d-flex justify-content-around">
                <three-way-part-vue :contents="{index: 0, title: '자료실', content: '0번 내용입니다.', routeUrl: '/main/storage'}"/>

                <transition name="fast-fade" mode="out-in">
                    <three-way-part-vue v-if="store.getters.GET_IS_LOGIN" :contents="{index: 1, title: '상점', content: '1번 내용입니다.', routeUrl: '/main/shop'}"/>
                </transition>
            </div>

            <div class="container-fluid d-flex justify-content-around">
                <three-way-part-vue :contents="{index: 2, title: '커뮤니티', content: '2번 내용입니다.', routeUrl: '/main/community'}"/>

                <transition name="fast-fade" mode="out-in">
                    <three-way-part-vue v-if="store.getters.GET_IS_LOGIN" :contents="{index: 3, title: '관리자 페이지', content: '3번 내용입니다.', routeUrl: '/main/admin'}"/>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';
import ThreeWayPartVue from '../etc/ThreeWayPartVue.vue';

export default {
  components: { ThreeWayPartVue },
    name:'ThreeWayStreetVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({

        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
            },
        };

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

#threeWayStreetWrapper{
    width: 100vw;
    height: 60vh;
    min-height: 60vh;
    background-image: 
    linear-gradient(to top, rgba(0,0,1) 10%, rgba(0,0,0,0.7) 30%,rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.7) 90%, black), 
    url('../../../../public/images/introduces/threeWaies/threeWay3.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    margin-top: 10vh;
}

#threeWayStreetContact{
    width: 80%;
    height: 100%;
}

@media screen and (max-width: 1200px){
    #threeWayStreetWrapper{
        width: 100vw;
        height: 90vh;
        min-height: 60vh;
        background-image: 
        linear-gradient(to top, rgba(0,0,1) 20%, rgba(0,0,0,0.7) 40%,rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.7) 80%, black), 
        url('../../../../public/images/introduces/threeWaies/threeWay3.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        margin-top: 10vh;
    }

    #threeWayStreetContact{
        width: 100%;
        height: 100%;
    }
}



</style>




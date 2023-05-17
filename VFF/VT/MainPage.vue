<template>
    <div class="container-fluid d-flex flex-column justify-content-center p-0">
        <div id="BackGroundContainer" class="container-fluid d-flex justify-content-center align-items-center">
            <video id="BackGroundPlayer" src="/videos/testVideo.mp4" autoplay muted loop></video>
    
            <div id="CelluloidPane" class="d-flex justify-content-center align-items-center">
                <div class="d-flex justify-content-center align-items-center mx-auto" style="position: absolute; top: 40%; width: 35%; min-width: 300px; height: 20%;">
                    <img src="images/testLogo.png" style="width:100%; height:auto;">
                </div>
                <div class="font-size-small d-flex justify-content-center align-items-center mx-auto white-font" style="position: absolute; top: 60%; width: 70%; height: 10%;">
                    Lorem, ipsum dolor sit amet consectetur
                </div>
                <div 
                class="font-size-basic d-flex justify-content-center align-items-center mx-auto over-cursor" style="position: absolute; top: 70%; background-color: rgba(255, 255, 0, 0.5); width: 30%; height: 15%;">
                    자료실
                </div>
            </div>
        </div>

        <div id="gunContent" class="container-fluid d-flex flex-column justify-content-center align-items-center white-font">
            <div class="container-fluid d-flex justify-content-center align-items-center">
                <span class="font-size-basic">무기소개 시작</span>
            </div>
            <slide-vue :extName="'.jpg'" :imgFolderSrc="'/images/guns/'" :imgName="'gun'" :urlName="'/info/another/gun'"></slide-vue>
            <div class="container-fluid d-flex justify-content-center align-items-center">
                <span class="font-size-basic">무기소개 끝</span>
            </div>
        </div>
        
        <div class="container-fluid d-flex flex-column">
            <a @click.prevent="methods.routeURL('/ma')"><h1> 길잃기 </h1></a>
            <a @click.prevent="methods.changeNav"><h1> 내비게이션 바꾸기 </h1></a>
            <a @click.prevent="methods.routeURL('/main/item')"><h1> 아이템 컴포넌트 슬라이드 보러가기 </h1></a>
            <a @click.prevent="methods.routeURL('/main/track')"><h1> 트랙 컴포넌트 슬라이드 보러가기 </h1></a>
            <a @click.prevent="methods.routeURL('/main/gun')"><h1> 무기 컴포넌트 슬라이드 보러가기 </h1></a>
            <a @click.prevent="methods.routeURL('/main/testcommunity')"><h1> 테스트 커뮤니티 </h1></a>
            <transition name="admin-page-fade" mode="out-in">
                <a @click.prevent="methods.writeContent" v-if="store.getters.GET_IS_LOGIN"><h1> 글써서 서버로 보내기 </h1></a>
            </transition>

            <transition name="admin-page-fade" mode="out-in">
                <a @click.prevent="store.commit('OPEN_FOREGROUND', {name: 'WriteCommentFormVue'})" v-if="store.getters.GET_IS_LOGIN"><h1> 댓글써서 서버로 보내기 </h1></a>
            </transition>

            <a @click.prevent="methods.routeURL('/main/community')"><h1> 커뮤니티 가기 </h1></a>

            <transition name="admin-page-fade" mode="out-in">
                <a @click.prevent="methods.routeURL('/main/admin')" v-if="store.getters.GET_AUTH === 'o'"><h1> 관리자 페이지 가기 </h1></a>
            </transition>

            <transition name="admin-page-fade" mode="out-in">
                <a @click.prevent="methods.routeURL('/main/modify')" v-if="store.getters.GET_IS_LOGIN"><h1> 정보수정 페이지 가기 </h1></a>
            </transition>

            <transition name="admin-page-fade" mode="out-in">
                <a @click.prevent="store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'})" v-if="store.getters.GET_IS_LOGIN"><h1> 내정보 </h1></a>
            </transition>

            <a @click.prevent="methods.alertMsg"><h1> 경고창 띄우기 </h1></a>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../VXS/VuexStore'
import AXIOS from 'axios';
import AdminFormVue from './vueComponent/AdminFormVue.vue';
import SlideVue from './vueComponent/SlideVue.vue';

export default {
  components: { AdminFormVue, SlideVue },
    name:'MainPageVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        

        const params = ref({
            index: 0
        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
            },
            alertMsg: ()=>{
                store.commit('CREATE_ALERT', {msg:'hello world', time: 3, type:"primary"});
            },
            myInfo: ()=>{
                
            },
            changeNav: ()=>{
                store.state.isPopupNavigation = !store.state.isPopupNavigation;
            },
            writeContent: ()=>{
                store.commit("CHANGE_FOREGROUND_COMPONENT", {name:'WriteFormVue'});
                store.commit("OPEN_FOREGROUND");
            },
        }

        onMounted(()=>{
            // store.commit('REMOVE_LOADING');
        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>
a{
    background-color: white;
    color:black;
    margin-bottom: 10px;
    text-decoration: none;
}

.admin-page-fade-leave-to{
    transform: translateX(30px);
    opacity: 0;
}

.admin-page-fade-enter-from{
    transform: translateX(-30px);
    opacity: 0;
}

.admin-page-fade-enter-active,
.admin-page-fade-leave-active{
    transition: all 0.5s ease;
}
</style>
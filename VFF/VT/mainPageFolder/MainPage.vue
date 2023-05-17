<template>
    <div class="container-fluid d-flex flex-column justify-content-center p-0">
        <community-bannver-vue></community-bannver-vue>

        <main-navigation-vue></main-navigation-vue>

        <video-vue></video-vue>

        <game-introduce-vue></game-introduce-vue>

        <three-way-street-vue></three-way-street-vue>

        <car-introduce-vue></car-introduce-vue>

        <weapon-introduce-vue></weapon-introduce-vue>

        <item-introduce-vue></item-introduce-vue>

        <track-introduce-vue></track-introduce-vue>

        <footer-vue></footer-vue>
        
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import SlideVue from './../vueComponent/SlideVue.vue';
import MainNavigationVue from './header/MainNavigationVue.vue';
import CommunityBannverVue from './header/CommunityBannverVue.vue';
import VideoVue from './videoParts/VideoVue.vue';
import GameIntroduceVue from './bodyParts/GameIntroduceVue.vue';
import CarIntroduceVue from './bodyParts/CarIntroduceVue.vue';
import TrackIntroduceVue from './bodyParts/TrackIntroduceVue.vue';
import WeaponIntroduceVue from './bodyParts/WeaponIntroduceVue';
import ItemIntroduceVue from './bodyParts/ItemIntroduceVue';
import ThreeWayStreetVue from './bodyParts/ThreeWayStreetVue.vue';
import FooterVue from './bodyParts/FooterVue.vue';

function getCookie(cName) {
      cName = cName + '=';
      var cookieData = document.cookie;
      var start = cookieData.indexOf(cName);
      var cValue = '';
      if(start != -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
      }
      return unescape(cValue);
}

function deleteCookie(name) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
}

export default {
    components: { CommunityBannverVue, MainNavigationVue, SlideVue, VideoVue, GameIntroduceVue, CarIntroduceVue, TrackIntroduceVue, WeaponIntroduceVue, ItemIntroduceVue, ThreeWayStreetVue, FooterVue},
    name:'MainPage',
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
            scrollTop: ()=>{
                $('body').scrollTop(0);
            },
        }

        onMounted(()=>{
            if(store.getters.GET_IS_MOBILE){
                let data = getCookie('mobilePurchase');
                

                if(data){
                    deleteCookie('mobilePurchase');
                    // store.commit('CREATE_ALERT', {msg: data, time: 3, type:"primary"});
                    methods.routeURL(data);
                    store.commit('CREATE_LOADING');
                }   
            }
            
            if(route.fullPath.indexOf('?rrs') !== -1){
                store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'});
                router.push('/main');
            } else if(route.fullPath.indexOf('?rps') !== -1){
                store.commit('OPEN_FOREGROUND', {name: 'RegistVue'});
                router.push('/main');
            } else if(route.fullPath.indexOf('?ips') !== -1){
                store.commit('OPEN_FOREGROUND', {name: 'CashChargeVue'});
                router.push('/main');
            } else if(route.fullPath.indexOf('?fid') !== -1){
                store.commit('OPEN_FOREGROUND', {name: 'FindIdVue'});
                router.push('/main');
            } else if(route.fullPath.indexOf('?fpw') !== -1){
                store.commit('OPEN_FOREGROUND', {name: 'FindPwVue'});
                router.push('/main');
            } else if(route.fullPath.indexOf('isBuying') !== -1){
                methods.routeURL(`/main/shop?isBuying&gn=${route.query['gn']}&vl=${route.query['vl']}&adr=${route.query['adr']}`);
                store.commit('CREATE_LOADING');
            }
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

#scrollTopButton{
    position: fixed;
    padding: 1vmin;
    right: 20px;
    bottom: 20px;
    z-index: 6;
    background-color: rgba(255, 255, 255, 0.5);
}
</style>
<template>
    <div id="BackGroundContainer" class="container-fluid d-flex justify-content-center align-items-center">
        <video id="BackGroundPlayer" src="/videos/testVideo2.mp4" autoplay muted loop></video>

        <div id="CelluloidPane" class="d-flex justify-content-center align-items-center">
            <div id="mainLogoBox" class="d-flex justify-content-center align-items-center mx-auto">
                <img src="/images/logos/segaLogo.png" style="width:100%; height:auto;">
            </div>

            <div  v-if="store.getters.GET_BROWSER_SIZE > 1000"
            class="d-flex justify-content-center align-items-center mx-auto" 
            style="position: absolute; top: 55%; width: 70%; height: 10%; fontSize:70px;">
                <i @click="methods.openGameTrailer"
                id="youtubePlayerIcon" class="bi bi-play-fill over-cursor is-have-plain-transition"></i>
            </div>

            <div id="downloadLinkBox" class="fspl d-flex justify-content-around align-items-center mx-auto black-font">
                <div @click="methods.openWindow('https://store.steampowered.com/')"  
                class="logobox over-cursor mt-3 p-1 border-radius-c d-flex justify-content-center is-have-plain-transition" 
                :style="`min-width:${store.getters.GET_BROWSER_SIZE > 1000? '150px': '0px'};`">
                    <div class="d-flex">
                        <img src="/images/logos/steam1.png" class="align-self-center" style="width:30px; height:auto;">
                    </div>
                    <div class="align-self-center logo-text" style="font-family: 'gojungame';" v-if="store.getters.GET_BROWSER_SIZE > 1000">
                        Steam
                    </div>
                </div>

                <div @click="methods.openWindow('https://play.google.com/store/games')"
                class="logobox over-cursor mt-3 p-1 border-radius-c d-flex justify-content-center is-have-plain-transition"
                :style="`min-width:${store.getters.GET_BROWSER_SIZE > 1000? '150px': '0px'};`">
                    <div class="d-flex">
                        <img src="/images/logos/google2.png" class="align-self-center" style="width:30px; height:auto;">
                    </div>
                    <div class="align-self-center logo-text" style="font-family: 'gojungame';" v-if="store.getters.GET_BROWSER_SIZE > 1000">
                        Google
                    </div>
                </div>

                <div 
                @click="methods.routeURL('/main/storage')"
                class="logobox over-cursor mt-3 p-1 border-radius-c d-flex justify-content-center is-have-plain-transition over-cursor"
                :style="`min-width:${store.getters.GET_BROWSER_SIZE > 1000? '150px': '0px'};`">
                    <div class="d-flex justify-content-center">
                        <i id="downloadIcon" class="bi bi-device-ssd-fill align-self-center" style="fontSize: 30px; height:auto;"></i>
                    </div>
                    <div class="align-self-center logo-text" style="font-family: 'gojungame';" v-if="store.getters.GET_BROWSER_SIZE > 1000">
                        자료실
                    </div>
                </div>
                
            </div>

            <div @click="methods.downScroll"
            id="underBoxButtonWrapper" class="is-have-plain-transition over-cursor">
                <div id="scrollIcon">
                    <i class="bi bi-capslock"></i>
                </div>
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

export default {
    name:'VideoVue',
    setup(props, context) {
        const store = Store;
        const router = useRouter();

        const params = ref({
            isVisible: true,
        });

        const methods = {
            openGameTrailer: ()=>{
                store.commit('CHANGE_VIDEO', '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/loaZ9t96J7w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
                store.commit('OPEN_FOREGROUND', {name: 'YoutubePlayerVue'});
            },
            downScroll: ()=>{
                
                window.scrollTo(0, store.getters.GET_IS_MOBILE?window.innerHeight :window.innerHeight-90);
            },
            openWindow: (url)=>{
                window.open(url);
            },
            routeURL: (url)=>{
                router.push(url);
            }
        };

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

#scrollIcon{
    transform: rotate(0.5turn);
}

#underBoxButtonWrapper{
    position: absolute;
    bottom: 5%;
    color: rgba(255, 255, 255, 0.514);
    font-size: 50px;
    animation: upNdown 4s infinite ease ;
}

#underBoxButtonWrapper:hover{
    color: rgba(255, 255, 255, 1);
    text-shadow: 0px 0px 3px white;
}

@keyframes upNdown {
    0%{
        transform: translateY(6px);
    }
    50%{
        transform: translateY(-6px);
    }
    100%{
        transform: translateY(6px);
    }
}

#underBoxButtonWrapper::before{
    position: absolute;
    content: 'Scroll';
    width: 100%;
    font-size: 0.3em;
    top: -25px;
    text-align: center;
}

#youtubePlayerIcon{
    text-shadow: 0 0 20px red;
    color: white;
}

#youtubePlayerIcon:hover{
    color: red;
}

.logobox{
    width: 20%;
    height: auto;
    background-color: white;
    box-shadow: 0px 0px 2px white;
}

.logobox:hover{
    box-shadow: 0px 0px 7px rgb(255, 51, 51);
}

.logo-text{
    margin-left: 10px;
    text-shadow: 0px 0px 1px black;
    text-align: center;
}

#BackGroundPlayer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    min-width: 100vw;
    height: 100vh;

    z-index: 10;
    object-fit: cover;
}

#BackGroundContainer{
    position: relative;
    top: 0;
    left: 0;
    width: 100vw;
    min-width: 100vw;
    height: 100vh;
}

#CelluloidPane{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    min-width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.35);
    z-index: 15;
}


@media screen and (max-width: 1100px){
    #downloadLinkBox{
        position: absolute;
        top: 70%;
        background-color: transparent;
        width: 60vw;
        height: 70px;
    }

    #mainLogoBox{
        position: absolute;
        top: 30%;
        width: 40vw;
        min-width: 300px;
        height: 20%;
    }
}

@media screen and (min-width: 1000px){
    #downloadLinkBox{
        position: absolute;
        top: 70%;
        background-color: transparent;
        width: 60vw;
        height: 70px;
    }

    #mainLogoBox{
        position: absolute;
        top: 30%;
        width: 40vw;
        min-width: 300px;
        height: 20%;
    }
}

</style>




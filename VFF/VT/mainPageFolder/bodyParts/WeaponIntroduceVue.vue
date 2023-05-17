<template>
    <div id="weaponIntroduceWrapper" class="container-fluid d-flex flex-wrap justify-content-center align-content-around white-font">
        <div class="container-fluid d-flex flex-column justify-content-center align-items-center">
            <div class="fspll font-bold">Accro Memories</div>
            <span class="fsplll font-bold">무기소개</span>
        </div>

        <div id="weaponIntroWrapper" class="container-fluid d-flex flex-column justify-content-center align-items-center text-center">
            <div class="fspm">Accro Memories의 다양한 무기를 확인하세요</div>
        </div>

        <div v-if="store.getters.GET_BROWSER_SIZE > 1000"
        id="weaponIntroduceText" class="container-fluid d-flex justify-content-center align-content-center text-center">
            <div id="videoWrapperWrapper" class="d-flex flex-wrap justify-content-center align-content-center is-have-plain-transition">
                <div id="videoWrapperWrapperReverse" class="is-have-plain-transition">

                </div>
                <div id="videoWrapper" class="d-flex flex-wrap justify-content-center align-content-center">
                    <div :id="`videoC${0}`" :class="`visibleVideo beforeVideo d-flex justify-content-center`">
                        <video class="video-class align-self-center" src="/videos/gun0.mp4" autoplay muted loop></video>
                    </div>

                    <div :id="`videoC${1}`" :class="`d-flex justify-content-center`">
                        <video class="video-class1 align-self-center" src="/videos/gun1.mp4" muted loop></video>
                    </div>

                    <div :id="`videoC${2}`" :class="`d-flex justify-content-center`">
                        <video class="video-class align-self-center" src="/videos/gun2.mp4" muted loop></video>
                    </div>

                    <div :id="`videoC${3}`" :class="`d-flex justify-content-center`">
                        <video class="video-class1 align-self-center" src="/videos/gun3.mp4" muted loop></video>
                    </div>
                    
                </div>
            </div>
        </div>
        <div v-else class="container-fluid d-flex justify-content-center align-content-center text-center">
            <div class="d-flex flex-wrap justify-content-center align-content-center is-have-plain-transition">
                <div id="videoWrapper" class="d-flex flex-wrap justify-content-center align-content-center">
                    <div :id="`videoC${0}`" :class="`visibleVideo beforeVideo d-flex justify-content-center`">
                        <video class="video-class align-self-center" src="/videos/gun0.mp4" autoplay muted loop></video>
                    </div>

                    <div :id="`videoC${1}`" :class="`d-flex justify-content-center`">
                        <video class="video-class1 align-self-center" src="/videos/gun1.mp4" autoplay muted loop></video>
                    </div>

                    <div :id="`videoC${2}`" :class="`d-flex justify-content-center`">
                        <video class="video-class align-self-center" src="/videos/gun2.mp4" autoplay muted loop></video>
                    </div>

                    <div :id="`videoC${3}`" :class="`d-flex justify-content-center`">
                        <video class="video-class1 align-self-center" src="/videos/gun3.mp4" autoplay muted loop></video>
                    </div>
                    
                </div>
            </div>
        </div>


        <div class="container-fluid d-flex flex-column justify-content-around p-0">
            <weapon-slide-vue
            @ITEMCLICK="methods.itemClickEmit"
            :urlName="'/info/another/gun'" :currentVideo="params.currentVideo" 
            :extName="'.jpg'" :imgFolderSrc="'/images/guns/'" :imgName="'gun'"
            ></weapon-slide-vue>

        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUpdated, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';
import SlideVue from '../../vueComponent/SlideVue.vue';
import WeaponSlideVue from '../etc/WeaponSlideVue.vue';

export default {
    components: { SlideVue, WeaponSlideVue },
    name:'WeaponIntroduceVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        let intervals = null;

        const params = ref({
            ndnllkvcnzlan: false,
            currentVideo: 0,
            beforeId: 'videoC0',
            changeOver: true, pauseSelector: null,
        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
            },
            changeView: (index)=>{
                if(params.value.changeOver){
                    let number = index;
                    let id = `videoC${number}`;
                    if($(`.visibleVideo`).attr("id") !== id){
                        if(params.value.pauseSelector){
                            params.value.pauseSelector.get(0).pause();
                        }

                        params.value.changeOver = false;
                        $(`#${params.value.beforeId}`).removeClass("beforeVideo");

                        $(`.visibleVideo`).addClass("beforeVideo");
                        params.value.beforeId = $(`.visibleVideo`).attr("id");
                        $(`.visibleVideo`).removeClass("visibleVideo");

                        if(store.getters.GET_BROWSER_SIZE <= 1000)
                            $(`#${params.value.beforeId}`).children('video').get(0).pause();

                        params.value.pauseSelector = $(`#${params.value.beforeId}`).children('video');

                        $(`#${id}`).css("transition", "");
                        $(`#${id}`).addClass("invisibleVideo");

                        setTimeout(()=>{
                            $(`#${id}`).css("transition", "all 1s ease");
                            $(`#${id}`).addClass("visibleVideo");
                            $(`#${id}`).removeClass("invisibleVideo");

                            $(`#${id}`).children('video').get(0).play();

                            params.value.changeOver = true;
                            params.value.currentVideo = number;
                        }, 100);
                    }
                }
            },
            itemClickEmit: (payload)=>{
                methods.changeView(payload);
            }
        };

        onMounted(()=>{
            if(store.getters.GET_BROWSER_SIZE > 1000){
                intervals = setInterval(()=>{
                    params.value.ndnllkvcnzlan = !params.value.ndnllkvcnzlan;
                    var rotater1 = document.getElementById('videoWrapperWrapper');
                    var rotater2 = document.getElementById('videoWrapperWrapperReverse');

                    if(rotater1)
                        if(params.value.ndnllkvcnzlan){
                            rotater1.style.setProperty('border-left', '1px orange solid');
                        } else{
                            rotater1.style.setProperty('border-left', '1px transparent solid');
                        }

                    if(rotater2)
                        if(params.value.ndnllkvcnzlan){
                            rotater2.style.setProperty('border-right', '1px orange solid');
                        } else{
                            rotater2.style.setProperty('border-right', '1px transparent solid');
                        }
                }, 1500);
            }
        });

        onUpdated(()=>{
            if(store.getters.GET_BROWSER_SIZE > 1000 && !intervals){
                intervals = setInterval(()=>{
                    params.value.ndnllkvcnzlan = !params.value.ndnllkvcnzlan;
                    var rotater1 = document.getElementById('videoWrapperWrapper');
                    var rotater2 = document.getElementById('videoWrapperWrapperReverse');

                    if(rotater1)
                        if(params.value.ndnllkvcnzlan){
                            rotater1.style.setProperty('border-left', '1px orange solid');
                        } else{
                            rotater1.style.setProperty('border-left', '1px transparent solid');
                        }

                    if(rotater2)
                        if(params.value.ndnllkvcnzlan){
                            rotater2.style.setProperty('border-right', '1px orange solid');
                        } else{
                            rotater2.style.setProperty('border-right', '1px transparent solid');
                        }
                }, 1500);
            }
        });

        onUnmounted(()=>{
            if(intervals) clearInterval(intervals);
        });

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

#weaponIntroduceWrapper{
    width: 100vw;
    height: auto;
    min-height: 100vh;
    background-image: 
    linear-gradient(to top, rgba(0,0,1) 20%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.7) 90%, black), 
    url('../../../../public/images/introduces/gunIntro (2).jpg');
    
    background-repeat: round;
    background-size: cover;
    /* background-color: rgb(59, 59, 59); */
    padding-left: 0;
    padding-right: 0;
    margin-top: 10vh;
}


#videoWrapper{
    position: relative;
    border: 1px solid;
    overflow: hidden;
    border-radius: 50%;
    width: 35vw;
    height: 35vw;
    max-width: 500px;
    max-height: 500px;

    animation: turn 12s infinite linear reverse;
}

#videoWrapperWrapper{
    position: relative;
    width: 38vw;
    height: 38vw;
    max-width: 550px;
    max-height: 550px;
    border-radius: 50%;
    /* background-image: url('../../../../public/images/dash.png'); */
    background-repeat: repeat-x;
    background-position: top;
    background-size: 10px 10px;
    border: 1px transparent solid;
    transition: border 2s ease;
    animation: turn 12s infinite linear;
}

#videoWrapperWrapperReverse{
    position: absolute;
    width: 38vw;
    height: 38vw;
    max-width: 550px;
    max-height: 550px;
    border-radius: 50%;
    /* background-image: url('../../../../public/images/dash.png'); */
    background-repeat: repeat-x;
    background-position: bottom;
    border: 1px transparent solid;
    transition: border 2s ease;
    background-size: 10px 10px;
}

@keyframes turn {
    from{
        transform: rotate(0);
    }
    to{
        transform: rotate(1turn);
    }
}

#videoWrapper>div{
    overflow: hidden;
    position: absolute;
    width: inherit;
    height: inherit;
    max-width: 510px;
    max-height: 510px;
    transform: rotate(45deg);
    transition: all 0.5s ease;
}

@media screen and (max-width: 1000px) {
    #videoWrapper>div{
        min-width: 250px;
        min-height: 250px;
    }
    #videoWrapper{
        animation: none;
        min-width: 250px;
        min-height: 250px;
    }
}

video{
    position: relative;
    top: 0px;
    left: 0px;
    width: 140%;
    height: 140%;
    max-width: 629px;
    max-height: 629px;
    object-fit: cover;
    transform: rotate(-45deg);
    z-index: 2;
}

.invisible{
    opacity: 0;
}

.visibleVideo{
    top: 0px;
    left: 0px;
    z-index: 5;
}

.visibleVideo>video{
    top: 0px;
    left: 0px;
}

.invisibleVideo{
    top:100%;
    left:-100%;
    z-index: 4;
}

.beforeVideo{
    z-index: 3;
}

</style>




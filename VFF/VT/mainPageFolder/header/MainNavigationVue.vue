<template>
    <div id="MainHeaderWrapper" class="is-top-sticky white-font">
        <div id="mainHeader" v-if="store.getters.GET_BROWSER_SIZE > 1000"
        :class="`d-flex justify-content-${store.getters.GET_BROWSER_SIZE > 700? 'around': 'between'}`" :style="`margin: 0 10vw;`">
            <div id="community-header-logo-wrapper" :style="`margin:0 1vmin;`" class="align-self-center text-center justify-content-center">
                <img width="150" id="" class="over-cursor" @click="methods.routeURL('/main')" src="/images/logos/segaLogo.png" alt="">
            </div>
            
            <div v-if="store.getters.GET_BROWSER_SIZE > 700" id="itemWrapper" class="container-fluid justify-content-around align-self-center d-flex">
                <div id="gameIntroduceLink" @click="methods.scrollHere('gameIntroduceWrapper')"
                :class="`${params.currentBottom === 0? 'is-selected': ''} text-center is-have-plain-transition menu-item over-cursor fspm font-bold`">
                    게임소개
                </div>

                <div id="carIntroduceLink" @click="methods.scrollHere('carIntroduceWrapper')"
                :class="`${params.currentBottom === 1? 'is-selected': ''} text-center is-have-plain-transition menu-item over-cursor fspm font-bold`">
                    자동차
                </div>

                <div id="weaponIntroduceLink" @click="methods.scrollHere('weaponIntroduceWrapper')"
                :class="`${params.currentBottom === 2? 'is-selected': ''} text-center is-have-plain-transition menu-item over-cursor fspm font-bold`">
                    무기
                </div>

                <div id="itemIntroduceLink" @click="methods.scrollHere('itemIntroduceWrapper')"
                :class="`${params.currentBottom === 3? 'is-selected': ''} text-center is-have-plain-transition menu-item over-cursor fspm font-bold`">
                    아이템
                </div>

                <div id="trackIntroduceLink" @click="methods.scrollHere('trackIntroduceWrapper')"
                :class="`${params.currentBottom === 4? 'is-selected': ''} text-center is-have-plain-transition menu-item over-cursor fspm font-bold`">
                    트랙
                </div>
            </div>

            <div id="community-header-right-wrapper" style="margin:0 1vmin;" class="align-self-center text-center justify-content-center">
                <i class="bi bi-person-square over-cursor icon-size-standard over-color-trans-orange responsive-icon" style="fontSize: 5vh;" @click="store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'})"></i>
            </div>
        </div>
        <div v-else @click="methods.openOffset"
        id="mobileNavigation" class="border-radius-b over-cursor">
            <i class="bi bi-justify icon-size-standard"></i>
        </div>

        <transition name="fast-fade" mode="out-in">
        <div id="offsetBackground" @mousedown="methods.click(1)"
        :class="`fspm d-flex is-have-plain-transition`" v-if="store.getters.GET_BROWSER_SIZE <= 1000 && params.offsetVisible">
            <div id="offset" @mousedown="methods.click(2)"
            :class="`d-flex flex-column is-have-plain-transition`" v-if="store.getters.GET_BROWSER_SIZE <= 1000">
                <div id="closeButtonWrapper" class="d-flex justify-content-start">
                    <div
                    id="closeButton" class="over-cursor is-have-plain-transition border-radius-b" @click="methods.closeOffset">
                        <i class="bi bi-justify icon-size-standard"></i>
                    </div>
                </div>


                <div id="community-header-logo-wrapper-mobile" class="d-flex justify-content-center">
                    <img class="over-cursor" @click="methods.routeURL('/main')" src="/images/logos/segaLogo.png" alt="">
                </div>
                
                <div class="d-flex justify-content-center">
                    <div id="gameIntroduceLink" @click="methods.scrollHere('gameIntroduceWrapper')"
                    :class="`${params.currentBottom === 0? 'is-selected-mobile': ''} text-start is-have-plain-transition menu-item over-cursor font-bold mobile-div`">
                        게임소개
                    </div>
                </div>
                
                <div class="d-flex justify-content-center">
                    <div id="carIntroduceLink" @click="methods.scrollHere('carIntroduceWrapper')"
                    :class="`${params.currentBottom === 1? 'is-selected-mobile': ''} text-start is-have-plain-transition menu-item over-cursor font-bold mobile-div`">
                        자동차
                    </div>
                </div>

                <div class="d-flex justify-content-center">
                    <div id="weaponIntroduceLink" @click="methods.scrollHere('weaponIntroduceWrapper')"
                    :class="`${params.currentBottom === 2? 'is-selected-mobile': ''} text-start is-have-plain-transition menu-item over-cursor font-bold mobile-div`">
                        무기
                    </div>
                </div>

                <div class="d-flex justify-content-center">
                    <div id="itemIntroduceLink" @click="methods.scrollHere('itemIntroduceWrapper')"
                    :class="`${params.currentBottom === 3? 'is-selected-mobile': ''} text-start is-have-plain-transition menu-item over-cursor font-bold mobile-div`">
                        아이템
                    </div>
                </div>

                <div class="d-flex justify-content-center">
                    <div id="trackIntroduceLink" @click="methods.scrollHere('trackIntroduceWrapper')"
                    :class="`${params.currentBottom === 4? 'is-selected-mobile': ''} text-start is-have-plain-transition menu-item over-cursor font-bold mobile-div`">
                        트랙
                    </div>
                </div>
                <div class="d-flex justify-content-center seperate-line"></div>

                <div class="d-flex justify-content-center">
                    <div id="trackIntroduceLink" @click="methods.routeURL('/main/community')"
                    :class="`text-start is-have-plain-transition menu-item over-cursor font-bold mobile-div`">
                        커뮤니티
                    </div>
                </div>
            </div>
        </div>
        </transition>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'MainNavigationVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            isVisible: true,
            currentBottom: -1,
            bottomBorderList: [false, false, false, false, false],
            offsetVisible: false, ulBang: false,
        });

        const methods = {
            scrollHere: (id)=>{
                var top = $(`#${id}`);

                if(top){
                    top = top.offset().top;
                    window.scrollTo(0, store.getters.GET_IS_MOBILE || store.getters.GET_BROWSER_SIZE <= 1000? top: top-90);
                }
            },
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
                window.scrollTo(0, 0);
            },
            openOffset: ()=>{
                params.value.offsetVisible = true;
            },
            closeOffset: ()=>{
                params.value.offsetVisible = false;
            },
            click: (i)=>{
                if(i === 2){
                    params.value.ulBang = true;
                } else if(i === 1){
                    if(params.value.ulBang){
                        params.value.ulBang = false;
                    } else{
                        methods.closeOffset();
                    }
                }
            },
        };

        onMounted(()=>{
            window.onscroll = ()=>{
                if(store.getters.GET_IS_MOBILE === false || true){
                    var contentList = [
                        $(`#trackIntroduceWrapper`),
                        $(`#itemIntroduceWrapper`),
                        $(`#weaponIntroduceWrapper`),
                        $(`#carIntroduceWrapper`),
                        $(`#gameIntroduceWrapper`)
                    ]

                    if(contentList[0] && window.scrollY >= contentList[0].offset().top-91){
                        params.value.currentBottom = 4;
                    } else if(contentList[1] && window.scrollY >= contentList[1].offset().top-91){
                        params.value.currentBottom = 3;
                    } else if(contentList[2] && window.scrollY >= contentList[2].offset().top-91){
                        params.value.currentBottom = 2;
                    } else if(contentList[3] && window.scrollY >= contentList[3].offset().top-91){
                        params.value.currentBottom = 1;
                    } else if(contentList[4] && window.scrollY >= contentList[4].offset().top-91){
                        params.value.currentBottom = 0;
                    } else{
                        params.value.currentBottom = -1;
                    }
                } else{
                    params.value.currentBottom = -1;
                }
                
            };
        });

        onUnmounted(()=>{
            window.onscroll = null;
        });

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

.is-top-sticky{
    position: fixed;
    top: 0;
}

.menu-item{
    border-left: solid transparent;
    border-bottom: solid transparent;
}

.is-selected{
    border-bottom: solid white;
}

.is-selected-mobile{
    border-left: solid black;
}

#mainHeader{
    height: 100%;
}

#MainHeaderWrapper{
    box-sizing: content-box;
    width: 100vw;
    height: 90px;
    margin-top: 0;
    margin-bottom: 10px;
    /* padding: 0 10vw; */
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 20;
}

#mobileNavigation{
    position: fixed;
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.7);
    font-size: 60px;
    top: 20px;
    left: 20px
}

#offsetBackground{
    position: fixed;
    width: 100vw;
    height: 100vh;
    padding: 10vh 0 20vh 0;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 34;
}

#offset{
    position: fixed;
    width: 30vw;
    min-width: 200px;
    height: 100vh;
    padding: 10vh 0 20vh 0;
    top: 0;
    left: 0;
    color: black;
    background-color: white;
    z-index: 35;
}

#closeButton{
    position: absolute;
    padding: 5px;
    top: 20px;
    left: 20px;
    z-index: 10;
}

#closeButton:hover{
    background-color: rgba(0, 0, 0, 0.3);
}

.offset-invisible-back{
    transform: translateX(0);
}

.offset-invisible{
    transform: translateX(-100vw);
}

@media screen and (max-width: 1000px){
    .is-under-head-sticky{
        position: sticky;
        top: 87px;
    }

    .responsive-icon{
        font-size: 48.5px;
    }

    #MainHeaderWrapper{
        position: fixed;
        box-sizing: content-box;
        width: 100vw;
        height: 0;
        margin-top: 0;
        margin-bottom: 0;
        /* padding: 0 10vw; */
        background-color: transparent;
        z-index: 35;
    }
}

#community-header-logo-wrapper-mobile{
    height: fit-content;
}

#community-header-logo-wrapper-mobile>img{
    width: 20vw;
    margin-bottom: 5vh;
}

#offset>div{
    margin-top: 2vh;
}

.mobile-div{
    width: 100%;
    margin-left: 1em;
    padding-left: 1em;
}

.seperate-line{
    margin: 2vh;
    border: 1px black solid;
}

</style>




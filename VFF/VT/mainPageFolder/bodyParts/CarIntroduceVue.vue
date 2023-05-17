<template>
    <div id="carIntroduceWrapper" class="container-fluid d-flex flex-wrap justify-content-center align-content-around white-font">
        <div class="container-fluid d-flex flex-column justify-content-center align-items-center">
            <div class="fspll font-bold">Accro Memories</div>
            <span class="fsplll font-bold">차소개</span>
        </div>

        <div id="carIntroWrapper" class="container-fluid d-flex flex-column justify-content-center align-items-center text-center">
            <div class="fspm">Accro Memories의 다양한 차들을 확인하세요</div>
        </div>

        <div class="container-fluid d-flex justify-content-center">
            <div @click="methods.changeSettingNumber(0)"
            :class="`over-cursor m-0 p-0 imgWrapperClass d-flex justify-content-center mx-2 is-have-plain-transition ${params.curretSlideNumber === 0 && params.selectVisible? 'test-border': 'none-border'}`">
                <img class="imgWrapperClass align-self-center" src="/images/cars/car0.png">
            </div>
            
            <div @click="methods.changeSettingNumber(1)"
            :class="`over-cursor m-0 p-0 imgWrapperClass d-flex justify-content-center mx-2 is-have-plain-transition ${params.curretSlideNumber === 1 && params.selectVisible? 'test-border': 'none-border'}`">
                <img class="imgWrapperClass align-self-center" src="/images/cars/car1.png">
            </div>

            <div @click="methods.changeSettingNumber(2)"
            :class="`over-cursor m-0 p-0 imgWrapperClass d-flex justify-content-center mx-2 is-have-plain-transition ${params.curretSlideNumber === 2 && params.selectVisible? 'test-border': 'none-border'}`">
                <img class="imgWrapperClass align-self-center" src="/images/cars/car2.png">
            </div>

            <div @click="methods.changeSettingNumber(3)"
            :class="`over-cursor m-0 p-0 imgWrapperClass d-flex justify-content-center mx-2 is-have-plain-transition ${params.curretSlideNumber === 3 && params.selectVisible? 'test-border': 'none-border'}`">
                <img class="imgWrapperClass align-self-center" src="/images/cars/car3.png">
            </div>
        </div>

        <div id="carIntroduceText" class="container-fluid d-flex justify-content-center align-content-center text-center">
            <div class="d-flex justify-content-center">
                <slide-vue @CURRENTSLIDENUMBER="methods.currentNumberPrint" class="align-self-center"
                :settingNumber="params.settingNumber"
                :videoLink="params.slideNumberVideo"
                :unique="'car'" 
                :hideSelector="true" :minHeight="300" :minWidth="400" :useButtonValue="0"
                :extName="'.png'"
                :imgFolderSrc="'/images/cars/'"
                :imgName="'car'"
                :urlName="'/info/another/car'">
                </slide-vue>
            </div>
            <div id="carPlayer" class="d-flex justify-content-center"
            v-if="store.getters.GET_BROWSER_SIZE > 1400">
                <transition name="fast-fade" mode="out-in" @after-leave="methods.leaveEnd">
                    <div id="iframeCover"
                        v-if="!params.changePlayer"
                        v-html="`${params.curretSlideNumber!=-1?params.slideNumberVideo[params.curretSlideNumber]:''}`">
                    </div>
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
import SlideVue from '../../vueComponent/SlideVue.vue';

export default {
    components: { SlideVue },
    name:'CarIntroduceVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            curretSlideNumber: 2,
            slideNumberVideo: [
                '<iframe width="600px" height="100%" src="https://www.youtube.com/embed/kkEba0dxAHg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                '<iframe width="600px" height="100%" src="https://www.youtube.com/embed/QuftAV1S1fs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                '<iframe width="600px" height="100%" src="https://www.youtube.com/embed/Qa8F26Fs9eE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                '<iframe width="600px" height="100%" src="https://www.youtube.com/embed/ERreUa3scBI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
            ],
            changePlayer: false,
            settingNumber: 0,
            selectVisible: true,
        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
            },
            currentNumberPrint: (crnum)=>{
                params.value.curretSlideNumber = crnum;
                params.value.selectVisible = true;

                if(!store.getters.GET_IS_MOBILE && store.getters.GET_BROWSER_SIZE > 1400)
                    params.value.changePlayer = true;
            },
            leaveEnd: ()=>{
                params.value.changePlayer = false;
            },
            changeSettingNumber: (number)=>{
                if(params.value.selectVisible){
                    params.value.selectVisible = false;
                    params.value.settingNumber = number;
                } 
            }
        };

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

#carIntroduceWrapper{
    width: 100vw;
    height: 100vh;
    background-image: 
    linear-gradient(to top, rgba(0,0,1) 20%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.7) 90%, black), 
    url('../../../../public/images/introduces/garage.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    margin-top: 10vh;
}

#carPlayer{
    width: auto;
    min-width: 560px;
    min-height: 315px;
}


#carIntroduceText{
    height: 40%;
    padding-bottom: 5vh;
}

.imgWrapperClass{
    width: 100px;
    height: auto;
    padding: 0.5em;
}

.none-border{
    border: 1px solid transparent;
}

@media screen and (max-width: 1000px) {
   .imgWrapperClass{
        width: 70px;
        height: auto;
        padding: 0.5em;
    } 
}

</style>




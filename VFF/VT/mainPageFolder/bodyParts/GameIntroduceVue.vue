<template>
    <div id="gameIntroduceWrapper" class="container-fluid d-flex flex-wrap justify-content-center align-content-around white-font text-center">

        <!-- <div class="container-fluid d-flex flex-column justify-content-center align-items-center mt-5 mb-4">
            <div class="fspll font-bold">Accro Memories</div>
            <span class="fsplll font-bold">게임소개</span>
        </div> -->

        <div id="thisGameIsWhatWrapper" class="container-fluid d-flex flex-column text-center">
            <div class="fsplll font-bold"><span>WHAT A DAY,</span> <span class="font-red">WHAT A LOVELY DAY.</span></div>
            <br>

            <div class="fspms font-bold">
                누구든지 이 험난한 도로속에서는 눈먼 총알에 타이어가 터지지 않기만을 그저 바랄 뿐이지<br>
                실린더헤드? 피스톤? 지금 차 걱정 할때야? 옥탄이나 채워 죽기싫으면
            </div>
            <div class="fspms">
                -크리스 럼벨-
            </div>
            <br>
        </div>

        <div class="container-fluid d-flex flex-column justify-content-center align-items-center">
            <div class="fsplll font-bold mt-2">FPS와 레이싱이 합쳐진 아케이드 지향의 슈터형 레이싱</div>
        </div>

        <div v-if="store.getters.GET_BROWSER_SIZE > 1000"
        id="gameIntroduceText" class="container-fluid d-flex justify-content-around text-center mt-4">
            <div class="d-flex flex-column fabric-contents-intro">
                <div class="fspll mt-1">
                    개인전
                </div>
                <div class="fsps mt-1">
                    혼자서도 가능한 쾌활한 레이싱!
                </div>
                <div id="contentsWrapper1" class="mt-1">
                    <div>
                        <img src="/images/introduces/intro0.png">
                    </div>
                </div>
            </div>

            <div class="d-flex flex-column fabric-contents-intro">
                <div class="fspll mt-1">
                    팀전
                </div>
                <div class="fsps mt-1">
                    다양한 게이머와 즐기는 팀전!
                </div>
                <div id="contentsWrapper2" class="mt-1">
                    <div>
                        <img src="/images/introduces/intro1.png">
                    </div>
                </div>
            </div>

            <div class="d-flex flex-column fabric-contents-intro">
                <div class="fspll mt-1">
                    AI전
                </div>
                <div class="fsps mt-1">
                    실력 맞춤형 AI대전!
                </div>
                <div id="contentsWrapper3" class="mt-1">
                    <div>
                        <img src="/images/introduces/intro1.png">
                    </div>
                </div>
            </div>

            <div class="d-flex flex-column fabric-contents-intro">
                <div class="fspll mt-1">
                    보스전
                </div>
                <div class="fsps mt-1">
                    지루할 틈이 없는 AI전!
                </div>
                <div id="contentsWrapper4" class="mt-1">
                    <div>
                        <img src="/images/introduces/intro1.png">
                    </div>
                </div>
            </div>
        </div>
        <simple-slide-vue v-else
        :itemJsonList="params.itemJson"
        ></simple-slide-vue>
        
    </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';
import SimpleSlideVue from '../etc/SimpleSlideVue.vue';

export default {
  components: { SimpleSlideVue },
    name:'GameIntroduceVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            itemJson: [
                {
                    navName: '',
                    title: '개인전',
                    content: '혼자서도 가능한 쾌활한 레이싱!',
                    imgSrc: '/images/introduces/One.jpg',
                },
                {
                    navName: '',
                    title: '팀전',
                    content: '다양한 게이머와 즐기는 팀전!',
                    imgSrc: '/images/introduces/Many.jpg',
                },
                {
                    navName: '',
                    title: 'CPU전',
                    content: '실력 맞춤형 AI대전!',
                    imgSrc: '/images/introduces/CPU2.jpg',
                },
                {
                    navName: '',
                    title: '보스전',
                    content: '지루할 틈이 없는 AI전!',
                    imgSrc: '/images/introduces/boss2.png',
                },
            ],
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

.fabric-contents-intro{
    width: 23%;
}

img{
    width: 100%;
    height: auto;
    margin: 2em 0 0 0;
}

#gameIntroduceWrapper{
    width: 100vw;
    height: auto;
    min-height: 100vh;
    background-image: 
    linear-gradient(to top, rgba(0,0,1) 20%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.7) 100%), 
    url('../../../../public/images/introduces/madmax.jpg');
    
    background-repeat: no-repeat;
    background-size: cover;
    /* background-color: rgb(59, 59, 59); */
    padding-left: 0;
    padding-right: 0;
}

#gameIntroduceWrapper>div{
    z-index: 2;
}

#gameIntroduceText{
    width: 80vw;
    margin-bottom: 3em;
}

#thisGameIsWhatWrapper{
    margin-top: 3rem;;
}

</style>




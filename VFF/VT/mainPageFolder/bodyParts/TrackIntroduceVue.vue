<template>
    <div id="trackIntroduceWrapper" class="container-fluid d-flex flex-column justify-content-center white-font">
        <div class="container-fluid d-flex flex-column justify-content-center align-items-center">
            <span class="fspllll">트랙소개</span>
        </div>

        <div id="trackIntroduceText" class="">
            <div id="trackImgWrapper" class="d-flex justify-content-center">
                <div class="container-fluid d-flex justify-content-around">
                    <div id="imgWrapper"
                    @mouseover="methods.changeValue(index)"
                    :style="`${index===params.currentHover? 'width:60%;': ''}`"
                    :class="`align-self-center d-flex justify-content-center is-have-plain-transition`" 
                    v-for="itme, index in params.trackImgSrc" :key="index">
                        <img 
                        :style="`${index===params.currentHover? 'left: 0;': ''}`"
                        :class="`img-${index} over-cursor`" 
                        :src="`/images/tracks/track${index}.png`" alt="" srcset="">
                        <div id="deopgae" v-if="index!==params.currentHover">
                        </div>

                        <transition name="fast-fade" mode="out-in">
                            <div id="infoTextWrapper" class="text-center" v-if="index===params.currentHover">
                                <div class="fspm">
                                    {{itme.name}}
                                </div>

                                <div class="fsps">
                                    {{itme.content}}
                            </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'TrackIntroduceVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            trackImgSrc: [],
            currentHover: -1,
        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
            },
            requestTrack: ()=>{
                AXIOS.get('/info/another/track')
                .then((response)=>{
                    params.value.trackImgSrc = response.data.result;
                    console.log(params.value.trackImgSrc);
                })
                .catch((error)=>{
                    console.log(error);
                });
            },
            changeValue: (index)=>{
                params.value.currentHover = index;
            },
        };

        onMounted(()=>{
            methods.requestTrack();
        });

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

#trackIntroduceWrapper{
    width: 100vw;
    height: 100vh;
    background-color: black
}

#imgWrapper{
    width: 12%;
    height: 50vh;
    overflow: hidden;
    position: relative;
    /* border: 1px orange solid; */
    /* overflow: hidden;
    position: relative;
    transform: skew(20deg);
    border: 1px orange solid; */
}

img{
    width: auto;
    height: 100%;
    position: relative;
    left: 0;
    /* transform: skew(-20deg); */
}

#deopgae{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.7);
}

#infoTextWrapper{
    position: absolute;
    align-self: center;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px;
}

/* .img-0{
    left: 0;
}

.img-1{
    right: 25%;
}

.img-2{
    right: 0;
} */

/* #parallelogram {
    transform: skew(20deg);
    background: red;
} */

</style>




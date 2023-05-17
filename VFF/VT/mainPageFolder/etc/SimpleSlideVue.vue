<template>
    <div id="gameIntroduceMoblieText" class="d-flex flex-column justify-content-center text-center">
        <div id="gameIntroNavWrapper" class="d-flex justify-content-center" :style="`${store.getters.GET_IS_MOBILE? 'margin-top: 2em;': ''}`">
            <div id="gameIntroNav" class="d-flex justify-content-around">
                <div 
                @click="methods.visibleChange(index)"
                :class="`isIntroWrapperTitle fspll align-self-center over-cursor is-have-plain-transition ${index === params.currentIndex?'test-border':''}`"
                v-for="item, index in props.itemJsonList" :key="index">
                    <div>
                        {{item.title}}
                    </div>
                </div>
            </div>
        </div>

        <div id="gameIntroWrapper" class="d-flex justify-content-center is-have-plain-transition">
            <div @mousedown="methods.mouseDown" @mouseup="methods.mouseUp" @mousemove="methods.mouseMove" @mouseleave="methods.mouseLeave"
            id="gameIntro" class="d-flex is-have-plain-transition">
                <div :class="`isIntroWrapperContents ${params.isDown? '': 'is-have-plain-transition'}`" :style="`transform: translateX(${params.currentVW}px)`"
                v-for="item, index in props.itemJsonList" :key="index">
                    <div class="d-flex flex-column">
                        <div class="fsps my-3">
                            {{item.content}}
                        </div>
                        <div id="contentsWrapper1" class="mt-1">
                            <div>
                                <img :src="`${item.imgSrc}`">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'SimpleSlideVue',
    props: {
        itemJsonList: Array,
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            currentIndex: 0,
            currentVW: '',
            downPosition: 0, isDown: false,
        });

        const methods = {
            visibleChange: (index)=>{
                params.value.currentIndex = index;
                params.value.currentVW = params.value.currentIndex * -1 * window.innerWidth * 0.6;

            },
            mouseDown: (e)=>{
                if(!store.getters.GET_IS_MOBILE){
                    params.value.isDown = true;
                    params.value.downPosition = e.pageX;
                }
            },
            mouseUp: (e)=>{
                if(params.value.isDown && !store.getters.GET_IS_MOBILE){
                    params.value.isDown = false;
                    var size = store.getters.GET_BROWSER_SIZE * 0.6;

                    if(e.pageX-params.value.downPosition > size * 0.2 && params.value.currentIndex > 0){
                        methods.visibleChange(params.value.currentIndex-1);
                    } else if(e.pageX-params.value.downPosition < -size * 0.2 && params.value.currentIndex < 3){
                        methods.visibleChange(params.value.currentIndex+1);
                    } else{
                        params.value.currentVW = params.value.currentIndex * -1 * store.getters.GET_BROWSER_SIZE * 0.6;
                    }
                }
            },
            mouseMove: (e)=>{
                if(params.value.isDown){
                    var size = store.getters.GET_BROWSER_SIZE * 0.6;

                    if(params.value.currentIndex * -1 * size + (e.pageX-params.value.downPosition) < 0 
                        && params.value.currentIndex * -1 * size + (e.pageX-params.value.downPosition) > 3 * -1 * size)
                    params.value.currentVW = params.value.currentIndex * -1 * size + (e.pageX-params.value.downPosition);
                }
            },
            mouseLeave: (e)=>{
                if(params.value.isDown && !store.getters.GET_IS_MOBILE){
                    params.value.isDown = false;
                    params.value.currentVW = params.value.currentIndex * -1 * store.getters.GET_BROWSER_SIZE * 0.6;
                }
            },
        };

        onMounted(()=>{
            
            if(store.getters.GET_IS_MOBILE){
                $('#gameIntro').on("touchstart", (e)=>{
                    params.value.isDown = true;
                    params.value.downPosition = e.originalEvent.touches[0].pageX;
                });

                $('#gameIntro').on("touchmove", (e)=>{
                    if(params.value.isDown){
                        var pageX = e.originalEvent.changedTouches[0].pageX;

                        var size = store.getters.GET_BROWSER_SIZE * 0.6;

                        if(params.value.currentIndex * -1 * size + (pageX-params.value.downPosition)*1.2 < 0 
                            && params.value.currentIndex * -1 * size + (pageX-params.value.downPosition)*1.2 > 3 * -1 * size)
                        params.value.currentVW = params.value.currentIndex * -1 * size + (pageX-params.value.downPosition)*1.2;
                    }
                });

                $('#gameIntro').on("touchend", (e)=>{
                    if(params.value.isDown){
                        params.value.isDown = false;
                        var size = store.getters.GET_BROWSER_SIZE * 0.6;
                        var pageX = e.originalEvent.changedTouches[0].pageX;

                        if(pageX-params.value.downPosition > size * 0.3 && params.value.currentIndex > 0){
                            methods.visibleChange(params.value.currentIndex-1);
                        } else if(pageX-params.value.downPosition < -size * 0.3 && params.value.currentIndex < 3){
                            methods.visibleChange(params.value.currentIndex+1);
                        } else{
                            params.value.currentVW = params.value.currentIndex * -1 * store.getters.GET_BROWSER_SIZE * 0.6;
                        }
                    }
                });
            }
            
        });

        return {
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
#gameIntroduceMoblieText{
    width: 80vw;
}

/* #gameIntroNavWrapper{
    width: 100%;
} */

#gameIntroWrapper{
    padding-top: 1.5em;
}

#gameIntroNav{
    width: 90%;
}

.isIntroWrapperTitle{
    width: 25vw;
    margin: 0 3vw;
}

#gameIntro{
    position: relative;
    width: 60vw;
    overflow: hidden;
}

img{
    width: 60vw;
    margin-bottom: 1.5em;
    -webkit-user-drag: none;
    -webkit-user-select: none;
}
</style>




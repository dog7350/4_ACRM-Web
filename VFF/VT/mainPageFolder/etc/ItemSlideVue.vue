<template>
    <div>
        <div id="slideItemWrapper" class="d-flex justify-content-center">
            
            <div
            :class="`d-flex flex-column text-center itemBox over-cursor is-have-plain-transition ${props.currentVideo===index? 'selected-item': ''}`"
            v-for="item, index in params.itemsInfo.result" :key="index">
                <div @click="methods.click(index)" @mouseover="methods.over(index)" @mouseout="methods.out(index)"
                :id="`itemImgBox${index}`" :class="`image-box d-flex`">
                    <img :id="`itemImg${index}`" :connection-modal="`itemModal${index}`"
                    :class="`real-img border-radius-c is-have-plain-transition ${props.currentVideo===index? 'selected-img': ''}`"
                    :src="`${params.imgFolderSrc}${params.imgName}${item.index-1}${params.extName}`">

                    <!-- :style="`${params.currentIndex === index? 'color: rgb(255, 51, 51);transform: scale(0.9);':''}`" -->

                    <!-- <transition name="fast-fade" mode="out-in"> -->
                    <i :style="`${params.currentIndex === index? 'color: rgb(255, 51, 51);transform: scale(0.9);':''}`"
                    :class="`bi bi-fullscreen align-self-center svg-img my-modal my-invisible is-have-plain-transition`"
                    :id="`itemModal${index}`"></i>
                    <!-- </transition> -->
                    
                    <div :style="`${params.currentIndex === index? 'background-color: rgba(0, 0, 0, 0);transform: scaleY(0);':''}`"
                    :id="`cover${index}`" class="cover coverd is-have-plain-transition"></div>
                    <!-- <img src="/svgs/testSvg.svg"  class=""> -->
                </div>
                <div :class="`text-center is-have-plain-transition item-info-box ${params.currentIndex === index? 'selected-item':''}`">
                    <div class="fspl">
                        {{item.name}}
                    </div>
                    <div class="fspm">
                        {{item.content}}
                    </div>
                </div>
            </div>
        </div>

        
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name: 'ItemSlideVue',
    props: {
        urlName: String,
        extName: String,
        imgFolderSrc: String,
        imgName: String, currentVideo: Number
    },
    setup(props, context) {
        const store = Store;

        const params = ref({
            itemsInfo: [],
            currentIndex: 0,
            urlName: props.urlName,
            extName: props.extName,
            imgFolderSrc: props.imgFolderSrc,
            imgName: props.imgName,
        });

        const methods = {
            requestInfo: ()=>{
                params.value.itemsInfo = [];
                params.value.currentIndex = 0;

                AXIOS.get(params.value.urlName)
                .then((response)=>{
                    params.value.itemsInfo = response.data;
                    // console.log(params.value.itemsInfo);
                    // params.value.currentIndex = parseInt(params.value.itemsInfo.result.length/2);
                    params.value.currentIndex = 0;
                })
                .catch((error)=>{
                    params.value.itemsInfo = error.response.data;
                });
            },
            click: (index)=>{
                $(`#cover${params.value.currentIndex}`).addClass('coverd');
                params.value.currentIndex = index;
                $(`#cover${params.value.currentIndex}`).removeClass('coverd');

                var selector = $(`#itemImg${index}`);
                var modal = $(`#${selector.attr("connection-modal")}`);
                var classList = modal.attr('class');

                context.emit("IMCHANGE", params.value.currentIndex);
            },
            over: (index)=>{
                if(!store.getters.GET_IS_MOBLIE){
                    var selector = $(`#itemImg${index}`);
                    var modal = $(`#${selector.attr("connection-modal")}`);
                    var classList = modal.attr('class');

                    modal.removeClass("my-invisible");
                    modal.addClass("my-visible");

                    if(params.value.currentIndex !== index){
                        $(`#cover${index}`).removeClass('coverd');
                    }
                }
            },
            out: (index)=>{
                if(!store.getters.GET_IS_MOBLIE){
                    var selector = $(`#itemImg${index}`);
                    var modal = $(`#${selector.attr("connection-modal")}`);
                    var classList = modal.attr('class'); 

                    modal.removeClass("my-visible");
                    modal.addClass("my-invisible");

                    if(params.value.currentIndex !== index){
                        $(`#cover${index}`).addClass('coverd');
                    }
                }
            }
        };

        methods.requestInfo();

        return {
            params, methods, props, store
        };
    },
}
</script>

<style scoped>
.real-img{
    width: 10vw;
    height: auto;
    z-index: 3;
}

.image-box{
    position: relative;
    margin: 0 3vw;
}

.my-modal{
    position: absolute;
    top: -3vw;
    left: -3vw;
    font-size: 16vw;
    z-index: 5;
    transform: scale(0.7);
}

.selected-modal{
    color: rgb(255, 51, 51);
    transform: scale(0.9);
}

.my-animate{
    animation: tinyNBig 3s infinite linear;
}

@keyframes tinyNBig {
    0%{
        transform: scale(0.8);
    }
    50%{
        transform: scale(0.9);
    }
    100%{
        transform: scale(0.8);
    }
}

.my-invisible{
    color: transparent;
}

.my-visible{
    color: white;
    transform: scale(0.9);
}

.cover{
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    transform-origin: bottom;
    transform: scaleY(0);
    z-index: 4;
}

.coverd{
    background-color: rgba(0, 0, 0, 0.5);
    transform: scaleY(1);
}

.item-info-box{
    position: absolute;
    left: 0;
    width: 100%;
    color: transparent;
}

.selected-item{
    color: white;
    transform: translateY(-170%);
}

</style>
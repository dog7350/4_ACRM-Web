<template>
    <div>
        <div v-if="params.itemsInfo === null">
            <h1>불러오는중...</h1>
        </div>
        <div v-else-if="params.itemsInfo.code !== 200">
            <h1>불러오는데 실패했습니다.</h1><hr>
            <h1>
            결과: {{params.itemsInfo.result}}<br>
            코드: {{params.itemsInfo.code}}<br>
            <button @click="methods.requestItemInfo">다시 불러오기</button>
        </h1>
        </div>
        <div id="slideBody" class="container-fluid d-flex justify-content-center align-content-center relativeContainer" v-else>
            <button class="lr-button fsplll" v-if="props.useButtonValue != 2">
                <i class="bi bi-chevron-compact-left white-font over-cursor" @click="methods.prevItem"></i>
            </button>
            <ul id="slideItems" class="text-center d-flex justify-content-center align-content-center p-0 my-0" @click="methods.clk">
                <li
                @click="methods.openVideo(index)"
                :class="`d-flex align-content-center ${store.getters.GET_BROWSER_SIZE < 1400? 'over-cursor': ''}`"
                v-for="item, index in params.itemsInfo.result" :key="index">
                    <transition name="fade-silde" mode="out-in" @after-enter="methods.changeOver" @after-leave="methods.chagngeItem" :id="`itemFader${props.unique}`"
                    :style="params.asdsadsad">
                        <slide-item-vue v-if="(item.index-1 === params.currentIndex && params.isntChange)"
                        :minHeight="300" :minWidth="400"
                        :extName="params.extName" :imgFolderSrc="params.imgFolderSrc" :imgName="params.imgName" :itemJson="item"/>
                    </transition>
                </li>
            </ul>
            <button class="lr-button fsplll" v-if="props.useButtonValue != 2">
                <i class="bi bi-chevron-compact-right white-font over-cursor" @click="methods.nextItem"></i>
            </button>
            <ul class="pagination justify-content-center align-items-center p-0 mx-auto col-sm-12" v-show="!props.hideSelector">
                <li v-for="item, index in params.itemsInfo.result" :key="index" class="page-item mx-1">
                    <button :style="`height:5px; width:20px; background-color: rgba(${index === params.currentIndex?'255, 255, 255':'0,0,0'}); border:none; outline: none;`"
                    @click="methods.clkSelector(index)"/>
                </li>
            </ul>
        </div>
    </div>
</template>



<script>
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';
import SlideItemVue from './SlideItemVue.vue';

export default {
  components: { SlideItemVue },
    name:'SlideVue',
    props:{
        imgFolderSrc: String,   // ex) /images/items/
        extName: String,        // ex) .jpg
        imgName: String,        // ex) item
        urlName: String,        // ex) /info/anoter/track
        hideSelector: Boolean, useButtonValue: Number,
        minWidth: Number, minHeight: Number,
        unique: String, videoLink: Array, settingNumber: Number,
    },
    setup(props, context) {
        const store = Store;
        const params = ref({
            itemsInfo: null,
            currentIndex: 0,
            nextIndex: 0,
            isntChange: true,
            changeDirection: true,
            changeOver: true,
            loadEnd: true,
            asdsadsad: {
                "--transVarEnter": "translateX(0%)",
                "--transVarLeave": "translateX(0%)",
            },
            imgFolderSrc: props.imgFolderSrc,
            extName: props.extName,
            imgName: props.imgName,
            urlName: props.urlName,
            minWidth: props.minWidth, minHeight: props.minHeight,
        });

        const methods = {
            openVideo: (index)=>{
                if(store.getters.GET_BROWSER_SIZE < 1400){
                    var iframeText = props.videoLink[index];

                    iframeText = iframeText.replace('width="600px" height="100%"', 'width="100%" height="100%"');

                    store.commit('CHANGE_VIDEO', iframeText);
                    store.commit('OPEN_FOREGROUND', {name: 'YoutubePlayerVue'});
                }
            },
            nextItem: ()=>{
                if(params.value.itemsInfo !== null && params.value.itemsInfo.code === 200){
                    params.value.asdsadsad = {
                        "--transVarEnter": "translateX(5%)",
                        "--transVarLeave": "translateX(-5%)",
                    };

                    document.getElementById(`itemFader${props.unique}`).style.setProperty("--transVarEnter", "translateX(5%)");
                    document.getElementById(`itemFader${props.unique}`).style.setProperty("--transVarLeave", "translateX(-5%)");

                    params.value.changeDirection = true; 
                    params.value.isntChange = false;

                    params.value.currentIndex = (params.value.currentIndex+1) % params.value.itemsInfo.result.length;
                }  
            },
            prevItem: ()=>{
                if(params.value.itemsInfo !== null && params.value.itemsInfo.code === 200){
                    params.value.asdsadsad = {
                        "--transVarEnter": "translateX(-5%)",
                        "--transVarLeave": "translateX(5%)",
                    };

                    document.getElementById(`itemFader${props.unique}`).style.setProperty("--transVarEnter", "translateX(-5%)");
                    document.getElementById(`itemFader${props.unique}`).style.setProperty("--transVarLeave", "translateX(5%)");
                    
                    params.value.changeDirection = false;
                    params.value.isntChange = false;

                    params.value.currentIndex = (params.value.currentIndex-1) < 0? params.value.itemsInfo.result.length-1: (params.value.currentIndex-1);
                }
            },
            chagngeItem: (e)=>{
                if(params.value.itemsInfo !== null && params.value.itemsInfo.code === 200){
                    params.value.isntChange = true;
                }
            },
            requestItemInfo: ()=>{
                params.value.itemsInfo = null;
                params.value.currentIndex = 0;

                AXIOS.get(params.value.urlName)
                .then((response)=>{
                    params.value.itemsInfo = response.data;
                    // params.value.currentIndex = parseInt(params.value.itemsInfo.result.length/2);
                    params.value.currentIndex = 0;
                    context.emit("CURRENTSLIDENUMBER", params.value.currentIndex);
                })
                .catch((error)=>{
                    params.value.itemsInfo = error.response.data;
                });
            },
            clk: (e)=>{
                if(params.value.changeOver && props.useButtonValue != 0){
                    params.value.changeOver = false;

                    // var doc = document.getElementById('slideBody');
                    // doc.style.minHeight = doc.offsetHeight;

                    if(e.pageX <= window.innerWidth/2){
                        methods.prevItem()
                    } else{
                        methods.nextItem();
                    }
                }    
            },
            clkSelector: (pressIndex)=>{
                if(params.value.changeOver){
                    params.value.changeOver = false;

                    if(pressIndex !== params.value.currentIndex){
                        // var doc = document.getElementById('slideBody');
                        // doc.style.minHeight = doc.offsetHeight;

                        if(pressIndex > params.value.currentIndex){
                            params.value.asdsadsad = {
                                "--transVarEnter": "translateX(5%)",
                                "--transVarLeave": "translateX(-5%)",
                            };

                            document.getElementById(`itemFader${props.unique}`).style.setProperty("--transVarEnter", "translateX(5%)");
                            document.getElementById(`itemFader${props.unique}`).style.setProperty("--transVarLeave", "translateX(-5%)");

                            params.value.changeDirection = true; 
                            params.value.isntChange = false;
                        } else{
                            params.value.asdsadsad = {
                                "--transVarEnter": "translateX(-5%)",
                                "--transVarLeave": "translateX(5%)",
                            };

                            document.getElementById(`itemFader${props.unique}`).style.setProperty("--transVarEnter", "translateX(-5%)");
                            document.getElementById(`itemFader${props.unique}`).style.setProperty("--transVarLeave", "translateX(5%)");
                            
                            params.value.changeDirection = false;
                            params.value.isntChange = false;
                        }

                        params.value.currentIndex = pressIndex;
                    } else{
                        params.value.changeOver = true;
                    }
                }
            },
            changeOver: ()=>{
                // var doc = document.getElementById('slideBody');
                // doc.style.minHeight = 0;
                context.emit("CURRENTSLIDENUMBER", params.value.currentIndex);
                params.value.changeOver = true;
            }
        };

        onMounted(()=>{
            methods.requestItemInfo();
            if(props.settingNumber !== null && props.settingNumber !== undefined){
                watch(()=>props.settingNumber, (settingNumber, prevNumber)=>{
                    methods.clkSelector(settingNumber);
                });
            }
            
            // setTimeout(()=>{params.value.selectorVisible = false;}, 1000);
        });

        onBeforeUnmount(()=>{
            // params.value.selectorVisible = false;
        });

        return {
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
.fade-silde-enter-from{
    transform: var(--transVarEnter);
    opacity: 0;
}

.fade-silde-leave-to{
    transform: var(--transVarLeave);
    opacity: 0;
}

.fade-silde-leave-active,
.fade-silde-enter-active{
    transition: all 0.5s ease;
}

#slideItems{
    list-style: none;
    padding: 0;
}

.relativeContainer{
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
}

.lr-button{
    border: none;
    outline: none;
    background: transparent;
    cursor: default;
}

.lr-button{
    margin: 0 2vw;
}
</style>




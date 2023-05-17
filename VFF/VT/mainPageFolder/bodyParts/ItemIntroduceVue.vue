<template>
    <div id="itemIntroduceWrapper" class="container-fluid d-flex flex-wrap justify-content-center align-content-around white-font">
        <div class="container-fluid d-flex flex-column justify-content-center align-items-center">
            <span class="fspllll">아이템소개</span>
        </div>

        <div id="iframeBoxWrapper" class="d-flex justify-content-center align-content-center">
            <transition name="fast-fade" mode="out-in">
                <div 
                v-if="params.changeing"
                id="iframeBox" 
                v-html="params.itemUsePlayList[params.currentNumber]">
                </div>

                <div 
                v-else
                id="iframeBox" 
                v-html="params.itemUsePlayList[params.currentNumber]">
                </div>
            </transition>
        </div>

        <div id="itemIntroduceText" class="d-flex flex-column justify-content-center text-center">

            <div id="itemUnfoldWrapper">
                <item-slide-vue @IMCHANGE="methods.okItsChange"
                :imgFolderSrc="'/images/items/'"
                :imgName="'item'"
                :extName="'.jpg'"
                :urlName="'/info/another/item'">

                </item-slide-vue>
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
import ItemSlideVue from '../etc/ItemSlideVue.vue';

export default {
    components: {
        ItemSlideVue
    },
    name:'ItemIntroduceVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            itemUsePlayList: [
                '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/5jz0vCzwxiI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/rRTybs649Kc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/EQM5g89s-5w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/702SX7egMb4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/4yv0cfXKyJ0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
            ],
            currentNumber: 0,
            changeing: true,
        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
            },
            okItsChange: (payload)=>{
                params.value.currentNumber = payload;
                params.value.changeing = !params.value.changeing;
            }
        };

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

#itemIntroduceWrapper{
    width: 100vw;
    height: auto;
    min-height: 100vh;
    background-image: 
    linear-gradient(to top, rgba(0,0,1) 20%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.7) 90%, black), 
    url('../../../../public/images/introduces/itemIntro (2).jpg');
    
    background-repeat: round;
    background-size: cover;
    /* background-color: rgb(59, 59, 59); */
    padding-left: 0;
    padding-right: 0;
    margin-top: 10vh;
}

#iframeBoxWrapper{
    width: 60vw;
    height: 45vh;
}

#iframeBox{
    width:100%;
    height: 100%;
}

</style>




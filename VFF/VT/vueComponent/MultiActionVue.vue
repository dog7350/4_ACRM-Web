<template>
    <div id="MultiBannerWrapper" class="">

        <div 
        @click="methods.mainButtonClick"
        id="mainButtonWrapper" 
        :style="`${params.mainIsOver? 'box-shadow: 0 0 12px 0px white;': ''}`"
        class="position-abs d-flex justify-content-center align-items-center border-radius-b">
            <i class="bi bi-app over-cursor icon-size-standard"></i>
        </div>


        <div @click="methods.scrollTop"
        :style="`font-size: 33px; transform: ${params.mainIsOver? 'translate(25px, -60px)': ''};`"
        id="scrollTopButtonWrapper" 
        class="position-abs d-flex justify-content-center align-items-center border-radius-b">
            <i class="bi bi-capslock over-cursor "></i>
        </div>

        <div @click="methods.openCommunityPage"
        :style="`font-size: 33px; transform: ${params.mainIsOver? 'translate(-25px, -60px) scaleX(-1)': 'scaleX(-1)'};`"
        id="communityButtonWrapper" 
        class="position-abs d-flex justify-content-center align-items-center border-radius-b">
            <i class="bi bi-chat-dots over-cursor "></i>
        </div>

        <div @click="methods.openStoragePage"
        :style="`font-size: 33px; transform: ${params.mainIsOver? 'translate(-60px, -25px)': ''};`"
        id="storageButtonWrapper" 
        class="position-abs d-flex justify-content-center align-items-center border-radius-b">
            <i class="bi bi-device-ssd over-cursor "></i>
        </div>

        <div @click="methods.openUserOptionPage" v-if="store.getters.GET_IS_LOGIN" 
        :style="`font-size: 33px; transform: ${params.mainIsOver? 'translate(-60px, 25px)': ''};`"
        id="userinfoButtonWrapper" 
        class="position-abs d-flex justify-content-center align-items-center border-radius-b">
            <i class="bi bi-cart over-cursor "></i>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted} from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'SlideItemVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            mainIsOver: false, pin: false,
        });

        const methods = {
            mainButtonOver: ()=>{
                if(!params.value.pin){
                    params.value.mainIsOver = true;
                }
            },
            mainButtonOut: (e)=>{
                if(!params.value.pin ){
                    params.value.mainIsOver = false;
                }
            },
            mainButtonClick: ()=>{
                if(params.value.pin){
                    params.value.pin = false;
                    params.value.mainIsOver = false;
                } else{
                    params.value.pin = true;
                    params.value.mainIsOver = true;
                }
            },
            scrollTop: ()=>{
                $('body').scrollTop(0);
                params.value.pin = false;
                params.value.mainIsOver = false;
            },
            routeUrl: (url)=>{
                router.push(url);
                params.value.pin = false;
                params.value.mainIsOver = false;
            },
            openUserOptionPage: ()=>{
                methods.routeUrl('/main/shop');
            },
            openStoragePage: ()=>{
                methods.routeUrl('/main/storage');
                // console.log('openStoragePage is not implemented');
            },
            openCommunityPage: ()=>{
                methods.routeUrl('/main/community');
            }
        };

        return {
            params, methods, store, props
        };
    },
}
</script>

<style scoped>

#MultiBannerWrapper{
    position: fixed;
    top: 0;
    z-index: 20;
}

.position-abs{
    position: fixed;
}


#mainButtonWrapper{
    background-color: orange;
    color: black;

    width: 40px;
    height: 40px;

    right: 50px;
    bottom: 50px;

    box-shadow: 0 0 2.5px 0px white;

    transition: all 0.5s ease;

    z-index: 20;
}


    


#scrollTopButtonWrapper{
    color: white;
    right: 53px;
    bottom: 53px;

    z-index: 19;
    transition: all 0.4s ease;
}

#scrollTopButtonWrapper:hover{
    text-shadow: 0 0 5px white;
}

#communityButtonWrapper{
    color: salmon;
    right: 53px;
    bottom: 53px;

    z-index: 19;
    transition: all 0.6s ease;
}

#communityButtonWrapper:hover{
    text-shadow: 0 0 5px salmon;
}

#storageButtonWrapper{
    color: aqua;
    right: 53px;
    bottom: 53px;

    z-index: 19;
    transition: all 0.5s ease;
}

#storageButtonWrapper:hover{
    text-shadow: 0 0 5px aqua;
}

#userinfoButtonWrapper{
    color: mediumspringgreen;
    right: 53px;
    bottom: 53px;

    z-index: 19;
    transition: all 0.8s ease;
}

#userinfoButtonWrapper:hover{
    text-shadow: 0 0 5px mediumspringgreen;
}

.icon-size-standard{
    font-size: 35px;
}

@media screen and (max-width: 1000px) {
    #mainButtonWrapper{
        right: 30px;
        bottom: 30px;
    }

    #scrollTopButtonWrapper{
        right: 33px;
        bottom: 33px;
    }

    #communityButtonWrapper{
        right: 33px;
        bottom: 33px;
    }

    #storageButtonWrapper{
        right: 33px;
        bottom: 33px;
    }

    #userinfoButtonWrapper{
        right: 33px;
        bottom: 33px;
    }
}

</style>




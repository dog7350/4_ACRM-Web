<template>
    <div @click="methods.click" @mouseover="methods.over" @mouseout="methods.out" @mouseleave="methods.leave"
    id="threeWayPartsWrapper"
    class="testBox d-flex flex-wrap justify-content-center align-content-center border-radius-d over-cursor black-font">

        <div v-if="store.getters.GET_BROWSER_SIZE > 1200"
        id="leftCloser" :class="`close-box is-have-plain-transition ${params.closed? 'box-closed': 'box-opend'}`"></div>
        <div v-if="store.getters.GET_BROWSER_SIZE > 1200"
        id="rightCloser" :class="`close-box is-have-plain-transition ${params.closed? 'box-closed': 'box-opend'}`"></div>

        <div id="upperBox" 
        :class="`d-flex justify-content-center border-radius-d ${params.closed? '': 'bbaggom'} ${params.clicked? 'frame-clicked': 'frame-not-clicked'} `">
            <i class="bi bi-chevron-double-up white-font icon-size-standard"></i>
        </div>

        <div id="threeWayIneerWrapper" :class="`d-flex flex-wrap justify-content-center align-content-between text-center`">
            <div id="mainImgWrapper" :class="`fsplll d-flex flex-wrap justify-content-center align-content-${store.getters.GET_BROWSER_SIZE > 1200? 'end':'center'}`">
                <div id="imgFrame" class="d-flex flex-wrap justify-content-center align-content-center">
                    <!-- <img :src="`/images/introduces/threeWaies/threeWay${params.index}.png`" > -->
                    <i 
                    :class="`bi 
                        ${['bi-device-ssd', 'bi-cart', 'bi-chat-dots', 'bi-kanban'][params.index]}`"
                    :style="`font-size: 120px;
                        ${['color: mediumspringgreen;', ' color: aqua;', 'color: #ff4f3a;', 'color: white;'][params.index]}`"
                    ></i>
                </div>
                <div v-if="store.getters.GET_BROWSER_SIZE < 1200"
                id="titleBox" class="fspl container-fluid font-bold">
                    {{params.title}}
                </div>
            </div>

            <div v-if="store.getters.GET_BROWSER_SIZE > 1200"
            id="titleNcontent" class="container-fluid d-flex flex-column justify-content-center">
                <div id="titleWrapper" class="fspl container-fluid d-flex justify-content-center font-bold">
                    <div id="titleBox">
                        {{params.title}}
                    </div>
                </div>

                <div id="contentsWrapper" class="fspm container-fluid d-flex justify-content-center">
                    <div id="contentBox">
                        {{params.content}}
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
    name: 'ThreeWayPartVue',
    props: {
        contents: JSON,
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            closed: true,
            index: -1,
            title: '',
            content: '',
            routeUrl: null,
            clicked: false,
            
        });

        if(props.contents){
            params.value.index = props.contents.index;
            params.value.title = props.contents.title;
            params.value.content = props.contents.content;
            params.value.routeUrl = props.contents.routeUrl;
        }

        const methods = {
            over: ()=>{
                params.value.closed = false;
            },
            out: ()=>{
                params.value.closed = true;
            },
            leave: ()=>{
                params.value.closed = true;
            },
            click: ()=>{
                if(params.value.routeUrl && params.value.routeUrl.length > 0){
                    params.value.clicked = true;

                    setTimeout(()=>{
                        router.push(params.value.routeUrl);
                    }, 300);
                }
            },
            // routeUrl: ()=>{
            //     router.push(params.value.routeUrl);
            // }
        };

        

        return {
            params, methods, store, props
        };
    },
}
</script>


<style scoped>
#threeWayPartsWrapper{
    overflow: hidden;
}

#imgFrame{
    width: 80%;
    height: 80%;
}

#threeWayIneerWrapper>div{
    width: 100%;
}

#mainImgWrapper{
    height: 70%;
    overflow: hidden;
}

#titleNcontent{
    height: 30%;
}

#threeWayIneerWrapper{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

.testBox{
    position: relative;
    width: 15vw;
    height: 60%;
    border: 3px rgb(26, 103, 247) solid;
    opacity: 1;
    background-color: rgba(147, 185, 255, 0.9);
}

@media screen and (max-width: 1200px){
    .testBox{
        position: relative;
        margin: 5vh 0 0 0;
        width: 40%;
        height: 80%;
        border: 3px rgb(26, 103, 247) solid;
        opacity: .9;
        background-color: rgb(147, 185, 255);
        align-self: center;
    }

    #mainImgWrapper{
        height: 100%;
    }

    img{
        margin: 5px;
        /* width: inherit; */
    }

    #imgFrame{
        overflow: hidden;
    }
}



#leftCloser, #rightCloser{
    position: absolute;
    background-color: rgba(0, 0, 0, 0.3);
    top: 0;
    width: 50%;
    height: 100%;
}

#leftCloser{
    left:0;
    border-radius: 15px 0 0 15px;
    transform-origin: left;
}

#rightCloser{
    right:0;
    border-radius: 0 15px 15px 0;
    transform-origin: right;
}

.box-closed{
    transform: scaleX(1);
}

.box-opend{
    transform: scaleX(0);
}

#upperBox{
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: bottom;
    left: 0;
    z-index: 5;
    background-color: deeppink;
    transition: all 0.2s ease;
}



.frame-not-clicked{
    /* transform: scaleY(0); */
    top: 100%;
}

.bbaggom{
    top: 95%;
}

.frame-clicked{
    /* transform: scaleY(1); */
    top: 0;
}



</style>
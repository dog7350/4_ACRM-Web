<template>
    <div id="weaponWholeWrapper">
        <div
            id="currentWeaponTitleWrapper" class="text-center fspll bold-font container-fluid">
            <span v-if="params.itemsInfo && params.itemsInfo.result">
                {{params.itemsInfo.result[props.currentVideo].name}}
            </span>
        </div>
        <div id="currentWeaponContentWrapper" class="text-center fsps container-fluid">
            <span v-if="params.itemsInfo && params.itemsInfo.result">
                {{params.itemsInfo.result[props.currentVideo].content}}
            </span>
        </div>
        <div
        :style="`transform: translateX(${props.currentVideo===0?29:props.currentVideo==1?14:props.currentVideo===2?-1:-16}vw);`"
        id="slideWeaponWrapper"
        class="d-flex justify-content-center is-have-plain-transition">
            <div @click="methods.click(index)" @mouseover="methods.over(index)" @mouseout="methods.out" @mouseleave="methods.leave"
            :class="`d-flex flex-column text-center itemBox over-cursor is-have-plain-transition ${params.currentOver===index? 'selected-item-miner': ''} ${props.currentVideo===index? 'selected-item': ''}`"
            v-for="item, index in params.itemsInfo.result" :key="index">
                <div :id="`imgBox${index}`" :class="`image-box`">
                    <img
                    :class="`is-have-plain-transition ${props.currentVideo===index? 'selected-img': ''}`"
                    :src="`${params.imgFolderSrc}${params.imgName}${item.index-1}${params.extName}`">
                </div>
                <div v-if="store.getters.GET_BROWSER_SIZE > 1000"
                :id="`nameBox${index}`" :class="`is-have-plain-transition name-box fspm ${props.currentVideo===index? 'selected-name': ''}`">
                    {{item.name}}
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
    name: 'WeaponSlideVue',
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
            currentOver: -1,
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
                context.emit("ITEMCLICK", index);
            },
            over: (index)=>{
                params.value.currentOver = index;
            },
            out: ()=>{
                params.value.currentOver = -1;
            },
            leave: ()=>{
                params.value.currentOver = -1;
            },
        };

        methods.requestInfo();

        return {
            params, methods, props, store
        };
    },
}
</script>

<style scoped>
#weaponWholeWrapper{
    overflow: hidden;
}

img{
    width: 10vw;
    height: auto;
    border: 2px transparent solid;
    min-width: 50px;
    z-index: 3;
}

.itemBox{
    position: relative;
    margin: 0 2.5vw;
    border: 1px transparent solid;
}

@media (hover:hover){
    .itemBox:hover{
        border: 1px transparent solid;
    }
}

/* .itemBox:hover{
    border: 1px orange solid;
} */

.image-box{
    z-index: 3;
}

.name-box{
    position: absolute;
    top: 90%;
    left: 10%;
    width: 80%;
    padding-top: 10px;
    color: black;
    background-color: rgb(26, 102, 241);
    z-index: 2;
}

.selected-item-miner{
    transform: scale(1.1);
}

.selected-item{
    transform: scale(1.2);
}

.selected-img{
    border: 2px rgb(26, 102, 241) solid;
}

.selected-name{
    transform: scale(1.5);
}

#currentWeaponContentWrapper{
    width: 80%;
    margin-bottom: 5vh;
}

#currentWeaponTitleWrapper{
    width: 80%;
    margin-bottom: 3vh;
}

#slideWeaponWrapper{
    padding-bottom: 5vh;
    position: relative;
}


</style>
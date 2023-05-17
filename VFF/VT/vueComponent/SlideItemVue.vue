<template>
    <div :class="`container-fluid d-flex flex-column justify-content-center`">
        <div class="d-flex align-content-center">
            <img :class="`container-fluid justify-content-center `"
            :src="`${params.imgFolderSrc}${params.imgName}${params.itemJson.index-1}${params.extName}`" 
            alt="사진을 불러오는데 실패했습니다." 
            :style="`width: 100%;max-width: ${store.getters.GET_BROWSER_SIZE < 1000? 200:props.minWidth}px; max-height:${store.getters.GET_BROWSER_SIZE < 1000? 150 :props.minHeight}px;`">
        </div>
        <div class="fspl slide-name">{{params.itemJson.name}}</div>
        <div class="fsps slide-text mx-auto">{{params.itemJson.content}}</div>
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
    props:{
        imgFolderSrc: String,   // ex) /images/items/
        extName: String,        // ex) .jpg
        imgName: String,        // ex) item
        itemJson: JSON, minWidth: Number, minHeight: Number,
    },
    setup(props) {
        const store = Store;
        const params = ref({
            imgFolderSrc: props.imgFolderSrc,
            extName: props.extName,
            imgName: props.imgName,
            itemJson: props.itemJson,

        });

        const methods = {
            
        };

        // console.log(`minWidth:${props.minWidth}px; minHeight:${props.minHeight}px;`);

        return {
            params, methods, store, props
        };
    },
}
</script>

<style scoped>

.slide-name{
    margin: 2em 0 1em 0;
}

.slide-text{
    min-width: 500px;
    max-width: 500px;
}

@media screen and (max-width: 1400px){
    .slide-text{
        width: 100%;
        max-width: 300px;
        min-width: 0px;
    }

    
}
</style>




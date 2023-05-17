<template>
    <div id="fileLineWrapper" class="d-flex flex-wrap awesome-scroll"
    :style="`background-image: linear-gradient(to top, rgba(0,0,0.3) 0%, rgba(0,0,0,0.3) 100%),  url('/images/download/${props.title}.jpg');`">
        <div class="d-flex text-start w-100 justify-content-center">
            <div class="fsplll font-bold align-self-center">
                {{props.title.toUpperCase()}}
            </div>
        </div>
        <div :id="`fileLineContainer${props.title}`" class="d-flex justify-content-center fileLineContainer">
            <file-download-vue
            v-for="item, index in props.fileInfoList" :key="index"
            :fileType="props.title" :fileItem="item" :position="1"
            ></file-download-vue>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import FileDownloadVue from './FileDownloadVue.vue';

export default {
    components:{
        FileDownloadVue
    },
    name:'FileLineVue',
    props:{
        fileInfoList: Array,
        title: String
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        

        const params = ref({
            index: 0
        });

        const methods = {
        }

        onMounted(()=>{

        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
#fileLineWrapper{
    overflow-x: scroll;
    background-position: center;
	background-repeat: no-repeat;
}

.fileLineContainer{
    padding: 0 35vw;
}

.awesome-scroll::-webkit-scrollbar{
    width: 7px;
    height: 7px;
}

.awesome-scroll::-webkit-scrollbar-thumb{
    border-radius: 4px;
    background-color: rgb(44, 93, 255);
}

.awesome-scroll::-webkit-scrollbar-track{
    background-color: transparent;
    border: 1px white solid;
    /* margin: 5px 2px 5px 0; */
}

.awesome-scroll::-webkit-scrollbar-button{
    display: none;
}

.awesome-scroll::-webkit-scrollbar-corner{
    display: none;
}

.awesome-scroll::-webkit-scrollbar-track-piece{
    display: none;
}

.awesome-scroll::-webkit-resizer{
    display: none;
}
</style>
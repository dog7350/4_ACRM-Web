<template>
    <div id="FileStoragePageWrapper" class="d-flex flex-wrap justify-content-center p-0 white-font">
        <file-storage-header-vue></file-storage-header-vue>

        <file-line-vue 
        class="file-line" 
        v-for="item, index in params.fileListList" :key="index"
        :title="index" :fileInfoList="item"
        ></file-line-vue>

        <!-- <pc-game-line-vue class="file-line"
        ></pc-game-line-vue> -->

        <!-- <mobile-game-line-vue class="file-line"
        ></mobile-game-line-vue>

        <psa-line-vue class="file-line"
        ></psa-line-vue> -->

        <footer-vue></footer-vue>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import FooterVue from '../mainPageFolder/bodyParts/FooterVue.vue';
import FileLineVue from './parts/FileLineVue.vue';
import FileStorageHeaderVue from './parts/FileStorageHeaderVue.vue'
// import PcGameLineVue from './parts/PcGameLineVue.vue';
// import MobileGameLineVue from './parts/MobileGameLineVue.vue';
// import PsaLineVue from './parts/PsaLineVue.vue';

export default {
    components:{
        FooterVue,
        FileStorageHeaderVue,
        // PcGameLineVue,
        FileLineVue,
        // MobileGameLineVue,
        // PsaLineVue
    },
    name:'FileStoragePage',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        
        const params = ref({
            fileListList: {},
            keys: [],
        });

        const methods = {
            getFileList: ()=>{
                AXIOS.get('/file/list')
                .then((res)=>{
                    params.value.keys = Object.keys(res.data.result);
                    params.value.fileListList = res.data.result;

                })
                .catch((err)=>{
                    console.log(err.response.data);
                });
            }
        }

        onMounted(()=>{
            methods.getFileList();
        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>
#FileStoragePageWrapper{
    width: 100vw;
    height: auto;
    min-height: 100vh;
}

#fileStorageHeader{
    position: sticky;
    background-color: rgba(255, 166, 0, 0.5);
    top: 0;
    width: 100vw;
    height: 90px;
    padding: 0;
    margin: 0;
}

.file-line{
    width: fit-content;
    min-width: 100%;
    height: fit-content;
    min-height: 300px;
}
</style>
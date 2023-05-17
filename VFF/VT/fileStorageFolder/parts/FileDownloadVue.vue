<template>
    <div id="downloadContainerWrapper" class="text-center d-flex justify-content-center align-items-center">
        <div id="fileDownloadWrapper" class="test-border">
            <!-- class="d-flex flex-column justify-content-center" -->
        
            <div id="position">
                {{
                    props.position===0? '최신': props.position===2? '오래된': '&nbsp'
                }}
            </div>

            <div id="fileName">
                {{props.fileItem.fileName}}
            </div>

            <div id="fileMtime">
                {{props.fileItem.mtime.split('T')[0]}}
            </div>

            <div id="downloadButtonWrapper">
                <input @click="methods.getFile"
                type="button" value="다운로드">
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';

export default {
    name:'FileDownloadVue',
    props:{
        fileType: String,
        fileItem: JSON,
        position: Number
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        
        const params = ref({
            fileType: '',

        });

        const methods = {
            getFile: ()=>{
                AXIOS.get(`/file/${props.fileType}?name=${props.fileItem.fileName}`, {responseType: 'blob'})
                .then((res)=>{
                    console.log(res);
                    if(navigator.userAgent.indexOf('Chrome') === -1){
                        store.commit('CREATE_ALERT', {msg:`크롬에서만 다운로드할 수 있습니다.`, time: 2, type:"danger"});
                    } else {
                        let blob = new Blob([res.data]);
                        let file = URL.createObjectURL(blob);

                        let a = document.createElement('a');   

                        a.download = props.fileItem.fileName;
                        a.href = file;
                        a.click();

                        URL.revokeObjectURL(file);
                    }
                })
                .catch((err)=>{
                    console.log(err.response.data);
                })
            }
        }

        onMounted(()=>{
            
        });

        return{
            params, methods, store, props
        };
    }
}
</script>

<style scoped>

#downloadContainerWrapper{
    width: 30vw;
    height: auto;
    min-height: 50%;
    color:white;
}

#fileDownloadWrapper{
    background-color: rgba(0, 0, 0, 0.7);
}

</style>
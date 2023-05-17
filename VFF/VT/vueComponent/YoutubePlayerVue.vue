<template>
    <div id="questionVueWholeWrapper"
     class="d-flex align-items-center justify-content-center white-font" 
    :style="`position:fixed; z-index:3000; top:0; right:0 left:0; width:100%; height:100%; background: rgba(0,0,0,0);`">

        <div class="container-fluid d-flex flex-column">
            

            <div id="youtubeBoxWrapper" class="d-flex justify-content-center">
                <div id="youtubeBox">
                    <div id="endBox" class="d-flex justify-content-end">
                        <i @click="store.commit('CLOSE_FOREGROUND')"
                        class="bi bi-x-square-fill fspll over-cursor"></i>
                    </div>
                    <div id="youtubeIfrmae" class="m-1 p-1" v-html="params.iframeText">
                        
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'

export default {
    name:'YoutubePlayerVue',
    setup() {
        const store = Store;

        const params = ref({
            iframeText: ''
        });

        const methods = {

        };
        
        onMounted(()=>{
            params.value.iframeText = store.getters.GET_VIEDO_IFRAME;
        });

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

/* #youtubeBoxWrapper{

} */

#youtubeIfrmae{
    width: 80vw;
    height: 60vh;
    border: 1px solid yellow;
    padding: 5px;
}

@media screen and (max-width: 1000px) {
    #youtubeIfrmae{
        width: 90vw;
        height: 60vh;
        border: 1px solid yellow;
        padding: 5px;
    }
}
/* 
iframe{
    width: 70vw;
    height: 50vh;
    min-width: 560px;
    min-height: 500px;
} */

</style>
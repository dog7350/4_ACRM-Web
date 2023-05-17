<template>
    <div id="FileStorageHeaderWrapper" class="is-top-sticky white-font">
        <div id="fileStorageHeaderContentsWrapper"
        :style="`background-color: rgba(255, 166, 0, ${params.navOpa});`"
        class="d-flex justify-content-around is-have-plain-transition">
            <div id="logoWrapper" class="d-flex align-items-center">
                <img width="100" id="" class="over-cursor" @click="methods.routeURL('/main')" src="/images/logos/segaLogo.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'FileStorageHeaderVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            navOpa: 1,
        });

        const methods = {
            routeURL: (url)=>{
                router.push(url);
            }
        };

        onMounted(()=>{
            window.onscroll = (e)=>{
                var scrollTop = window.scrollY || document.documentElement.scrollTop;

                if(scrollTop > 0){
                    params.value.navOpa = 0.7;
                } else{
                    params.value.navOpa = 1;
                }
            }
        });

        onUnmounted(()=>{
            window.onscroll = null;
        });

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

#FileStorageHeaderWrapper{
    width: 100vw;
    height: 9vh;
}

#fileStorageHeaderContentsWrapper{
    width: 100%;
    height: 100%;
}

.is-top-sticky{
    position: sticky;
    top: 0;
}

</style>




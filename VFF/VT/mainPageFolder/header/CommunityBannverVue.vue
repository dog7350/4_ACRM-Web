<template>
    <div 
    id="communityBanner"
    class="border-radius-b d-flex flex-column justify-content-center over-cursor">
        <i v-if="store.getters.GET_BROWSER_SIZE <= 1000" @click="store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'})"
        class="bi bi-person-square icon-size-standard" style="textAlign:center;"></i>
    </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'CommunityBannverVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({

        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
            },
        };

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>
#communityBanner{
    position: fixed;
    top: 150px;
    right: 70px;
    color: white;
    z-index: 30;
    padding: 10px 5px 5px 5px;
    /* background-color: rgba(0, 0, 0, 0.7); */
}

@media screen and (max-width: 1000px){
    #communityBanner{
        position: fixed;
        top: 20px;
        right: 20px;
        color: white;
        z-index: 30;
        padding: 5px;
        background-color: rgba(0, 0, 0, 0.7);
    }
}
</style>




<template>
    <div id="chatWatcherWrapper" class="d-flex flex-wrap justify-content-center align-items-start border-radius-d">
        <div id="chatWatcher"
        class="m-4 p-3 w-100 h-auto test-border border-radius-b">
            <ChatContainer/>
        </div>
    </div>  
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';

import ChatContainer from './ChatContainer.vue';

export default {
    components: { ChatContainer },
    name:'ChatWatcher',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        
        const params = ref({
            index: 0
        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
                window.scrollTo(0, 0);
            },
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

#chatWatcherWrapper{
    position: fixed;
    top: 20;
    z-index: 152;
    color: black;
    background-color: white;
    width: 90vw;
    height: 70vh;
    border: 7px rgb(33, 104, 235) solid;
    padding-top: 60px;
}

#chatWatcher{
    border: 3.5px orange solid;
}

</style>
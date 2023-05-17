<template>
    <div id="DMActionRootWrapper" class="over-cursor" @click="methods.onDMPage">
        <div id="DMActionWrapper" class="position-abs d-flex justify-content-center align-items-center border-radius-b">
            <i class="bi bi-phone icon-size-standard"></i>
            <div id="bellNotifi" class="border-radius-a" v-if="store.state.existNotifi && store.getters.GET_IS_LOGIN">
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted} from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'DMActionVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({

        });

        const methods = {
            onDMPage: ()=>{ 
                store.commit("SET_IS_DM_VIEW", {isView: true});
                
            }
        };

        return {
            params, methods, store, props
        };
    },
}
</script>

<style scoped>

#DMActionRootWrapper{
    position: fixed;
    top: 0;
    z-index: 20;
}

.position-abs{
    position: fixed;
}

#DMActionWrapper{
    background-color: white;
    color: black;

    width: 40px;
    height: 40px;

    left: 50px;
    bottom: 50px;

    box-shadow: 0 0 2.5px 0px white;

    transition: all 0.5s ease;

    z-index: 20;
}

.icon-size-standard{
    font-size: 35px;
}

@media screen and (max-width: 1000px) {
    #DMActionWrapper{
        left: 30px;
        bottom: 30px;
    }
}

#bellNotifi{
    position: absolute;
    background-color: red;
    color: white;
    margin: 0;
    top: 0px;
    right: 5px;
    width: 10px;
    height: 10px;
}

</style>




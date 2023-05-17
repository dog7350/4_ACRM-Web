<template>
    <div @click="store.commit('REMOVE_ALERT')"
     class="d-flex align-items-center justify-content-center font-size-basic" 
    :style="`position:fixed; z-index:${store.state.isAlert? '3000': '-3000'}; top:0; right:0 left:0; width:100%; height:100%; background: rgba(0,0,0,0);`">

        <!-- <div class="d-flex align-items-center justify-content-center" style="width:100%; height:30%; background: rgba(128, 255, 128,0.5);"> -->
            <div :class="`alert alert-${store.state.alertMsg.type? store.state.alertMsg.type: 'danger'} text-align-center`" 
            v-if="store.state.isAlert">
                <div class="fsplll" ><strong>{{(store.state.alertMsg.msg? store.state.alertMsg.msg: '')}}</strong></div>
            </div>
        <!-- </div> -->
        
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'

export default {
    name:'AlertPage',
    setup() {
        const store = Store;

        const params = ref({
        });

        const methods = {

        };

        return {
            params, methods, store
        };
    },
}
</script>

<style>

</style>
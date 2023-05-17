<template>
    <div>
        <slide-vue :extName="'.jpg'" :imgFolderSrc="'/images/guns/'" :imgName="'gun'" :urlName="'/info/another/gun'"></slide-vue>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../VXS/VuexStore'
import SlideVue from './vueComponent/SlideVue.vue';

export default {
  components: { SlideVue },
    name:'GunPage',
    setup() {
        const params = ref({
        });

        const methods = {

        };

        return {
            params, methods
        };
    },
}
</script>

<style>

</style>
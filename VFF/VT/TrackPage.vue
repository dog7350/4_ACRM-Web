<template>
    <div>
        <slide-vue :extName="'.png'" :imgFolderSrc="'/images/tracks/'" :imgName="'track'" :urlName="'/info/another/track'"></slide-vue>
    </div>
</template>

<script>
import {ref} from 'vue';
import SlideVue from './vueComponent/SlideVue.vue';

export default {
  components: { SlideVue },
    name:'FakeItemInfoVue',
    setup() {
        const params = ref({

        });

        const methods = {
        };

        return {
            params, methods
        }
    },
}
</script>

<style>

</style>
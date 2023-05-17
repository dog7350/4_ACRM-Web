<template>
    <div>
        <slide-vue :extName="'.jpg'" :imgFolderSrc="'/images/items/'" :imgName="'item'" :urlName="'/info/another/item'"></slide-vue>
    </div>
</template>

<script>
import {ref} from 'vue';
import SlideVue from './vueComponent/SlideVue.vue';

export default {
  components: { SlideVue },
    name:'ItemInfoVue',
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
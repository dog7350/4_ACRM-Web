<template>
    <div :id="`left-router-tab-wrapper-${props.index}`" :class="`left-router-tab-wrapper d-flex over-cursor justify-content-center align-items-center test-border border-radius-b p-2 mb-3 ${props.currentBoardType===props.emitText?'is-selected-btype':''}`"
    @click="methods.click"
    >
        <div class="mx-auto px-1 icon-size-standard">
            <i :class="params.iconSrc"></i>
        </div>

        <div class="mx-auto font-bold text-center fspm flex-grow-1" v-if="store.getters.GET_BROWSER_SIZE > 1000">
            {{params.text}}
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'

export default {
    name:'LeftStickyTabVue',
    props: {
        index: Number,
        iconSrc: String,
        text: String,
        emitText: String,
        currentBoardType: String,
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            iconSrc: props.iconSrc,
            text: props.text
        });

        const methods = {
            click: ()=>{
                context.emit("VUECALLER", {emitText: props.emitText, id: `left-router-tab-wrapper-${props.index}`});
            }
        };
        let intervals = null;
        onMounted(()=>{
            // intervals = setInterval(()=>{
            //     if($('#boardsTypeWrapper').text() === props.text){
            //         if($(`#left-router-tab-wrapper-${props.index}`).attr('class').indexOf('is-selected-btype') === -1){
            //             $(`#left-router-tab-wrapper-${props.index}`).addClass('is-selected-btype');
            //         }
            //     }
            // }, 500);
        });

        onUpdated(()=>{
            
        });

        onUnmounted(()=>{
            // clearInterval(intervals);
        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>

.left-router-tab-wrapper{
    background: black;
    transition: all 0.3s ease;
    /* min-width: 40px;
    min-height: 40px; */
}

.left-router-tab-wrapper:hover{
    background: gray;
    transition: all 0.2s ease;
}

.is-selected-btype{
    color: cornflowerblue;
}
</style>
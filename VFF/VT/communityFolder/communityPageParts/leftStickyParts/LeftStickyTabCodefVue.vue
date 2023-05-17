<template>
    <div :id="`left-router-tab-codef-wrapper-${props.index}`" v-if="store.getters.GET_IS_LOGIN"
    :class="`left-router-tab-wrapper d-flex over-cursor justify-content-center align-items-center test-border border-radius-b p-2 mb-3 ${props.current_codef === props.index? 'is-selected-codef': ''}`"
    @click="methods.click">
        <div class="mx-auto px-1 icon-size-standard">
            <i :class="params.iconSrc"></i>
        </div>

        <div class="mx-auto font-bold text-center fspm flex-grow-1" v-if="store.getters.GET_BROWSER_SIZE > 1150">
            {{params.text}}
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'

export default {
    name:'LeftStickyTabVue',
    props: {
        index: Number,
        iconSrc: String,
        text: String,
        emitText: String,
        current_codef: Number,
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
                context.emit("CODEFCALLER", {codef: props.index});
            }
        };
        let intervals = null;
        onMounted(()=>{
            // intervals = setInterval(()=>{
            //     if(store.getters.GET_IS_LOGIN){
            //         let div = $(`#left-router-tab-codef-wrapper-${props.index}`);
            //         if(store.state.currentCodef === props.index && div){
            //             if(div.attr('class').indexOf('is-selected-codef') === -1){
            //                 div.addClass('is-selected-codef');
            //             }
            //         } else if(div){
            //             if(div.attr('class').indexOf('is-selected-codef') !== -1){
            //                 $('.is-selected-codef').removeClass('is-selected-codef');
            //             }
            //         }
            //     }
            // }, 1000);
            watch(()=>props.current_codef, (after, before)=>{
                if(store.getters.GET_IS_LOGIN){
                    
                }
            });
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{
            clearInterval(intervals);
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

.is-selected-codef{
    color: Yellow;
}
</style>
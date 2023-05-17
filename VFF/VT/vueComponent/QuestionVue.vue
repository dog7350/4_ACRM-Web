<template>
    <div id="questionVueWholeWrapper" @click="methods.nononono"
     class="d-flex align-items-center justify-content-center font-size-basic" 
    :style="`position:fixed; z-index:3000; top:0; right:0 left:0; width:100%; height:100%; background: rgba(0,0,0,0);`">

        <div :class="`alert alert-primary text-align-center border-radius-e`">
            <div id="questionWrapper" class="d-flex flex-column font-size-basic font-bold">
                <div id="question fspl">
                    {{store.state.questionPayLoad.questionText}}
                </div>

                <div id="yesOrNoWrapper" class="d-flex fspm justify-content-around">
                    <div id="yesWrapper">
                        <div id="yesText" class="over-cursor border-radius-b answer-btn px-3" @click="methods.yesyesyes">
                            {{store.state.questionPayLoad.yesText}}
                        </div>
                    </div>
                    <div id="noWrapper">
                        <div id="noText" class="over-cursor border-radius-b answer-btn  px-3" @click="methods.nononono">
                            {{store.state.questionPayLoad.noText}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'

export default {
    name:'QuestionVue',
    setup() {
        const store = Store;

        const params = ref({
        });

        const methods = {
            yesyesyes: ()=>{
                store.commit('QUESTION_RESULT_IS_YES');
            },
            nononono: ()=>{
                store.commit('QUESTION_RESULT_IS_NO');
            },
        };

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>
.answer-btn{
    transition: all 0.2s linear;
}

.answer-btn:hover{
    background-color: white;
}

</style>
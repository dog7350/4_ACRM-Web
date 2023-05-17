<template>
    <div id="resultWrapper" class="container-fluid resulter my-mx-1 my-px-2 my-py-1 text-start">
        <pre v-html="params.result"/>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import AXIOS from 'axios';

export default {
    name:'RequestResultVue',
    props: {
        resultJson: JSON, filter: Array,
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        
        const params = ref({
            result: props.resultJson,
        });

        const methods = {
            filtering: ()=>{
                for(var i in props.filter){
                    params.value.result = props.filter[i](params.value.result);
                }

                params.value.result = JSON.stringify(params.value.result, null, 2);
            },
        }

        // JSON.stringify(props.resultJson, null, 2)

        onMounted(()=>{
            methods.filtering();
        });

        watch(()=>props.resultJson, ()=>{
            console.log(params.value.result, props.resultJson);
            params.value.result = JSON.stringify(props.resultJson, null, 2);
        });

        return{
            params, methods, store, props
        };
    },
}
</script>


<style scoped>
.resulter{
    border: 1px rgb(255, 255, 255) solid;
    background: rgb(44, 44, 44);
}

pre{
    margin: 0;
    overflow-x: hidden;
    white-space: pre-wrap;
    word-break: break-all;
}

#resultWrapper{
    margin-top: 1em;
    margin-right: 0;
    margin-left: 0;
}
</style>

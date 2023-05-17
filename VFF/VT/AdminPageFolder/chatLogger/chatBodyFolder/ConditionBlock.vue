<template>
    <div id="conditionBlock" 
    :class="`border-radius-b px-2 mt-2 me-2 d-flex w-auto justify-content-center align-items-center type-${props.type}`">
        <div>
            {{
            `${props.queryName}: ${props.value}`
            }}
        </div>
        <i @click="methods.delete"
        class="ms-2 bi bi-x-circle over-cursor"></i>
    </div>  
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';

export default {
    components: {  },
    props: {
        type: Number,
        queryName: String,
        value: String,
        index: Number
    },
    name:'ChatContainer',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        
        const params = ref({
            
        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
            },
            delete: ()=>{
                context.emit("DELETE", props.index);
            }
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
.type-0{
    background: black;
    border: 1px blue solid;
    color: white;
}
</style>
<template>
    <div id="" :class="`d-flex alert alert-${props.alertType} container-fluid justify-content-center text-center`">
        {{props.name}}
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'

export default {
    name:'DMTestPartVue',
    props: {
        name: String,
        alertType: String,
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
        });

        const methods = {

        };

        onMounted(()=>{

        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{

        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>

</style>
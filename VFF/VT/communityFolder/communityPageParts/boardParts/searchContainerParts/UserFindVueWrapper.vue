<template>
    <div
    id="userFindVueWrapper" 
    class="p-0">
        <transition-group name="fast-fade" mode="out-in" tag="ul" class="w-100 d-flex flex-column p-0 m-0" style="listStyle: none;">
            <li class="w-100 p-0 m-0 d-flex justify-content-center"
            v-for="item, index in store.getters.GET_SEARCH_CONTENTS" 
            :key="index">
                <user-find-vue :item="item" @CHANGEPAGE="methods.openProfile"
                ></user-find-vue>
            </li>
        </transition-group>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import UserFindVue from './UserFindVue.vue';

export default {
  components: { UserFindVue },
    name:'UserFindVueWrapper',
    props: {
        content: String
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            

        });

        const methods = {
            searchEnd: ()=>{

            },
            openProfile: (payload)=>{
                console.log(payload);
                context.emit('CHANGEPAGE', payload);
            }
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
#userFindVueWrapper{
    margin: 1vmin 0;
}

</style>
<template>
    <div id="rightStickyBarFriendsWrapper" class="d-flex flex-column" >
        <div class="text-center fspl my-2">
            친구목록
        </div>
        <right-sticky-friends-vue v-for="item, index in params.friendList" :key="index"
        :connect="item[1]" :logoPath="item[2]" :name="item[0]" :id="item[3]" @CHANGEPAGE="methods.clickUserProfile"
        ></right-sticky-friends-vue>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import AXIOS from 'axios';
import RightStickyFriendsVue from './RightStickyFriendsVue.vue';

export default {
    components: {
        RightStickyFriendsVue
    },
    name:'RightStickyFriendsWrapperVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        const io = store.getters.GET_SOCKET;
        

        const params = ref({
            friendList: [],

        });

        const methods = {
            clickUserProfile: (payload)=>{
                context.emit('CHANGEPAGE', payload);
            },
            getFriends: ()=>{
                AXIOS.get('/info/friend')
                .then((res)=>{
                    params.value.friendList = res.data.result;
                })
                .catch((error)=>{
                    console.log(error.response.data);
                });
            }
        };


        onMounted(()=>{
            params.value.friendList = [];

            methods.getFriends();
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{

        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>

</style>
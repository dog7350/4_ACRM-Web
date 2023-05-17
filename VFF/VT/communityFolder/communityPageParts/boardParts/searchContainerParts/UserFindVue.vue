<template>
    <div
    id="userFindVue" 
    class="w-100 p-0">
        <div id="searchValueWrapper" class="w-100 pm-1 test-border text-start d-flex justify-content-between over-cursor" @click="methods.openProfile">
            <div id="imgCardWrapper" class="border-radius-b">
                <img :src="props.item.logoPath?item.logoPath:'/images/board/logos/none.png'" width=40 height=40>
            </div>

            <div id="nameCardWrapper" class="flex-grow-1 d-flex align-items-center justify-content-start px-3 fspm">
                <div>
                    {{props.item.name}}
                </div>
            </div>

            <div id="alreadyIconWrapper" class="d-flex align-items-center justify-content-around fspll">
                <div v-if="!props.item.isMe">
                    <i class="bi bi-person-heart" :style="`${store.getters.GET_IS_LOGIN && Number.isInteger(props.item.alreadyFollow) && props.item.alreadyFollow===1? 'color: rgb(255, 246, 116);': ''}`"></i>
                </div>

                <div v-if="!props.item.isMe" class="px-2">
                    <i class="bi bi-person-hearts" :style="`${store.getters.GET_IS_LOGIN && Number.isInteger(props.item.alreadyFriend) && props.item.alreadyFriend===1? 'color: rgb(219, 128, 255);': ''}`"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'

export default {
    name:'UserFindVue',
    props: {
        item: JSON
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
            openProfile: ()=>{
                var payload = {

                };

                payload.isOpen = 'c';
                payload.userId = props.item.id;

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
#userFindVue{
    margin: 1vmin 0;
}

.pm-1{
    padding: 1vmin;
    margin: 1vmin 0 0 0;
}

#imgCardWrapper{
    overflow: hidden;
}
</style>
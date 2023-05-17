<template>
    <div 
    id="searchContainer" 
    class="p-0">
        
        <back-community-vue @BACKCALLER="methods.searchEnd" :content="'메인으로'" class="test-border text-start fspl font-bold is-under-head-sticky p-2 border-radius-b"
        ></back-community-vue>

        <transition name="fast-fade" mode="out-in">
            <div class="w-100 my-4 text-center d-flex justify-content-center" v-if="store.getters.GET_SEARCH_CONTENTS.length === 0 && store.getters.GET_SEARCH_STAT === 0">
                <div class="w-100 fspll font-bold">
                    검색 결과가 존재하지 않습니다.
                </div>
            </div>
            <div class="w-100" id="loadingBlock" v-else-if="store.getters.GET_SEARCH_STAT === 1">
                검색중
            </div>
            <user-find-vue-wrapper v-else-if="store.getters.GET_SEARCH_CODE === 1" @CHANGEPAGE="methods.openProfile"
            ></user-find-vue-wrapper>
            <div id="unknownCodeWrapper" class="w-100 d-flex align-items-center" v-else>
                알수없는 검색결과를 확인했습니다.
            </div>
        </transition>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import BackCommunityVue from '../BackCommunityVue.vue';
import UserFindVueWrapper from './UserFindVueWrapper.vue';

export default {
    components: { BackCommunityVue, UserFindVueWrapper },
    name:'SearchContainerVue',
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
                context.emit('CHANGEPAGE', {isOpen: 'a'});
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
#searchContainer{
    position: relative;
}

#unknownCodeWrapper{
    position: absolute;
    height: 0.5vh;
    top: 100px;
}

.is-under-head-sticky{
    position: sticky;
    top: 8.97vh;
    z-index: 10;
}

@media screen and (max-height: 900px) {
    .is-under-head-sticky{
        position: sticky;
        top: 87px;
    }
}

@media screen and (max-width: 1000px){
    .is-under-head-sticky{
        position: sticky;
        top: 87px;
    }
}

@media screen and (min-width: 1000px){
}
</style>
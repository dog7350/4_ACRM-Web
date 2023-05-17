<template>
    <div 
    id="DMRootContainerWrapper" class="d-flex justify-content-center align-items-center m-0 p-0">

        <transition name="fast-fade" mode="out-in" @after-leave="methods.closeDMVue">
            <div v-if="store.state.dmViewOn"
            @click="methods.beforeCloseDMVue" 
            id="DMRootBackground" class="over-cursor m-0 p-0">

            </div>
        </transition>

        

        <div id="DMRootContainer" class="d-flex flex-wrap justify-content-center invisible-scrollbar">
            <div id="DMHeaderWrapper" class="d-flex justify-content-around align-items-center text-center">
                <div class="w-25">
                    <span class="fspl over-cursor" @click="methods.moveTopNotifiVue">
                        <i :class="`bi bi-bell-fill ${store.state.existNotifi? 'exist':'dead'}`" ></i>
                    </span>
                </div>

                <div class="w-25">
                    <span class="fspl over-cursor" @click="methods.moveTopDMVue">
                        <i :class="`bi bi-chat-dots-fill ${store.state.dmIsAlive? 'alive': 'dead'}`" ></i>
                    </span>
                </div>

                <div class="w-25">
                    <span class="fspl over-cursor" @click="methods.moveTopQnaVue">
                        <i class="bi bi-question-circle-fill"></i>
                    </span>
                </div>

                <div class="w-25"><span class="fspll"><i class="bi bi-x over-cursor" @click="methods.beforeCloseDMVue" ></i></span></div>
            </div>
            <div id="DMContentWrapper" class="d-flex flex-wrap justify-content-center align-items-start m-0">
                <div id="NotifiRootWrapper" class="d-flex flex-wrap justify-content-center align-items-center mb-2 mx-0 border-radius-b grey-border w-100">
                    <NotifiList/>
                </div>

                <div id="DmRootWrapper" class="d-flex flex-wrap justify-content-center align-items-center mb-2 mx-0 border-radius-b grey-border w-100">
                    <DmList/>
                </div>

                <div id="QnaContents" class="d-flex flex-wrap justify-content-center align-items-center m-0 border-radius-b grey-border w-100">
                    <QnaList />
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';

import DMTestPartVue from './dmParts/DMTestPartVue.vue';
import NotifiList from './dmParts/notifiFolder/NotifiList.vue';
import DmList from './dmParts/dmFolder/DmList.vue';
import QnaList from './dmParts/dmQna/QnaList.vue';

export default {
    name:'DMVue',
    components: {
        DMTestPartVue, NotifiList, DmList, QnaList
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            index: 0
        });

        const methods = {
            closeDMVue: ()=>{
                store.commit("SET_IS_DM_VIEW", {isView: false});
            },
            beforeCloseDMVue: ()=>{
                store.commit("SET_DM_VIEW_ON", {isOn: false});
            },
            moveTopDMVue: ()=>{
                if($('#DMRootContainer') && $('#DmRootWrapper'))
                    $('#DMRootContainer').animate({scrollTop: $('#DMRootContainer').scrollTop()+$('#DmRootWrapper').offset().top}, 300);
            },
            moveTopNotifiVue: ()=>{
                if($('#DMRootContainer') && $('#NotifiRootWrapper'))
                    $('#DMRootContainer').animate({scrollTop: 0}, 300);
            },
            moveTopQnaVue: ()=>{
                if($('#DMRootContainer') && $('#QnaContents'))
                    $('#DMRootContainer').animate({scrollTop: $('#DMRootContainer').scrollTop()+$('#QnaContents').offset().top}, 300);
            },
        }

        onMounted(()=>{
            // console.log(route.fullPath);
            // console.log(route.path);
            // console.log(route.query);

            if(route.query['match']){
                console.log(`match ${route.query['match']}`);
                
                $('#dmPlayButton').click();
            } else if(store.state.dmIsAlive){
                // $('#dmPlayButton').click();
            }
        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>

#DMRootContainerWrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
}

#DMRootContainer{
    width: fit-content;
    height: fit-content;
    border: 10px black solid;
    border-radius: 10%;
    background-color: white;
    overflow: scroll;
    z-index: 1200;
}

#DMContentWrapper{
    width: 100%;
    min-height: 500px;
    padding: 20px 10px 40px 10px;
}

#DMHeader{
    margin-bottom: 1rem;
}

#DMHeaderWrapper{
    position: sticky;
    top:0;
    background: white;
    width: 100%;
    height: fit-content;
    border-bottom: 2px black solid;
    min-height: 50px;
    z-index: 50;
    padding: 1rem 0 0.5rem 0;
}

#DMContents{
    width: 100%;
    padding: 10px;
    /* box-shadow: 0px 0px 2px; */
    
}

.grey-border{
    border: 3px solid rgb(118, 118, 118);
}

#DMRootBackground{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0,0.5);
    z-index: 1100;
}

@media screen and (min-width: 1000px){
    #DMRootContainer{
        max-width: 500px;
        max-height: 800px;

        min-width: 500px;
        min-height: 500px;
    }
}

@media screen and (max-width: 1000px){
    #DMRootContainer{
        max-width: 50vw;
        max-height: 80vh;
        min-width: 320px;
        min-height: 500px;
    }
}

.alive{
    color: rgb(26, 102, 241);
}

.dead{
    color: rgb(0,0,0);
}

.exist{
    color: red;
}

</style>
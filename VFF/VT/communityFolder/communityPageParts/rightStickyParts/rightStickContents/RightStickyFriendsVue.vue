<template>
    <div id="rightStickyBarFriendsVue" class="d-flex flex-wrap justify-content-between border-radius-b">
        <div id="contentsWrapper" class="d-flex flex-wrap justify-content-between over-cursor is-have-plain-transition border-radius-b" @click="methods.friendClick">
            
            <div id="userFormWrapper" class="d-flex flew-wrap justify-content-start">
                <div id="logoWrapper" class="d-flex justify-content-start">
                    <img class="border-radius-a" id="logo" :src="props.logoPath?props.logoPath: '/images/board/logos/none.png'" alt="">
                </div>

                <div id="nameWrapper" class="d-flex flex-wrap flex-grow-1">
                    <div class="align-self-center">
                        {{props.name}}
                    </div>
                </div>
            </div>
            

            <div id="connectSignalWrapper" class="d-flex justify-content-end align-items-center">
                <!-- <div id="connectSignal" :style="`background-color:${!props.connect || props.connect === 'x'?'red':'green'};`">

                </div> -->
            </div>
        </div>

        <transition name="fast-fade" mode="out-in">
            <div id="friendInfoWrapper" class="d-flex justify-content-around text-center border-radius-a fsps" v-if="params.isClicked">
                <div id="homeViewClickerWrapper" class="d-flex justify-content-center wd-30">
                    <div id="homeViewClicker" @click="methods.clickUserProfile"
                    class="align-self-center over-cursor over-green is-have-plain-transition">
                        매치내역
                    </div>
                </div>

                <!-- <div id="matchViewClickerWrapper" class="d-flex justify-content-center wd-30">
                    <div id="matchViewClicker" @click="methods.clickUserProfile({'match': true})"
                    class="align-self-center over-cursor over-green is-have-plain-transition">
                        전적
                    </div>
                </div> -->

                <div id="dmClickerWrapper" class="d-flex justify-content-center wd-30">
                    <div @click="methods.dmClick"
                    id="dmClicker" class="align-self-center over-cursor over-green is-have-plain-transition">
                        DM
                    </div>
                </div>
            </div>
        </transition>   
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore';

export default {
    name:'RightStickyFriendsVue',
    props:{
        name:String,
        logoPath: String,
        connect: Boolean,
        id: String
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            isClicked: false

        });

        const methods = {
            friendClick: ()=>{
                params.value.isClicked = !params.value.isClicked;
            },
            clickUserProfile: (payload)=>{
                if(payload.match){
                    router.push('/main/community?match=true');
                }

                payload.isOpen = 'c';
                payload.userId = props.id;
                context.emit('CHANGEPAGE', payload);
                params.value.isClicked = !params.value.isClicked;
            },
            dmClick: ()=>{
                router.replace(`/main/community?match=true&target=${props.id}`);

                setTimeout(()=>{
                    if($('#DMActionWrapper')){
                        $('#DMActionWrapper').click();
                    }
                }, 100);
                
                params.value.isClicked = false;
            }
        };

        onMounted(()=>{
            // console.log(props);
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
#rightStickyBarFriendsVue{
    width: 100%;
    height: 100%;
    margin: 5px 0px;
}

#contentsWrapper:hover{
    background-color: rgba(255, 255, 255, 0.3);
    
}

#contentsWrapper{
    width: 100%;;
    padding: 5px 5px;
}

#logoWrapper{
    width: 30%;
    height: 100%;
    margin: 0 7px 0 0;
}

#nameWrapper{
    width: 50%;
    height: 100%;
    margin: 0;
}

#userFormWrapper{
    width: 80%;
}

#connectSignalWrapper{
    width: 20%;
    height: 100%;
    margin: 0;
}

#connectSignal{
    border-radius: 3px;;
    width: 15px;
    height: 15px;
}

img{
    width: 30px;
    height: 30px;
}

#friendInfoWrapper{
    width: 100%;
    height: fit-content;
    border: 1px rgb(26, 102, 241) solid;
    margin-top: 10px;
}

.fast-fade-enter-from, .fast-fade-leave-to{
    transform: translateY(-10%);
    opacity: 0;
}

.fast-fade-enter-active,
.fast-fade-leave-active {
  transition: all 0.2s ease;
}

.wd-30{
    width: 30%;
}

</style>
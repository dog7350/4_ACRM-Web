<template>
    <div class="container-fluid d-flex flex-column justify-content-center">
        <div v-if="params.boardsInfo === null">
            <h1>불러오는중...</h1>
        </div>
        <div v-else-if="params.boardsInfo.code !== 200">
            <h1>불러오는데 실패했습니다.</h1><hr>
            <h1>
            결과: {{params.boardsInfo.result}}<br>
            코드: {{params.boardsInfo.code}}<br>
            <button @click="methods.initCallBoardItem">다시 불러오기</button>
        </h1>
        </div>
        <div id="boardsBody" class="container-fluid mx-auto" v-else>
            <button v-if="!params.boardsInfo.result || params.boardsInfo.result.length === 0" @click="methods.initCallBoardItem">글 불러오기</button>
            <transition-group name="rpasdsadsadf" mode="out-in" tag="ul" class="d-flex flex-column p-0" id="communityTransition">
            <!-- <ul class="d-flex flex-column p-0" style="listStyle:none;" > -->
                <li v-for="board, index in params.boardsInfo.result" :key="board" v-show="board.visible">
                    
                        <read-form-vue
                        @ASDF="methods.asdf"
                        @REMOVE="methods.remove"
                        :key="index"
                        :index="board.index" 
                        :nickname="board.nickName" 
                        :title="board.title" 
                        :content="board.content" 
                        :imgPath="board.imgPath" 
                        :timeStamp="board.timeStamp"
                        :uploaderLogoPath="board.logoPath"
                        :type="board.type"
                        :isAbleModif="board.isAbleModif"
                        :recommendCount="board.recommendCount"
                        :unRecommendCount="board.unRecommendCount"
                        :viewCount="board.viewCount">
                        {{methods.changeVisible(board)}}
                        </read-form-vue>
                    
                </li>
            <!-- </ul> -->
            </transition-group>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, onUpdated, createApp } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';
import ReadFormVue from './vueComponent/community/ReadFormVue.vue';

export default {
  components: { ReadFormVue },
    name:'CommunityReadPage',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            boardsInfo: null,
            addInterVal: null,
            mountInterval: null,
            loadStatus: 0,
            transLeavePercen: {
                "--transLeavePercen": "100%",
                "list-style": "none",
            },
        });

        const methods = {
            initCallBoardItem: ()=>{
                if(params.value.loadStatus === 0){
                    params.value.loadStatus = 1;
                    params.value.boardsInfo = null;
                    AXIOS.get('/community/boards?pagesize=5')
                    .then((response)=>{
                        params.value.boardsInfo = response.data;
                        // console.log(response.data);
                    })
                    .catch((error)=>{
                        params.value.boardsInfo = error.response.data;
                        console.log(error);
                    })
                    .finally(()=>{
                        params.value.loadStatus = 0;
                    });
                }
            },
            callBoardItem: (pagesize)=>{
                if(params.value.loadStatus === 0){
                    params.value.loadStatus = 1;
                    AXIOS.get(`/community/boards?bindex=${params.value.boardsInfo.result[params.value.boardsInfo.result.length-1].index}&pagesize=${pagesize}`)
                    .then((response)=>{
                        for(var i in response.data.result){
                            params.value.boardsInfo.result.push(response.data.result[i]);
                        }

                        // console.log(params.value.boardsInfo.result);
                        params.value.loadStatus = 0;  
                    })
                    .catch((error)=>{
                        params.value.boardsInfo = error.response.data;
                        console.log(error);
                    });
                }
            },
            deBouncedCallBoardItem: null,
            changeVisible: (board)=>{
                board.visible = true;
            },
            remove: (bindex)=>{
                AXIOS.delete(`/community/board?bindex=${bindex}`)
                .then((response)=>{
                    console.log(response.data);
                    store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});

                    for(var i in params.value.boardsInfo.result){
                        if(params.value.boardsInfo.result[i].index === bindex){
                            params.value.boardsInfo.result.splice(i, 1);
                            break;
                        }
                    }
                })
                .catch((error)=>{
                    console.log(error);
                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                });
            },

        };

        onMounted(()=>{
            methods.deBouncedCallBoardItem = _.debounce(methods.callBoardItem, 500);
            setTimeout(()=>{
                methods.initCallBoardItem();
            }, 500);
            
            window.onscroll = (e)=>{
                //console.log(window.scrollY, window.innerHeight, document.body.scrollHeight);
                var scrolllllllllpercentage = parseInt((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);

                if(scrolllllllllpercentage > 97){
                    methods.deBouncedCallBoardItem(5);
                }
            };

            params.value.mountInterval = setInterval(()=>{
                params.value.transLeavePercen["--transLeavePercen"] = document.getElementById("readFormRoot")? `${document.getElementById("readFormRoot").clientWidth}px`: "100%";
                
                if(params.value.loadStatus === 0){
                    if(params.value.boardsInfo !== null && params.value.boardsInfo.result !== null){
                        for(var i = 0; i < params.value.boardsInfo.result.length; i++){
                            if(!params.value.boardsInfo.result[i].visible){
                                methods.changeVisible(params.value.boardsInfo.result[i]);
                                break;
                            }
                                
                        }
                    }
                }  
            }, 150);

            
            // document.getElementById("communityTransition").style.setProperty();
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{
            try {
                clearInterval(params.value.mountInterval);
                window.onscroll = null;
            } catch (error) {
                
            }
        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>
.rpasdsadsadf-enter-active {
    transition: all 0.5s ease;
    
}

.rpasdsadsadf-leave-active {
    transition: all 0.8s ease;
    min-width: var(--transLeavePercen);
    position: fixed;
}

.rpasdsadsadf-move{
    transition: all 1s ease;
}

.rpasdsadsadf-enter-from{
    transform: translateX(100%);
    top: 0;
    left: 0;
    bottom: 0;
    position: fixed;
    opacity: 0;
}

.rpasdsadsadf-leave-to {
    /* transform: translateY(-100%); */
    opacity: 0;
}

</style>
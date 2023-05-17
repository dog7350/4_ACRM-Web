<template>
    <div id="userProfileWrapperWrapper" 
    class="d-flex flex-wrap justify-content-center p-0">
        
        <transition name="fast-fade" mode="out-in"  @after-leave="methods.afterLeave">
            <div v-if="params.isChanged"
            :style="`background-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 49%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 100%, black), url('${params.userProfile.logoPath?params.userProfile.logoPath:'/images/board/logos/none.png'}'); background-size: 100% 100%; background-repeat: no-repeat; z-index:0;`"
            id="userProfileWrapper" class="d-flex justify-content-center border-radius-d test-border">

                <div id="userLogoWrapper" class="d-flex justify-content-center profileWrapper align-self-center">
                    <div id="logoDataFor">
                        <img id="userLogo" :src="params.userProfile.logoPath?params.userProfile.logoPath:'/images/board/logos/none.png'" alt="로고">
                    </div>
                </div>

                <div id="userProfileContentsWrapper" class="d-flex flex-wrap justify-content-center">
                    <div id="titleWrapper" class="d-flex justify-content-center profileWrapper text-center fspl font-bold px-3">
                        <div id="title">
                            {{params.userProfile.name}}
                        </div>
                    </div>
                    <div id="introduceWrapper" class="d-flex justify-content-center profileWrapper text-center fsps px-3">
                        <div id="introduce">
                            <transition name="fast-fade" mode="out-in">
                                <div class="fspl" v-if="params.userProfile.id !== store.state.myInfo.id">
                                    <transition name="fast-fade" mode="out-in">
                                        <i v-if="params.followed" 
                                        :class="`bi bi-suit-heart-fill  followed`">&nbsp;팔로우 한 유저입니다.</i>
                                        <i v-else @click="methods.debouncedFollow"
                                        :class="`bi bi-suit-heart over-cursor`">&nbsp;팔로우 하기</i>
                                    </transition>
                                </div>
                            </transition>
                        </div>
                    </div>
                    <div
                    id="variousInfoWrapper" class="d-flex justify-content-center profileWrapper text-center fspl px-3">
                        <div id="variousInfo" class="d-flex justify-content-around">
                            <div>
                                <!-- ------- -->
                            </div>
                            <div>
                                {{
                                    `유저 '${params.userProfile.name}'님의 게임 매칭 내역입니다.`
                                }}
                            </div>
                            <div>
                                <!-- ------- -->
                            </div>
                        </div>
                    </div>
                    <div id="buttonsWrapper" class="d-flex justify-content-center profileWrapper text-center fspm">
                        <!-- <div id="buttons" class="d-flex justify-content-around">
                            <div id="boardViewButton" @click="methods.changeSelectedNumber(0)"
                            :class="`w-100 is-have-plain-transition back-black over-cursor ${params.selectedNumber === 0? 'font-green font-bold': ''}`">
                                게시글
                            </div>
                            <div  id="commentViewButton" @click="methods.changeSelectedNumber(1)"
                            :class="`w-100 is-have-plain-transition back-black over-cursor ${params.selectedNumber === 1? 'font-green font-bold': ''}`">
                                댓글
                            </div>
                            <div  id="matchViewButton" @click="methods.changeSelectedNumber(2)"
                            :class="`w-100 is-have-plain-transition back-black over-cursor ${params.selectedNumber === 2? 'font-green font-bold': ''}`">
                                전적
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fast-fade" mode="out-in">
            <div id="boardsWrapper" v-if="params.selectedNumber === 0" class="test-border w-100 my-3 h-auto">

            </div>
            <div id="commentsWrapper" v-else-if="params.selectedNumber === 1" class="test-border w-100 my-3 h-auto">

            </div>
            <div id="matchHistorysWrapper" v-else-if="params.selectedNumber === 2" class="w-100 my-3 h-auto">
                <transition-group name="fast-fade" tag="ul" mode="out-in" class="d-flex flex-column p-0" style="list-style:none;">
                    <li v-for="item, index in params.matchDataList" :key="item" style="z-index:0; margin: 1vmin 0;">
                        <match-history-vue :key="index"
                        :id="item.id"
                        :logoPath="item.logoPath"
                        :matchDate="item.matchDate"
                        :name="item.name"
                        :result="item.result"
                        :resultCar="item.resultcar"
                        :resultCarNum="item.resultcarnum"
                        :resultGun="item.resultgun"
                        :resultGunNum="item.resultgunnum"
                        >{{methods.setLastIndex(index)}}</match-history-vue>
                    </li>
                </transition-group>
                <transition name="fast-fade" mode="out-in">
                    <div id="isLatMatchHistoryWrapper" class="w-100 text-center fspl font-bold test-border py-2" v-if="params.isLastMatchData">
                        <div id="isLatMatchHistory" class="w-100"> 
                            {{
                            `${params.matchDataList.length === 0?'게임 매칭 내역이 존재하지 않습니다.':'더 이상 조회할 내역이 존재하지 않습니다.'}`
                            }}
                        </div>
                    </div>
                    <div v-else-if="params.currentMatchLastCallIndex"
                    id="isMoreLatMatchHistoryWrapper" class="w-100 text-center fspl font-bold test-border py-2">
                        <div id="isMoreLatMatchHistory" class="w-100"> 
                            {{
                                `${'더보기'}`
                            }}
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';
import BackCommunityVue from '../BackCommunityVue.vue';
import MatchHistoryVue from '../MatchHistoryVue.vue';


export default {
    components: { BackCommunityVue, MatchHistoryVue },
    name:'UserProfileVue',
    props: {
        userId: String
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            userProfile: {},
            isChanged: false,
            selectedNumber: 0, followed: false,
            matchPage: 1, matchDataList: [], isLastMatchData: false, matchRequestEnd: true, currentMatchLastCallIndex: false,
        });

        const methods = {
            setLastIndex: (index)=>{
                if((index+1) >= params.value.matchDataList.length){
                    params.value.currentMatchLastCallIndex = true;
                } else{
                    params.value.currentMatchLastCallIndex = false;
                }
            },
            changeSelectedNumber:(index)=>{
                params.value.selectedNumber = index;


                
                params.value.currentMatchLastCallIndex = false;
            },
            changeUserProfile: (user_id)=>{
                if(user_id){
                    AXIOS.get(`/info/another/user?code=0&id=${user_id}`)
                    .then((res)=>{
                        params.value.userProfile = res.data.result;
                        // console.log(res.data);
                    })
                    .catch((err)=>{
                        console.log(err.response.data);
                    })
                }
            },
            followYou: ()=>{
                AXIOS.post(`/community/follow`, {followId: params.value.userProfile.id})
                .then((res)=>{
                    // console.log(res.data.result);

                    store.commit('CREATE_ALERT', {msg: res.data.result, time: 1, type:"success"});

                    methods.followcheck();
                })
                .catch((err)=>{
                    store.commit('CREATE_ALERT', {msg: err.response.data.result, time: 1, type:"danger"});
                    // console.log(err.response.data);
                })
                .finally(()=>{
                    
                });
            },
            afterLeave: ()=>{
                params.value.isChanged = true;
            },
            getMatchData: ()=>{
                if(params.value.matchRequestEnd){
                    params.value.matchRequestEnd = false;

                    if(params.value.matchPage === 1){
                        params.value.matchDataList = [];
                        params.value.isLastMatchData = false;
                    }

                    AXIOS.get(`/info/another/user?code=1&id=${props.userId}&page=${params.value.matchPage++}`)
                    .then((res)=>{
                        // console.log(res.data.result);
                        if(res.data.result.length === 0){
                            params.value.isLastMatchData = true;
                        } else{
                            params.value.matchDataList.push(...res.data.result);
                        }
                    })
                    .catch((err)=>{
                        console.log(err.response.data);
                    })
                    .finally(()=>{
                        params.value.matchRequestEnd = true;
                    });
                }
                
            },
            debouncedGetMatchData: null,
            debouncedFollow: null,
            followcheck: ()=>{
                AXIOS.get('/info/dmList')
                .then((res)=>{
                    params.value.followed = false;
                    res.data.result.follow.map((item)=>{
                        if(item.id == params.value.userProfile.id){
                            params.value.followed = true;
                        }
                    })
                })
                .catch((res)=>{
                    console.log('dmList select error');
                });}
        };

        methods.debouncedGetMatchData = _.debounce(methods.getMatchData, 1000);
        methods.debouncedFollow = _.debounce(methods.followYou, 1000);

        
        onMounted(()=>{
            if(!store.getters.GET_IS_LOGIN){
                store.commit('CREATE_ALERT', {msg: "로그인 후 이용하실 수 있습니다.", time: 1, type:"danger"});
                router.push('/main/community');
            }

            params.value.matchPage = 1;
            params.value.isChanged = true;

            watch(()=>props.userId, (after, before)=>{
                // console.log(`after: ${after}, before: ${before}`);
                params.value.isChanged = false;
                methods.changeUserProfile(props.userId);
            });

            watch(()=>params.value.selectedNumber, (after, before)=>{
                // console.log(after, before);
                if(after === 2){
                    methods.getMatchData();
                }
            });

            methods.changeUserProfile(props.userId);

            if(route.fullPath.indexOf('?match=true') !== -1){
                router.push('/main/community');

                params.value.selectedNumber = 2;
            }

            params.value.selectedNumber = 2;

            methods.followcheck();
        });


        onUpdated(()=>{

        });

        onUnmounted(()=>{

        });

        return{
            params, methods, store
        };
    }
}
</script>

<style scoped>
#buttonsWrapper{
    width: 100%;
    height: inherit;
    align-items: flex-end;
}

#buttons{
    width: 100%;
}

#variousInfoWrapper{
    width: 100%;
}

#variousInfo{
    width: 100%;
}

#userLogoWrapper{
    position: absolute;
}

#userProfileContentsWrapper{
    position: relative;
    width: 100%;
    height: 40%;
    align-content: space-between;
}

.profileWrapper{
    width: 100%;
    height: fit-content;
}

#userProfileWrapper{
    position: relative;
    margin: 1vmin 0 0 0;
    align-items: flex-end;
}

#logoDataFor{
    width: fit-content;
    height: fit-content;
    border-radius: 50%;
    border: 2px black solid;
    overflow: hidden;
}

@media screen and (max-width: 1000px) {
    #userProfileWrapperWrapper{
        width: 100%;
        min-height: 450px;
        margin: 1vmin 0 0 0;
    }

    #userProfileWrapper{
        min-height: 450px;
    }

    #userProfileContentsWrapper{
        height: 33%;
    }

    #introduceWrapper{
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    .back-black{
        padding: 0 0 5px 0;
    }
}

@media screen and (min-width: 1000px) {
    #userProfileWrapperWrapper{
        width: 100%;
        min-height: 500px;
        margin: 1vmin 0 0 0;
    }

    #userProfileWrapper{
        min-height: 500px;
    }

    #introduceWrapper{
        padding-top: 0.7rem;
        padding-bottom: 0.7rem;
    }
}



#userProfileWrapper{
    width: 100%;
    overflow: hidden;
}

#userLogo{
    width: 100px;
    height: 100px;
}

.fast-fade-enter-from, .fast-fade-leave-to{
    transform: translateY(-3%);
}

.is-under-head-sticky{
    position: sticky;
    top: 8.97vh;
    z-index: 10;
}

#boardViewButton:hover{
    background-color: rgba(255,255,255, 0.3);
}
#commentViewButton:hover{
    background-color: rgba(255,255,255, 0.3);
}
#matchViewButton:hover{
    background-color: rgba(255,255,255, 0.3);
}

#boardViewButton, #commentViewButton, #matchViewButton{
    border-top: 1px orange solid;
}

#commentViewButton{
    border-left: 1px orange solid;
    border-right: 1px orange solid;
}

.font-green{
    color: orange;
}

.back-black{
    background-color: rgba(0, 0, 0, 1);
    padding: 5px 0 5px 0;
}

.followed{
    color: yellow;
}
</style>
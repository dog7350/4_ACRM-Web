<template>
    <div id="communityRootContainer" class="container-fluid justify-content-center mx-auto mt-0 p-0 white-font">
        <div id="communityHeaderWrapper" class="m-0 is-top-sticky">
            <div id="communityHeader" class="d-flex justify-content-center test-border m-0" style="height:100%;">
                
                <div v-if="store.getters.GET_BROWSER_SIZE <= 700"  id="collapseble-home-logo" class="align-self-center">
                    <i class="bi bi-house-door over-cursor icon-size-standard over-color-trans-orange responsive-icon" @click="methods.routeUrl('/main')"></i>
                </div>

                <div v-if="store.getters.GET_BROWSER_SIZE > 700" id="community-header-logo-wrapper" style="margin:0 1vmin;" class="align-self-center text-center  left-sticky-width justify-content-center">
                    <img style="height: 90%;" class="over-cursor" @click="methods.routeUrl('/main')" src="/images/logos/segaLogo.png" alt="">
                </div>
                
                <search-value-head-vue @CHANGEPAGE="methods.changePage"
                ></search-value-head-vue>


                <div v-if="store.getters.GET_BROWSER_SIZE > 1000" id="community-header-right-wrapper" style="margin:0 1vmin;" class="d-flex align-self-center text-center right-sticky-width justify-content-around">
                    <div>
                        <i class="bi bi-person-square over-cursor icon-size-standard over-color-trans-orange responsive-icon" style="fontSize: 5vh;" @click="store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'})"></i>
                    </div>
                     
                </div> 

                

                <div v-if="store.getters.GET_BROWSER_SIZE <= 1000" id="collapseble-user-logo" class="d-flex justify-content-center align-items-center">
                    <i class="bi bi-person-square over-cursor icon-size-standard over-color-trans-orange responsive-icon" 
                    @click="store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'})"></i>
                </div>
            </div>
        </div>

        <div id="communityWrapper" class="row justify-content-center">

            <left-sticky-vue 
            :codefHelper="params.currentPayLoad.codef"
            :currentBoardType="params.currentBoardType"
            @LEFTCALLER="methods.debouncedLeftStickMethod"
            @LEFTCODEFCALLER="methods.debouncedLeftStickCodefMethod"></left-sticky-vue>

            <transition name="fast-fade" mode="out-in">
                <div v-if="params.isVisibleCommunityContainer" id="mainContainer" class="d-flex flex-column p-0 mt-0" style="height: 100%;">
                    <div id="userPostBox" class="test-border px-0" style="z-index:3;">
                        <user-post-box-vue></user-post-box-vue>
                    </div>

                    <transition name="fast-fade" mode="out-in">
                        <div id="mobileBox" class="test-border px-0 justify-content-center invisible-scrollbar" style="z-index:3;" v-if="store.getters.GET_BROWSER_SIZE <= 700 && params.currentViewIsMulti">
                            <low-width-nav-vue
                            @LISTCALLERBTYPE="methods.debouncedLeftStickMethod"
                            @LEFTCODEFCALLER="methods.debouncedLeftStickCodefMethod"
                            :currentBoardType="params.currentBoardType"
                            :currentOrderType="params.currentOrderType"
                            ></low-width-nav-vue>
                        </div>
                    </transition>
                    
                    <transition name="fast-fade" mode="out-in">
                        <div id="userBoardBackBox" class="is-under-head-sticky mt-2 px-0 fspl test-border border-radius-d" style="backgroundColor: black;" v-if="!params.currentViewIsMulti">
                            <back-community-vue :content="'뒤로가기'"
                            @BACKCALLER="methods.debouncedReturnCommunity"
                            ></back-community-vue>
                        </div>
                        <div id="listOrderBox" class="is-under-head-sticky test-border border-radius-d px-0" style="backgroundColor: black;" v-else>
                            <list-order-box-vue
                            @LISTORDERCALLER="methods.debouncedListOrderMethod"
                            :currentBoardType="params.currentBoardType"
                            :currentOrderType="params.currentOrderType"></list-order-box-vue>
                        </div>
                    </transition>

                    <transition name="fast-fade" mode="out-in">
                        <div v-if="params.currentViewIsMulti && store.getters.GET_REFRESH_ALIVE"
                        id="refreshButtonWrapper" class="fspl d-flex justify-content-center test-border border-radius-d" >
                            <i id="refreshIcon" @click="methods.refreshBoards"
                            class="bi bi-arrow-clockwise over-cursor align-self-center"></i>
                        </div>
                    </transition>

                    <transition name="fast-fade" mode="out-in">
                        <div id="boardOne" class="d-flex flex-column px-0 my-0 " style="z-index:1;" v-if="!params.currentViewIsMulti">
                            <board-box-vue
                            @BOARDS_CLICK="methods.boardChangeMultiView"
                            @BOARDS_RECOMMEND_CLICK="methods.debouncedBoardRecommendClick"
                            @CHANGEPAGE="methods.changePage"
                            :userId="params.currentBoard.uploadId"
                            :bindex="params.currentBoard.index"
                            :boardType="params.currentBoard.type"
                            :nickName="params.currentBoard.nickName"
                            :logoPath="params.currentBoard.logoPath"
                            :timeStamp="params.currentBoard.timeStamp"
                            :title="params.currentBoard.title"
                            :content="params.currentBoard.content"
                            :imgPath="params.currentBoard.imgPath"
                            :viewCount="params.currentBoard.viewCount"
                            :recommendCount="params.currentBoard.recommendCount"
                            :unRecommendCount="params.currentBoard.unRecommendCount"
                            :objectionCount="params.currentBoard.objectionCount"
                            :isAbleModif="params.currentBoard.isAbleModif"
                            :commentsCount="params.currentBoard.commentsCount"
                            :hideLevel="params.currentBoard.hideLevel"
                            :recType="params.currentBoard.recType">
                            </board-box-vue>
                        </div>
                        <div id="boardListBox" class="d-flex flex-column px-0 my-0" style="z-index:1;" v-else>
                            <transition-group name="boardsTransition" tag="ul" mode="out-in" class="d-flex flex-column p-0" style="listStyle:none;">
                                <li v-for="item, index in params.currentPayLoad.visibleBoardList" :key="item" style="z-index:0; margin: 2vmin 0;">
                                    <board-box-vue :key="index" 
                                    @CHANGEPAGE="methods.changePage"
                                    @BOARDS_CLICK="methods.debouncedCallBoardOne"
                                    @BOARDS_DELETE="methods.boardsDeleteMethod" :isMulti="true" :recType="item.recType" :userId="item.uploadId"
                                    :bindex="item.index" :boardType="item.type" :nickName="item.nickName" :logoPath="item.logoPath" :timeStamp="item.timeStamp"
                                    :title="item.title" :content="item.content" :imgPath="item.imgPath" :hideLevel="item.hideLevel"
                                    :viewCount="item.viewCount" :recommendCount="item.recommendCount" :unRecommendCount="item.unRecommendCount"
                                    :objectionCount="item.objectionCount" :isAbleModif="item.isAbleModif" :commentsCount="item.commentsCount">
                                    </board-box-vue>
                                </li>
                            </transition-group>
                        </div>
                    </transition>

                    <transition name="fast-fade" mode="out-in">
                        <div id="commentBoxWrapper" class="d-flex flex-column p-3 my-0 test-border border-radius-d" style="z-index:1;" v-if="!params.currentViewIsMulti">
                            <user-comment-write-vue v-if="!params.currentViewIsMulti"
                            @CALL_COMMENT_UPDATE="methods.debouncedCallCommentUpdate"
                            :currentBindex="params.currentBoard"
                            ></user-comment-write-vue>
                        
                            <comment-seperate-vue></comment-seperate-vue>

                            <div id="commentListBox" class="d-flex flex-column px-0 my-0" style="z-index:1;" v-if="!params.currentViewIsMulti">
                                <transition-group name="fast-fade" tag="ul" mode="out-in" class="d-flex flex-column p-0" style="listStyle:none;">
                                    <li v-for="item, index in params.currentBoardCommentPayLoad.visibleCommentsList" :key="item" style="z-index:0; margin: 1vmin 0;">
                                        <comment-box-vue :key="index"
                                        :logoPath="item.logoPath"
                                        :bindex="item.bindex"
                                        :cindex="item.cindex"
                                        :content="item.content"
                                        :hideLevel="item.hideLevel"
                                        :isAbleModif="item.isAbleModif"
                                        :nickName="item.nickName"
                                        :objectionCount="item.objectionCount"
                                        :recommendCount="item.recommendCount"
                                        :timeStamp="item.timeStamp"
                                        :unRecommendCount="item.unRecommendCount"
                                        ></comment-box-vue>
                                    </li>
                                </transition-group>
                            </div>

                            <transition name="fast-fade" mode="out-in">
                                <div id="endOfBox" class="test-border px-0" style="z-index:1; backgroundColor: black;" 
                                v-if="params.currentBoardCommentPayLoad.endOfList">
                                    <end-of-box-vue 
                                    :isMulti="params.currentViewIsMulti"
                                    ></end-of-box-vue>
                                </div>
                            </transition>
                        </div>
                    </transition>

                    <transition name="fast-fade" mode="out-in">
                        <div id="endOfBox" class="test-border px-0" style="z-index:1; backgroundColor: black;" 
                        v-if="params.currentPayLoad.endOfList">
                            <end-of-box-vue 
                            :isMulti="params.currentViewIsMulti"
                            ></end-of-box-vue>
                        </div>
                    </transition>
                </div>

                <div v-else-if="params.isVisibleSearchContainer" id="mainContainer" class="d-flex flex-column p-0 mt-0" style="height: 100%;">
                    <search-container-vue @BACKCALLER="methods.changePage" @CHANGEPAGE="methods.changePage"
                    ></search-container-vue>
                </div>

                <div v-else id="mainContainer" class="d-flex flex-column p-0 mt-0" style="height: 100%;">
                    <back-community-vue @BACKCALLER="methods.changePage" :content="'메인으로'" class="test-border text-start fspl font-bold is-under-head-sticky" style="width: 100%; padding: 1vmin 0; margin: 1vmin 0; background-color:black;"
                    ></back-community-vue>
                    <user-profile-vue :userId="params.user_id"
                    ></user-profile-vue>
                </div>
            </transition>

            <right-sticky-vue @CHANGEPAGE="methods.changePage"
            ></right-sticky-vue>

        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, onUpdated, reactive, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

import ListOrderBoxVue from './communityPageParts/boardParts/ListOrderBoxVue.vue';
import UserPostBoxVue from './communityPageParts/postManage/UserPostBoxVue.vue';
import BoardBoxVue from './communityPageParts/BoardBoxVue.vue';
import LeftStickyVue from './communityPageParts/leftStickyParts/LeftStickyVue.vue';
import RightStickyVue from './communityPageParts/rightStickyParts/RightStickyVue.vue';
import EndOfBoxVue from './communityPageParts/boardParts/EndOfBoxVue.vue';
import SearchValueHeadVue from './communityPageParts/head/SearchValueHeadVue.vue';
import LowWidthNavVue from './communityPageParts/lowWidth4LeftNavBefore/LowWidthNavVue'
import BackCommunityVue from './communityPageParts/boardParts/BackCommunityVue.vue';
import UserCommentWriteVue from './communityPageParts/postManage/UserCommentWriteVue.vue';
import CommentBoxVue from './communityPageParts/CommentBoxVue.vue';
import CommentSeperateVue from './communityPageParts/boardParts/CommentSeperateVue.vue';
import UserProfileVue from './communityPageParts/boardParts/userProfileParts/UserProfileVue.vue';
import SearchContainerVue from './communityPageParts/boardParts/searchContainerParts/SearchContainerVue.vue';

export default {
    components: { 
        ListOrderBoxVue, 
        UserPostBoxVue,
        BoardBoxVue, 
        LeftStickyVue, 
        RightStickyVue, 
        EndOfBoxVue, 
        SearchValueHeadVue, 
        LowWidthNavVue, 
        BackCommunityVue,
        UserCommentWriteVue,
        CommentBoxVue,
        CommentSeperateVue,
        UserProfileVue,
        SearchContainerVue,
    },
    name:'CommunityPage',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        
        const params = ref({
            isVisibleCommunityContainer: true,
            isVisibleSearchContainer: false,
            isVisibleUserProfile: false, user_id: null,
            tempList: [], tempUpdateBoardList: [],
            tempCommentList: [], tempUpdateCommentList: [],
            currentBoardType: '전체',
            currentOrderType: 0,
            loadStatus: 0, updateStatus: 0, isVisibleRefreshButton: store.getters.GET_REFRESH_ALIVE,
            loadCommentStatus: 0, updateCommentStatus: 0,
            searchValue: '',
            currentViewIsMulti: true,
            initList: true, isFirst: true,
            currentBoard: null,
            currentBoardCommentPayLoad: {
                bindex: null,
                pageIndex: 1,
                pageSize: 20,
                visibleCommentsList: [],

                endOfList: false, // 더이상 받아올 댓글이 존재하지 않을 때 사용 있음(false), 없음(true)
            },
            currentPayLoad: {
                pageInedx: 1,
                pageSize: 5,
                last_bIndex: -1,
                visibleBoardList: [],
                endOfList: false, // 더이상 받아올 게시글이 존재하지 않을 때 사용 있음(false), 없음(true)

                bType: 10, // 1 none, 2 humor, 3 info, 4 notice
                codef: 0, // 0 인덱스검색, 1 find nickName, 2 find Id, 3 follow search, 4 friend search, 5 follow or friend search, 6 follow and friend search
                codeo: 0, // 0 index sort, 1 recommend sort, 2 view sort, 3 boardComments sort, 4 
                findStr: '.*',
            },
        });

        const intervals = {
            listUpdateInterVal: null,
            commentListUpdateInterVal: null,
            isExistBoardListInterval: null,
        };

        const methods = {
            resetParams: ()=>{
                params.value.currentPayLoad.visibleBoardList = [];
                params.value.currentPayLoad.codef = 0;
                store.state.currentCodef = 0;
                params.value.currentPayLoad.codeo = 0;
                
                params.value.currentViewIsMulti = true;
                params.value.initList = true;
                params.value.currentBoard = null;

                params.value.currentBoardType = '전체';
                params.value.currentOrderType = 0;
                params.value.currentPayLoad.bType = 10;

                params.value.loadStatus = 0;
            },
            changePage: (payload)=>{
                if(payload.isOpen[0] === 'a') { // open community
                    params.value.isVisibleCommunityContainer = true;
                } else if(payload.isOpen[0] === 'b') { // open search
                    params.value.isVisibleSearchContainer = true;
                } else if(payload.isOpen[0] === 'c') { // open profile
                    console.log(payload);

                    params.value.isVisibleUserProfile = true;
                    params.value.user_id = payload.userId;
                }
            },
            scrollTop: ()=>{
                $('body').scrollTop(0);
            },
            routeUrl: (str)=>{
                router.push(str);
            },
            callBoardList: async ()=>{
                if(params.value.currentViewIsMulti){
                    if(params.value.loadStatus === 0 || params.value.loadStatus === 3 || params.value.loadStatus === 5){
                        if(params.value.initList){
                            params.value.initList = false;

                            $('body').scrollTop(0);

                            store.state.isRefreshAlive = false;
                            params.value.isVisibleRefreshButton = false;
                            params.value.currentPayLoad.last_bIndex = -1;
                            params.value.currentPayLoad.visibleBoardList = [];
                            params.value.currentPayLoad.endOfList = false;
                            params.value.currentPayLoad.pageInedx = 1;

                            if(!store.getters.GET_IS_LOGIN){
                                params.value.currentPayLoad.codef = 0;
                            }
                        }

                        var bIndex = null;
                        if(params.value.loadStatus === 5){
                            bIndex = params.value.currentPayLoad.visibleBoardList[0].index;
                        }

                        params.value.loadStatus = 1;

                        var baseUrl = '/community/boards?';

                        // baseUrl = `${baseUrl}bIndex=${params.value.currentPayLoad.last_bIndex}&`;
                        if(params.value.currentPayLoad.codef === 100){
                            baseUrl = `${baseUrl}&bIndex=${bIndex}&pageIndex=${1}&`;
                        } else{
                            baseUrl = `${baseUrl}pageIndex=${params.value.currentPayLoad.pageInedx++}&`;
                        }

                        
                        if(params.value.isFirst){
                            baseUrl = `${baseUrl}pageSize=${15}&`;
                        } else{
                            baseUrl = `${baseUrl}pageSize=${params.value.currentPayLoad.pageSize}&`;
                        }
                        baseUrl = `${baseUrl}bType=${params.value.currentPayLoad.bType}&`;
                        baseUrl = `${baseUrl}codef=${params.value.currentPayLoad.codef}&`;
                        baseUrl = `${baseUrl}codeo=${params.value.currentPayLoad.codeo}&`;
                        baseUrl = `${baseUrl}findStr=${params.value.currentPayLoad.findStr}`;

                        params.value.isFirst = false;

                        AXIOS.get(baseUrl)
                        .then((response)=>{
                            if(params.value.currentPayLoad.codef === 100){
                                params.value.tempUpdateBoardList = response.data.result;
                                // console.log(params.value.tempUpdateBoardList[0]);
                            } else{
                                params.value.tempList = response.data.result;
                                // console.log(params.value.tempList);
                                if(params.value.tempList.length > 0){
                                    params.value.currentPayLoad.last_bIndex = params.value.tempList[params.value.tempList.length-1].index-1;
                                } else{
                                    params.value.currentPayLoad.endOfList = true;
                                }
                            }
                        })
                        .catch((error)=>{
                            params.value.currentPayLoad.endOfList = true;
                            console.log(error);
                        })
                        .finally((data)=>{
                            params.value.loadStatus = 2;
                        });
                    }

                }
            },
            leftStickMethod: (payload)=>{
                // console.log({emitText: bName, id: `left-router-tab-wrapper-${index}`});
                if(params.value.loadStatus === 0 && params.value.currentViewIsMulti && params.value.isVisibleCommunityContainer){
                    var emitText = payload.emitText;

                    if(params.value.currentBoardType === emitText){
                        
                    } else{
                        params.value.loadStatus = 3;
                        params.value.initList = true;

                        $(`.is-selected-btype`).removeClass('is-selected-btype');

                        if(emitText === '전체'){
                            params.value.currentPayLoad.bType = 10;
                            params.value.currentBoardType = '전체';
                        } else if(emitText === '잡담'){
                            params.value.currentPayLoad.bType = 1;
                            params.value.currentBoardType = '잡담';
                        } else if(emitText === '유머'){
                            params.value.currentPayLoad.bType = 2;
                            params.value.currentBoardType = '유머';
                        } else if(emitText === '정보'){
                            params.value.currentPayLoad.bType = 3;
                            params.value.currentBoardType = '정보';
                        } else if(emitText === '공지'){
                            params.value.currentPayLoad.bType = 4;
                            params.value.currentBoardType = '공지';
                        }

                        $(`#${payload.id}`).addClass('is-selected-btype');

                        methods.debouncedCallBoardList();
                    }
                } else{
                    // params.value.isVisibleCommunityContainer = true;
                }
            },
            leftStickCodefMethod: (payload)=>{
                if(params.value.loadStatus === 0 && params.value.currentViewIsMulti && params.value.isVisibleCommunityContainer){
                    params.value.loadStatus = 3;
                    params.value.initList = true;

                    switch(payload.codef){
                        case 0: // 인덱스로 검색 - 현재 페이지로 검색
                            params.value.currentPayLoad.codef = 0;
                            params.value.currentPayLoad.last_bIndex = '.*';
                            params.value.currentPayLoad.pageInedx = 1;
                            params.value.currentPayLoad.pageSize = 1;
                        break;

                        case 1: // 닉네임으로 검색
                            params.value.currentPayLoad.codef = 1;
                            params.value.currentPayLoad.findStr = '.*';
                        break;

                        case 2: // 아이디로 검색
                            params.value.currentPayLoad.codef = 2;
                            params.value.currentPayLoad.findStr = '.*';
                        break;

                        case 3: // 팔로우한 사람
                            if(params.value.currentPayLoad.codef === 3){
                                params.value.currentPayLoad.codef = 0;
                                store.state.currentCodef = 0;
                            } else{
                                params.value.currentPayLoad.codef = 3;
                                store.state.currentCodef = payload.codef;
                            }
                        break;

                        case 4: // 친구인 사람
                            if(params.value.currentPayLoad.codef === 4){
                                params.value.currentPayLoad.codef = 0;
                                store.state.currentCodef = 0;
                            } else{
                                params.value.currentPayLoad.codef = 4;
                                store.state.currentCodef = payload.codef;
                            }
                        break;

                        case 5: // 팔로우 or 친구
                            if(params.value.currentPayLoad.codef === 5){
                                params.value.currentPayLoad.codef = 0;
                                store.state.currentCodef = 0;
                            } else{
                                params.value.currentPayLoad.codef = 5;
                                store.state.currentCodef = payload.codef;
                            }
                        break;
                    }

                    methods.debouncedCallBoardList();
                } else{
                    // params.value.isVisibleCommunityContainer = true;
                }
            },
            listOrderMethod: (payload)=>{
                if(params.value.loadStatus === 0 && params.value.currentViewIsMulti){
                    params.value.loadStatus = 3;
                    params.value.initList = true;

                    switch(payload.order){
                        case 0:
                            params.value.currentPayLoad.codeo = 0;
                        break;

                        case 1:
                            params.value.currentPayLoad.codeo = 1;
                        break;

                        case 2:
                            params.value.currentPayLoad.codeo = 2;
                        break;

                        case 3:
                            params.value.currentPayLoad.codeo = 3;
                        break;

                        case 4:
                            params.value.currentPayLoad.codeo = 4;
                        break;
                    }

                    params.value.currentOrderType = payload.order;

                    methods.debouncedCallBoardList();
                }
            },
            boardsClickMethod: (payload)=>{
                console.log(payload);
                if(params.value.currentViewIsMulti){
                    AXIOS.get(`/community/boards?bIndex=${payload.bindex}&pageSize=1`)
                    .then((response)=>{
                        // console.log(response.data);
                        $('body').scrollTop(0);
                        if(response.data.result.length > 0){
                            
                            params.value.currentBoard = reactive(response.data.result[0]);
                            params.value.currentViewIsMulti = false;
                            params.value.loadStatus = 10;

                            for(var i in params.value.currentPayLoad.visibleBoardList){
                                if(params.value.currentBoard.index === params.value.currentPayLoad.visibleBoardList[i].index){
                                    params.value.currentPayLoad.visibleBoardList[i] = params.value.currentBoard;

                                    break;
                                }
                            }
                            
                            params.value.currentBoardCommentPayLoad.bindex = params.value.currentBoard.index;
                            params.value.currentBoardCommentPayLoad.pageIndex = 1;
                            params.value.currentBoardCommentPayLoad.endOfList = false;
                            params.value.loadCommentStatus = 0;
                            params.value.tempCommentList = [];
                            params.value.currentBoardCommentPayLoad.visibleCommentsList = [];

                            methods.debouncedCallCommentList();
                        } else{

                        }
                    })
                    .catch((error)=>{
                        console.log(error.response.data);
                        params.value.currentBoard = null;
                        params.value.currentViewIsMulti = true;
                    });
                }
            },
            callCommentList: ()=>{
                // console.log(params.value.currentBoardCommentPayLoad);
                if(params.value.loadCommentStatus === 0){
                    params.value.loadCommentStatus = 1;
                    
                    var baseUrl = '/community/comments?';

                    baseUrl = `${baseUrl}bindex=${params.value.currentBoardCommentPayLoad.bindex}&`;
                    baseUrl = `${baseUrl}page=${params.value.currentBoardCommentPayLoad.pageIndex++}&`;
                    baseUrl = `${baseUrl}pagesize=${params.value.currentBoardCommentPayLoad.pageSize}&`;
                    
                    AXIOS.get(baseUrl)
                    .then((response)=>{
                        console.log(response.data.result);
                        params.value.tempCommentList = response.data.result;

                        if(params.value.tempCommentList.length > 0){

                            params.value.currentBoardCommentPayLoad.endOfList = false;
                        } else{
                            params.value.currentBoardCommentPayLoad.endOfList = true;
                        }
                    })
                    .catch((error)=>{
                        params.value.currentBoardCommentPayLoad.endOfList = true;
                        console.log(error.response.data.result);
                    })
                    .finally((data)=>{
                        params.value.loadCommentStatus = 2;
                    });
                }
            },
            changeBoardView: ()=>{
                console.log('1112233');
                // params.value.currentViewIsMulti = !params.value.currentViewIsMulti;
            },
            boardsDeleteMethod: (bindex)=>{
                const callBack = (boolStat)=>{
                    if(store.getters.GET_IS_LOGIN === false){
                        store.commit('CREATE_ALERT', {msg: '로그인이 필요한 서비스입니다.', time: 2, type:"danger"});
                        store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'})
                    }

                    if(boolStat){
                        console.log(`${bindex} 글번호 삭제를 시도하였습니다.`);

                        AXIOS.delete(`/community/board?bindex=${bindex}`)
                        .then((response)=>{
                            console.log(response.data.result);
                            store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});

                            for(var i = 0; i < params.value.currentPayLoad.visibleBoardList.length; i++){
                                if(params.value.currentPayLoad.visibleBoardList[i].index === bindex){
                                    var a = params.value.currentPayLoad.visibleBoardList.splice(i, 1);

                                    break;
                                }
                            }
                        })
                        .catch((error)=>{
                            console.log(error.response.data.result);
                            store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                        });

                    } else{
                        console.log(`${bindex} 글번호 삭제를 취소하였습니다.`);
                    }
                };

                store.commit('CREATE_QUESTION', {questionText: '해당 글을 삭제하시겠습니까?', yesText: '삭제하기', noText:'취소', method: callBack});
            },
            boardChangeMultiView: (payload)=>{
                params.value.currentBoard = null;
                params.value.currentViewIsMulti = true;
            },
            returnMultiMethods: ()=>{
                if(params.value.currentViewIsMulti === false){
                    params.value.loadStatus = 0;
                    params.value.currentViewIsMulti = true;
                    params.value.currentBoard = null;
                }
            },
            boardRecommendClick:(payload)=>{
                console.log(payload);
                if(store.getters.GET_IS_LOGIN === false){
                    store.commit('CREATE_ALERT', {msg: '로그인이 필요한 서비스입니다.', time: 2, type:"danger"});
                    store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'});
                } else{
                    if( !params.value.currentViewIsMulti &&
                        ['b', 'c'].indexOf(payload.isupdate) !== -1 &&
                        payload.index &&
                        ['o', 'x'].indexOf(payload.rtype) !== -1){
                        params.value.loadStatus = 7;

                        AXIOS.put('/community/recommend', payload)
                        .then((response)=>{
                            console.log(response.data);
                            var data = response.data;

                            if(data.result.indexOf('비추천') !== -1){
                                switch(data.teeback){
                                    case 0: // 비추천 1증가
                                        params.value.currentBoard.unRecommendCount++;
                                        params.value.currentBoard.recType = 'x';
                                    break;

                                    case 1: // 비추천 1증가, 추천 1감소
                                        params.value.currentBoard.unRecommendCount++;
                                        params.value.currentBoard.recommendCount--;
                                        params.value.currentBoard.recType = 'x';
                                    break;

                                    case 2: // 비추천 1감소
                                        params.value.currentBoard.unRecommendCount--;
                                        params.value.currentBoard.recType = null;
                                    break;
                                }
                            } else{
                                switch(data.teeback){
                                    case 0: // 추천 1증가
                                        params.value.currentBoard.recommendCount++;
                                        params.value.currentBoard.recType = 'o';
                                    break;

                                    case 1: // 추천 1증가, 비추천 1감소
                                        params.value.currentBoard.recommendCount++;
                                        params.value.currentBoard.unRecommendCount--;
                                        params.value.currentBoard.recType = 'o';
                                    break;

                                    case 2: // 추천 1감소
                                        params.value.currentBoard.recommendCount--;
                                        params.value.currentBoard.recType = null;
                                    break;
                                }
                            }
                        })
                        .catch((error)=>{
                            const respData = error.response.data;
                            console.log(respData);
                        })
                        .finally((data)=>{
                            params.value.loadStatus = 0;
                        });
                    } else{

                    }
                }
            },
            callCommentUpdate: (payload)=>{
                console.log(payload);

                var baseUrl = '/community/comments?';

                
                if(params.value.currentBoardCommentPayLoad.visibleCommentsList.length > 0){
                    baseUrl = `${baseUrl}bindex=${payload.bindex}&cindex=${params.value.currentBoardCommentPayLoad.visibleCommentsList[0].cindex}&`;
                } else{
                    baseUrl = `${baseUrl}bindex=${payload.bindex}&`;
                }

                baseUrl = `${baseUrl}page=1&`;
                baseUrl = `${baseUrl}pagesize=10&`;
                
                params.value.updateCommentStatus = 1;

                AXIOS.get(baseUrl)
                .then((response)=>{
                    params.value.tempUpdateCommentList = response.data.result;
                })
                .catch((error)=>{
                    console.log(error.response.data.result);
                })
                .finally((data)=>{
                    params.value.updateCommentStatus = 0;
                });
                
            },
            refreshBoards: ()=>{
                if(params.value.currentViewIsMulti && params.value.loadStatus === 0){
                    store.state.isRefreshAlive = false;
                    params.value.isVisibleRefreshButton = false;
                    params.value.loadStatus = 5;
                    params.value.currentPayLoad.codef = 100;

                    methods.debouncedCallBoardList();
                }
            },
            clickNotifi: ()=>{
                store.commit('OPEN_FOREGROUND', {name: 'NotifiListVue'});
                store.state.existNotifi = false;
            },
            debouncedCallBoardList: null,
            debouncedCallCommentList: null,
            debouncedLeftStickMethod: null,
            debouncedLeftStickCodefMethod: null,
            debouncedListOrderMethod: null,
            debouncedCallBoardOne: null,
            debouncedReturnCommunity: null,
            debouncedBoardRecommendClick: null,
            debouncedCallCommentUpdate: null,
        };

        methods.debouncedCallBoardList = _.debounce(methods.callBoardList, 200);
        methods.debouncedLeftStickMethod = _.debounce(methods.leftStickMethod, 200);
        methods.debouncedLeftStickCodefMethod = _.debounce(methods.leftStickCodefMethod, 200);
        methods.debouncedListOrderMethod = _.debounce(methods.listOrderMethod, 200);
        methods.debouncedCallBoardOne = _.debounce(methods.boardsClickMethod, 200);
        methods.debouncedReturnCommunity = _.debounce(methods.returnMultiMethods, 200);
        methods.debouncedCallCommentList = _.debounce(methods.callCommentList, 200);
        methods.debouncedBoardRecommendClick = _.debounce(methods.boardRecommendClick, 200);
        methods.debouncedCallCommentUpdate = _.debounce(methods.callCommentUpdate, 200);

        onMounted(()=>{
            store.state.isPopupNavigation = false;

            setTimeout(()=>{
                methods.debouncedCallBoardList();
            }, 300);

            intervals.listUpdateInterVal = setInterval(()=>{
                if(params.value.loadStatus === 2){
                    if(params.value.tempList.length > 0){
                        var shiftItem = params.value.tempList.shift();
                        params.value.currentPayLoad.visibleBoardList.push(reactive(Object.assign({}, shiftItem)));
                    }

                    if(params.value.tempList.length === 0){
                        params.value.loadStatus = 0;

                    }
                } else{
                    if(params.value.updateStatus === 0 && params.value.tempUpdateBoardList.length > 0){
                        var popItem = params.value.tempUpdateBoardList.pop();

                        params.value.currentPayLoad.visibleBoardList.unshift(Object.assign({}, popItem));

                        if(params.value.tempUpdateBoardList.length === 0){

                        }
                    }
                }

                
            }, 250);

            intervals.commentListUpdateInterVal = setInterval(()=>{
                if(params.value.loadCommentStatus === 2){
                    if(params.value.tempCommentList.length > 0){
                        var shiftItem = params.value.tempCommentList.shift();
                        params.value.currentBoardCommentPayLoad.visibleCommentsList.push(Object.assign({}, shiftItem));
                    }
                    
                    if(params.value.tempCommentList.length === 0){
                        params.value.loadCommentStatus = 0;
                    }
                } else{
                    if(params.value.updateCommentStatus === 0 && params.value.tempUpdateCommentList.length > 0){
                        var popItem = params.value.tempUpdateCommentList.pop();
                        
                        params.value.currentBoardCommentPayLoad.visibleCommentsList.unshift(Object.assign({}, popItem));
                    }
                }
            }, 250);

            window.onscroll = ()=>{
                var scrolllllllllpercentage = parseInt((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);

                if(scrolllllllllpercentage >= 99){
                    if(params.value.currentViewIsMulti){
                        methods.debouncedCallBoardList();
                    } else{
                        methods.debouncedCallCommentList();
                    }
                        
                }
            };

            
            watch(()=>store.state.isLogin, (after, before)=>{
                // console.log(after);
                if(after === false){
                    params.value.currentPayLoad.codef = 0;
                    store.state.currentCodef = 0;
                }
                params.value.initList = true;
                methods.debouncedCallBoardList();
            });

            watch(()=>params.value.isVisibleCommunityContainer, (after, before)=>{
                if(after){
                    params.value.isVisibleUserProfile = false;
                    params.value.isVisibleSearchContainer = false;

                    setTimeout(()=>{
                        methods.debouncedCallBoardList();
                    }, 300);

                    intervals.listUpdateInterVal = setInterval(()=>{
                        if(params.value.loadStatus === 2){
                            if(params.value.tempList.length > 0){
                                var shiftItem = params.value.tempList.shift();
                                params.value.currentPayLoad.visibleBoardList.push(reactive(Object.assign({}, shiftItem)));
                            }

                            if(params.value.tempList.length === 0){
                                params.value.loadStatus = 0;

                            }
                        } else{
                            if(params.value.updateStatus === 0 && params.value.tempUpdateBoardList.length > 0){
                                var popItem = params.value.tempUpdateBoardList.pop();

                                params.value.currentPayLoad.visibleBoardList.unshift(Object.assign({}, popItem));

                                if(params.value.tempUpdateBoardList.length === 0){

                                }
                            }
                        }

                        
                    }, 250);

                    intervals.commentListUpdateInterVal = setInterval(()=>{
                        if(params.value.loadCommentStatus === 2){
                            if(params.value.tempCommentList.length > 0){
                                var shiftItem = params.value.tempCommentList.shift();
                                params.value.currentBoardCommentPayLoad.visibleCommentsList.push(Object.assign({}, shiftItem));
                            }
                            
                            if(params.value.tempCommentList.length === 0){
                                params.value.loadCommentStatus = 0;
                            }
                        } else{
                            if(params.value.updateCommentStatus === 0 && params.value.tempUpdateCommentList.length > 0){
                                var popItem = params.value.tempUpdateCommentList.pop();
                                
                                params.value.currentBoardCommentPayLoad.visibleCommentsList.unshift(Object.assign({}, popItem));
                            }
                        }
                    }, 250);

                    window.onscroll = ()=>{
                        var scrolllllllllpercentage = parseInt((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);

                        if(scrolllllllllpercentage >= 99){
                            if(params.value.currentViewIsMulti){
                                methods.debouncedCallBoardList();
                            } else{
                                methods.debouncedCallCommentList();
                            }
                                
                        }
                    };
                } else{
                    methods.resetParams();
                    clearInterval(intervals.listUpdateInterVal);
                    clearInterval(intervals.commentListUpdateInterVal);
                    clearInterval(intervals.isExistBoardListInterval);
                    window.onscroll = null;
                }
            })

            watch(()=>params.value.isVisibleUserProfile, (after, before)=>{
                // console.log(after, before);
                if(after){
                    params.value.isVisibleSearchContainer = false;
                    params.value.isVisibleCommunityContainer = false;
                } else{
                    params.value.user_id = null;
                }
            });

            watch(()=>params.value.isVisibleSearchContainer, (after, before)=>{
                // console.log(after, before);
                if(after){
                    params.value.isVisibleCommunityContainer = false;
                    params.value.isVisibleUserProfile = false;
                } else{
                    // $('#mainWrapperText').val('');
                    store.commit('SEARCH_RESET'); 
                }
            })
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{

            window.onscroll = null;
            clearInterval(intervals.listUpdateInterVal);
            clearInterval(intervals.commentListUpdateInterVal);
            clearInterval(intervals.isExistBoardListInterval);
        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>
div{
    margin: 1vmin;
    /* padding: 1vmin; */
}

#scrollTopButton{
    position: fixed;
    padding: 1vmin;
    right: 5px;
    bottom: 5px;
    z-index: 6;
    background-color: rgba(255, 255, 255, 0.5);
}

.is-top-sticky{
    position: sticky;
    top: 0;
}

.is-under-head-sticky{
    position: sticky;
    top: 8.97vh;
    z-index: 10;
}

.set-min-height-4-nav{
    min-height: 35px;
}

#communityHeaderWrapper{
    box-sizing: content-box;
    height: 67.823px;
    margin-top: 0;
    margin-bottom: 0;
    background-color: black;
    padding-bottom: 40px;
    z-index: 9;
}

#mainContainer > div{
    padding: 1vmin;
}

#mobileBox{
    overflow: scroll;
}

@media screen and (max-height: 900px) {
    .is-under-head-sticky{
        position: sticky;
        top: 87px;
    }
}

@media screen and (max-width: 1000px){
    #communityHeaderWrapper{
        box-sizing: content-box;
        height: 67.83px;
        padding-bottom: 40px;
    }

    .is-under-head-sticky{
        position: sticky;
        top: 87px;
    }

    .responsive-icon{
        font-size: 48.5px;
    }
}

@media screen and (min-width: 1000px){

}

/* 
    트랜지션
*/

.loadingTransition-enter-active,
.loadingTransition-leave-active,
.boardsTransition-enter-active{
    transition: all 0.3s ease;
}

.boardsTransition-leave-active{
    transition: all 0.3s ease;
}

.boardsTransition-move{
    transition: all 0.3s ease;
}

.boardsTransition-enter-from{
    opacity: 0;
}

.boardsTransition-leave-to{
    opacity: 0;
}


.multipleBoardList-enter-from, .multipleBoardList-leave-to{
    opacity: 0;
}

.multipleBoardList-enter-active, .multipleBoardList-leave-active{
    transition: all 0.3s ease;
}

#collapseble-user-logo{
    position: relative;
}



</style>
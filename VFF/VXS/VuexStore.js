import Vuex from 'vuex';
import AXIOS from 'axios';
import _ from 'lodash'

export default new Vuex.Store({
    state: {
        // 로그인 상태, 권한, 
        isLogin: false, auth: null /*  'o' - login, 'x' - not login, '?' - verify fail */,
        // 현재정보
        myInfo:null,
        // 앞배경 띄울지에 대한 변수
        isPopup: false,
        // 내비게이션 변수
        isPopupNavigation: true,
        // 경고창 띄울지에 대한 변수, 메시지, 기본 경고 시간
        isAlert: false, alertMsg: '', defaultAlertTime: 1.5, alertTimeOut: null,
        imgMsg: [],
        isLoading: false,
        currentForeGroundComponent: null,
        currentNavigationComponent: null,
        loadedComponent: {},
        mainNavPadding: 0,
        browserSize: 0,
        browserHeight: 0,
        currentCodef: 0, isRefreshAlive: true,
        questionResult: null,
        questionPayLoad: null,
        questionOver: 0,
        modifyForm: {

        },
        currentVideoFrame: '',
        currentAdminActionList: [], socket: null,
        searchContents: [], currentSearchCode: 0, searchStat: 0, latestSearchOption: {},
        objectionIndex: -1, isObjectionBoard: true, existNotifi: false, notifiList: ['hello world'],
        isViewDm: false, dmViewOn: false, dmIsAlive: false, chatList: [], targetId: '', currentShopStat: 0,
        goodsInfo: {},  forcedReqPrice: null, lastBuyBodyValue: null,
        goodsNumber: null, goodsValue: null, goodsAddress: null, socketListen: null, nextUrl: null, realPrice: 0,
    },

    mutations: {
        LOGIN_CHECK: async (state, payload)=>{ // 로그인 정보 업데이트
            let response = null;
            let result = null;
            try{
                response = await AXIOS.post('/checkToken');
                result = response.data;
            }
            catch(error){
                result = error.response.data;
            }

            state.auth = result.result.loginValid;
            state.isLogin = result.result.loginStatus;

            if(state.isLogin){
                try{
                    response = await AXIOS.get('/info/base');
                    result = response.data.result;
                }
                catch(error){
                    result = error.response.data;
                }
            }
            state.myInfo = result;
        },
        UPDATE_INFO: async (state)=>{
            let response = null;
            let result = null;
            
            if(state.isLogin){
                try{
                    response = await AXIOS.get('/info/base');
                    result = response.data.result;
                }
                catch(error){
                    result = error.response.data;
                }
            }
            state.myInfo = result;
        },
        ADD_COMPONENT: (state, payload)=>{ // 특정이름으로 컴포넌트 추가
            state.loadedComponent[payload.name] = payload.component;
            // console.log(`add success, name: ${payload.name}, component: ${payload.component}`);
        },
        OPEN_BASE_FOREGROUND: (state)=>{ // 앞배경 열기
            $('body').addClass('scroll-lock');
            state.isPopup = true;
        },
        CLOSE_BASE_FOREGROUND: (state)=>{ // 앞배경 닫기
            $('body').removeClass('scroll-lock');
            state.isPopup = false;
        },
        OPEN_FOREGROUND:(state, payload)=>{ // 특정 컴포넌트를 이용한 앞배경 열기
            $('body').addClass('scroll-lock');
            state.isPopup = true;

            if(payload != null && payload.name != null && payload.name != undefined)
                state.currentForeGroundComponent = payload.name;
        },
        CLOSE_FOREGROUND:(state, payload)=>{ // 앞 배경 닫기 컴포넌트 이름을 보내지 않으면 현재 노출할 컴포넌트를 비워버림
            $('body').removeClass('scroll-lock');
            state.isPopup = false;

            if(payload == null || payload.name == null || payload.name == undefined)
                state.currentForeGroundComponent = null;
        },
        CHANGE_FOREGROUND_COMPONENT: (state, payload)=>{ // 현재 컴포넌트 바꾸기
            state.currentForeGroundComponent = payload.name;
        },
        CHANGE_NAVIGATION_COMPONENT: (state, payload)=>{ // 현재 내비게이션 바꾸기
            state.currentNavigationComponent = payload.name;
        },
        CREATE_ALERT: _.debounce(function (state, payload){ // 경고창 노출 시키기
            if(state.isAlert == false){ // 노출되고 있는 동안에는 추가 생성금지
                state.isAlert = true;
                state.alertMsg = payload;

                state.alertTimeOut = setTimeout(()=>{ // 시간 지정 시 지정한 시간만큼 경고창 유지
                    state.isAlert = false;
                    state.alertMsg = null;
                }, 1000*(payload.time? payload.time: state.defaultAlertTime));
            }
        }, 300),
        REMOVE_ALERT: (state)=>{ // 노출된 경고창 지우기
            if(state.alertTimeOut){
                let timeOut = state.alertTimeOut;
                state.alertTimeOut = null;

                try{
                    clearTimeout(timeOut);
                    state.isAlert = false;
                    state.alertMsg = null;
                }
                catch(error){
                    console.log(error);
                }
            }
        },

        CREATE_LOADING: _.debounce(function (state){ // 로딩창 생성
            if(state.isLoading == false){ // 
                state.isLoading = true;

                // setTimeout(()=>{
                //     state.isLoading = false;
                // }, 1000);
            }
        }, 300),

        REMOVE_LOADING: _.debounce(function (state){ // 로딩창 제거
            if(state.isLoading == true){
                state.isLoading = false;
            }
        }, 300),

        MODIFY_READY: (state, payload)=>{
            state.modifyForm = payload;
        },
        CREATE_QUESTION: (state, payload)=>{
            if(state.questionOver === 0){
                state.questionOver = 1;
                $('body').addClass('scroll-lock');
                state.questionPayLoad = payload;
                state.currentForeGroundComponent = 'QuestionVue';
                state.isPopup = true;
            }
        },
        QUESTION_RESULT_IS_YES: async (state)=>{
            if(state.questionOver === 1){
                $('body').removeClass('scroll-lock');
                state.isPopup = false;
                state.questionResult = true;
                state.questionOver = 2;

                if(state.questionPayLoad.method){
                    try{
                        await state.questionPayLoad.method(true);
                    } catch(error){
                        console.log(error);
                    }
                } else{
                    console.log("yes but method isn't exist");
                }
                state.questionOver = 0;
            }
        },
        QUESTION_RESULT_IS_NO: async (state)=>{
            if(state.questionOver === 1){
                $('body').removeClass('scroll-lock');
                state.isPopup = false;
                state.questionResult = false;
                state.questionOver = 2;

                if(state.questionPayLoad.method){
                    try{
                        await state.questionPayLoad.method(false);
                    } catch(error){
                        console.log(error);
                    }
                } else{
                    console.log("no but method isn't exist");
                }
                state.questionOver = 0;
            }
        },
        CHANGE_VIDEO: (state, payload)=>{
            state.currentVideoFrame = payload;
        },
        ADD_ADMIN_ACTION: (state, payload)=>{

        },
        REGIST_SOCKET: (state, payload)=>{
            state.socket = payload.socketio;
        },
        SEARCH_USER: (state, payload)=>{
            if(state.searchStat === 0){

                if(state.searchStat !== payload.searchCode){
                    state.searchContents = [];
                }

                state.currentSearchCode = payload.searchCode;

                if(payload.searchCode === 1){
                    state.searchStat = 1;
                    
                    AXIOS.get(`/community/user?userName=${payload.userName? payload.userName: ''}&page=${payload.page? payload.page: 1}&pageSize=${payload.pageSize? 100: 100}`)
                    .then((res)=>{
                        console.log(res.data);
                        state.searchContents = res.data.result;
                    })
                    .catch((err)=>{
                        console.log(err.response.data);
                    })
                    .finally((data)=>{
                        state.searchStat = 0;
                    });
                } 
            }
        },
        SEARCH_RESET: (state, payload)=>{
            state.searchContents = [];
            state.currentSearchCode = 0;
        },
        SET_OBJECTION_TARGET: (state, payload)=>{
            state.objectionIndex = payload.index;
            state.isObjectionBoard = payload.isObjectionBoard;
        },
        SET_IS_DM_VIEW: (state, payload)=>{
            state.isViewDm = payload.isView;

            if(!state.isViewDm){
                $('body').removeClass('scroll-lock');
            }
        },
        SET_DM_VIEW_ON: (state, payload)=>{
            state.dmViewOn = payload.isOn;

            if(state.dmViewOn){
                $('body').addClass('scroll-lock');
            }
        },
        SET_EXIST_NOTIFI: (state, payload)=>{
            state.existNotifi = payload.removeNotifi;
        },
        SET_GOODS_INFO: (state, payload)=>{
            state.goodsInfo = payload.goodsInfo;
        },
        SET_FORCED_REQ_PRICE: (state, payload)=>{
            state.forcedReqPrice = payload.forcedReqPrice;
        },
        SET_LAST_BUY_BODY_PRODUCT: (state, payload)=>{
            state.lastBuyBodyValue = payload.lastBuyBodyValue;
        },
        SET_GOODS_NUMBER: (state, payload)=>{
            state.goodsNumber = payload.goodsNumber;
        },
        SET_GOODS_VALUE: (state, payload)=>{
            state.goodsValue = payload.goodsValue;
        },
        SET_GOODS_ADDRESS: (state, payload)=>{
            state.goodsAddress = payload.goodsAddress;
        },
        SET_SOCKET_LISTEN: (state, payload)=>{
            state.socketListen = payload.socketListen;
        },
        SET_NEXT_URL: (state, payload)=>{
            state.nextUrl = payload.nextUrl;
        },
    },

    actions: {

    },

    getters: {
        GET_IS_LOGIN: (state)=>{ // 로그인 여부 가져오기
            return state.isLogin;
        },
        GET_MY_INFO: (state)=>{ // 로그인 상태면 현재 정보 가져오기
            return state.isLogin? state.myInfo: null;
        },
        GET_AUTH: (state)=>{ // 권한 가져오기
            return state.auth;
        },
        GET_SOCKET: (state)=>{
            return state.socket;
        },
        GET_POPUP_STATE: (state)=>{ // 앞배경 띄울지 여부 가져오기
            return  state.isPopup;
        },
        GET_FOREGROUND_COMPONENT: (state)=>{ // 현재 앞배경 컴포넌트 가져오기
            return state.loadedComponent[state.currentForeGroundComponent];
        },
        GET_NAVIGATION_COMPONENT: (state)=>{ // 현재 내비게이션 컴포넌트 가져오기
            return state.loadedComponent[state.currentNavigationComponent];
        },
        GET_CURRENT_FOREGROUND_NAME: (state)=>{ // 현재 앞배경 컴포넌트 이름 가져오기
            return state.currentForeGroundComponent;
        },
        GET_CURRENT_NAVIGATION_NAME: (state)=>{ // 현재 내비게이션 이름 가져오기
            return state.currentNavigationComponent;
        },

        GET_IS_ALERT: (state)=>{ // 경고창 띄울지 여부 가져오기
            return state.isAlert;
        },
        GET_ALERT: (state)=>{ // 경고창 컴포넌트 가져오기
            return state.loadedComponent["AlertVue"];
        },

        GET_IS_LOADING: (state)=>{ // 로딩창 띄울지 여부 가져오기
            return state.isLoading;
        },
        GET_LOADING: (state)=>{ // 로딩창 컴포넌트 가져오기
            return state.loadedComponent["LoadingVue"];
        },

        GET_BROWSER_SIZE: (state)=>{
            return state.browserSize;
        },

        GET_BROWSER_HEIGHT: (state)=>{
            return state.browserHeight;
        },

        GET_IS_MOBILE: (state)=>{
            return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
        },

        GET_VIEDO_IFRAME: (state)=>{
            return state.currentVideoFrame;
        },
        GET_REFRESH_ALIVE: (state)=>{
            return state.isRefreshAlive;
        },
        GET_SEARCH_CODE: (state)=>{
            return state.currentSearchCode;
        },
        GET_SEARCH_CONTENTS: (state)=>{
            return state.searchContents;
        },
        GET_SEARCH_STAT: (state)=>{
            return state.searchStat;
        },
        GET_NOTIFI_STAT: (state)=>{
            return [state.existNotifi, state.notifiList];
        },
        GET_IS_DM_VIEW: (state)=>{
            return state.isViewDm;
        },
        GET_FORCED_REQ_PRICE: (state)=>{
            return state.forcedReqPrice;
        },
        GET_LAST_BUY_BODY_PRODUCT: (state)=>{
            return state.lastBuyBodyValue;
        },
        GET_SOCKET: (state)=>{
            return state.socket;
        },
        GET_GOODS_NUMBER: (state)=>{
            return state.goodsNumber;
        },
        GET_GOODS_VALUE: (state)=>{
            return state.goodsValue;
        },
        GET_GOODS_ADDRESS: (state)=>{
            return state.goodsAddress;
        },
        GET_SOCKET_LISTEN: (state)=>{
            return state.socketListen;
        },
        GET_NEXT_URL: (state)=>{
            return state.nextUrl;
        },
    }
});
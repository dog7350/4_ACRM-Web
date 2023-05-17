<template>
    <div id="item-box-wrapper" class="container-fluid justify-content-center white-font border-radius-d test-border user-card mx-auto pt-3 pb-1">
        <div class="user-card-head-wrapper container-fluid mt-2 px-0">
            <div class="d-flex">
                <div class="user-card-head-logo d-flex align-item-center mx-1">
                    <img class="user-logo-img my-auto rounded-circle over-cursor" @click="methods.openProfile"
                    :src="params.logoPath? params.logoPath: '/images/board/logos/none.png'" @error="(e)=>{e.target.src='/images/board/logos/none.png'}" alt="로고이미지">
                </div>

                <div class="user-card-head-name-wrapper flex-grow-1 text-start align-self-start d-flex flex-column mx-1" style="height:100%;">
                    <div class="user-card-board-number px-1 fsps">
                        {{params.bindex}}
                    </div>
                    <div class="user-card-head-name px-1 fspm font-bold" style="fontFamily:'gojungame';">
                        {{params.nickName}}
                    </div>
                    <div class="user-card-head-info px-1 fsps">
                        <span v-html="params.boardType > 0?iconJson[params.boardType]: `<i class='bi bi-x-circle'></i>`"></span>&nbsp;•
                        <span>{{params.timeStamp}}</span>
                    </div>
                </div>

                <div class="user-card-head-tag mx-1">
                    <a :id="`gearFocuser${params.bindex}${params.isMulti?'':'one'}`" href="#" @click.prevent="methods.aclickdel">
                    <div @mousedown="methods.gearClick" class="over-cursor over-cursor-rotate-half-n-half is-have-plain-transition" style="width:auto; height:auto;">
                        <i id="boardManageGear" class="bi bi-gear over-cursor"></i>
                    </div>
                    </a>
                    <div id="manageList" class="" v-if="params.manageVisible">
                        <table class="table table-striped fspss" style="width:auto; backgroundColor: white; minWidth:40px;">
                            <tbody>
                                <tr>
                                    <td class="over-cursor-pointer-background" @mousedown="methods.modifyBoard">
                                        <i class="bi bi-eraser">수정</i>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="over-cursor-pointer-background" @mousedown="methods.deleteBoard">
                                        <i class="bi bi-pen">삭제</i>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="over-cursor-pointer-background" @mousedown="methods.objectBoard">
                                        <i class="bi bi-telephone-minus">신고</i>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div :class="`user-card-body-wrapper container-fluid d-flex flex-column mt-3 px-0 ${params.isMulti?'over-cursor':''}`">
            <div class="user-card-body-title fspm font-bold"  @click="methods.contentsClick">
                {{params.title}}
            </div>
            
            <div :class="`user-card-body-content fspm ${params.isMulti?'over-cursor':''}`" v-if="params.isMulti"  @click="methods.contentsClick">
                {{params.content}}
            </div>

            <div class="fspm" v-else v-html="params.content" @click="methods.contentsClick">
            </div>



            <div id="imgSrcListWrapper" class="user-card-body-img d-flex justify-content-around align-items-center" v-if="params.imgPath.length > 0">
                <div v-for="imgSrc, index in params.imgPath" :key="imgSrc" :style="`width:${(100/params.imgPath.length)-2}%; height: auto;`"
                class="">
                    <img 
                    onerror="this.alt=`사진을 찾지 못했습니다.`;this.src=`/images/board/logos/none.png`;"
                    :id="`${params.nickName}${params.bindex}${index}`" class="border-radius-c over-cursor align-self-center is-community-img"
                    :src="imgSrc" @click="methods.scaleUp(`${params.nickName}${params.bindex}${index}`, index)">
                </div>
            </div>
        </div>

        <div class="user-card-tail-wrapper container-fluid my-2 px-0 pt-1">
            <div class="user-card-tail-info px-1 fspm d-flex justify-content-around">
                
                <div :class="`${!params.isMulti?'over-cursor over-blue is-have-fast-transition': ''}`">
                    <i :class="`bi bi-chat-square-dots-fill`"></i> {{props.commentsCount}}
                </div>
                
                <div>
                    <i :class="`bi bi-eye`"></i> {{params.viewCount}}
                </div>
                
                <!-- @mouseover="methods.recommendOver"
                @mouseout="methods.recommendOut" -->

                <div id="recommendIcon"
                @click="methods.recommendBoard('o')"
                :class="`${!params.isMulti?`over-cursor ${props.recType === 'o'?'font-green':'over-green'} is-have-fast-transition`: `${store.getters.GET_IS_LOGIN && props.recType === 'o'?'font-green':''}`}`">
                    <i :class="`bi bi-hand-thumbs-up-fill`"></i> {{props.recommendCount}}
                </div>
                
                <!-- @mouseover="methods.unRecommendOver"
                @mouseout="methods.unRecommendOut" -->

                <div id="unRecommendIcon"
                @click="methods.recommendBoard('x')"
                :class="`${!params.isMulti?`over-cursor ${props.recType === 'x'?'font-red':'over-red'} is-have-fast-transition`: `${store.getters.GET_IS_LOGIN && props.recType === 'x'?'font-red':''}`}`">
                    <i :class="`bi bi-hand-thumbs-down-fill`"></i> {{props.unRecommendCount}}
                </div>
                
                <div v-if="['o', 'm'].indexOf(store.getters.GET_AUTH) !== -1" v-html="`<i class='bi bi-exclamation-lg'></i> ${params.objectionCount}`">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'

const yyyymmdd_HHMMSS = (dateTime)=>{
    let result = 'yyyy-mm-dd HH:MM:ss';
    try{
        var timeZone = new Date(dateTime);
        var time = timeZone.toString().split(' ')[4];
        var date = null;

        var year = timeZone.getFullYear();
        var month = timeZone.getMonth()+1;
        var day = timeZone.getDate();

        date = `${year}-${("00"+month.toString()).slice(-2)}-${("00"+day.toString()).slice(-2)}`;
        result = date + ' ' + time;
    }
    catch(error){
        console.log(error);
    }

    return result;
}

export default {
    name:'BoardBoxVue',
    props:{
        userId: String,
        bindex: Number,
        logoPath: String,
        nickName: String, 
        boardType: Number,
        timeStamp: Number,
        title: String,
        content: String,
        imgPath: String,
        viewCount: Number,
        recommendCount: Number,
        unRecommendCount: Number,
        commentsCount: Number,
        objectionCount: Number,
        isAbleModif: Boolean,
        isMulti: Boolean,
        recType: String,
        hideLevel: Number,
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            bindex: props.bindex,
            logoPath: props.logoPath? props.logoPath: false,
            nickName: props.nickName, 
            boardType: props.boardType,
            timeStamp: yyyymmdd_HHMMSS(props.timeStamp),
            title: Base64.decode(props.title),
            content: Base64.decode(props.content),
            imgPath: props.imgPath? props.imgPath: '',
            viewCount: props.viewCount,
            recommendCount: props.recommendCount,
            unRecommendCount: props.unRecommendCount,
            commentsCount: props.commentsCount,
            objectionCount: props.objectionCount !== null? props.objectionCount: null,
            isAbleModif: props.isAbleModif? props.isAbleModif: false,
            manageVisible: false,
            isMulti: props.isMulti,
            recType: props.recType,
        });

        // console.log(params.value.objectionCount);

        const iconJson = [
            '',
            '<i class="bi bi-chat-dots"></i>',
            '<i class="bi bi-emoji-laughing"></i>',
            '<i class="bi bi-boombox"></i>',
            '<i class="bi bi-broadcast-pin"></i>'
        ];

        if(params.value.imgPath){
            params.value.imgPath = props.imgPath.split('c3BhY2VcdA==');

            if(!(params.value.imgPath[0].trim().length > 0)){
                params.value.imgPath = [];
            }
        }

        const methods = {
            openProfile: ()=>{
                var temp = {};

                temp.userId = props.userId;
                temp.isOpen = 'c';

                context.emit('CHANGEPAGE', temp);
            },
            scaleUp: (id, currentIndex)=>{
                var currentClass = $(`#${id}`);
                var currentHaveClass = currentClass.attr("class");
                
                store.state.imgMsg = [params.value.imgPath, currentIndex];
                store.commit('OPEN_FOREGROUND', {name: 'ImgScaleUpVue'});
            },
            contentsClick: ()=>{
                if(params.value.isMulti){
                    if(params.value.isMulti){
                        params.value.viewCount++;
                    }

                    context.emit("BOARDS_CLICK", {bindex: params.value.bindex});
                }
            },
            deleteBoard: ()=>{
                if(store.getters.GET_IS_LOGIN === false){
                    store.commit('CREATE_ALERT', {msg: '로그인이 필요한 서비스입니다.', time: 2, type:"danger"});
                    store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'});
                } else{
                    context.emit("BOARDS_DELETE", params.value.bindex);
                }
            },
            recommendBoard: (rtype)=>{
                context.emit("BOARDS_RECOMMEND_CLICK", {index: params.value.bindex, isupdate: 'b', rtype: rtype});
            },
            aclickdel: ()=>{

            },
            modifyBoard: ()=>{
                if(store.getters.GET_IS_LOGIN === false){
                    store.commit('CREATE_ALERT', {msg: '로그인이 필요한 서비스입니다.', time: 2, type:"danger"});
                    store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'});
                }
                else{
                    store.commit("CHANGE_FOREGROUND_COMPONENT", {name:'ModifyFormVue'});
                    store.commit("MODIFY_READY", {
                        title: params.value.title,
                        content: params.value.content,
                        type: params.value.boardType,
                        hideLevel: props.hideLevel,
                        imgPath: params.value.imgPath,
                        index: params.value.bindex,
                    });
                    store.commit("OPEN_FOREGROUND");
                }
            },
            objectBoard: ()=>{
                if(store.getters.GET_IS_LOGIN === false){
                    store.commit('CREATE_ALERT', {msg: '로그인이 필요한 서비스입니다.', time: 2, type:"danger"});
                    store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'});
                }
                else{
                    store.commit("CHANGE_FOREGROUND_COMPONENT", {name:'ObjectionFormVue'});
                    store.commit("SET_OBJECTION_TARGET", {
                        index: params.value.bindex,
                        isObjectionBoard: true,
                    });
                    store.commit("OPEN_FOREGROUND");
                }
            },
        };

        onMounted(()=>{
            params.value.manageVisible = false;
            // console.log(params.value.bindex, params.value.isMulti, props.isMulti);
            // console.log(props);
            setTimeout(()=>{
                if(document.getElementById(`gearFocuser${params.value.bindex}${params.value.isMulti?'':'one'}`)){
                    document.getElementById(`gearFocuser${params.value.bindex}${params.value.isMulti?'':'one'}`).onfocus=()=>{
                        params.value.manageVisible = true;
                    };

                    document.getElementById(`gearFocuser${params.value.bindex}${params.value.isMulti?'':'one'}`).onblur=()=>{
                        params.value.manageVisible = false;
                    };
                }
            }, 150);
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{
            if(params.value.isMulti){
                
                if(document.getElementById(`gearFocuser${params.value.bindex}${params.value.isMulti?'':'one'}`)){
                    document.getElementById(`gearFocuser${params.value.bindex}${params.value.isMulti?'':'one'}`).onfocus = null;
                    document.getElementById(`gearFocuser${params.value.bindex}${params.value.isMulti?'':'one'}`).onblur = null;
                }
            }
        });

        return{
            params, methods, store, iconJson, props,
        };
    },
}
</script>

<style scoped>
a, a:hover, a:focus{
    text-decoration: none;
    color: white;
}

.over-cursor-pointer-background:hover{
  cursor: pointer;
  background: rgba(0, 0, 0, 0.3);
}

#manageList{
    position: absolute;
    margin:0 0 0 1rem;
}

#imgSrcListWrapper{
    margin: 2vmin 0 2vmin 0;
}

.is-community-img{
    width:100%;
    height: auto;
    transition: all 1s;
}

#item-box-wrapper{
    /* border-radius: 5px; */
    margin: 0 0 1vmin 0;
}

.user-card-body-content{
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    word-break: break-all;
    line-height: 1.8;
    overflow: hidden;
    text-overflow: ellipsis;
}


</style>
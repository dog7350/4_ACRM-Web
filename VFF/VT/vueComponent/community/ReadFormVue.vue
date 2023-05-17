<template>
    <div id="readFormRoot" class="container-fluid d-flex flex-column pt-3 my-3 mx-auto"
    :style="`background: rgb(204, 235, 255); width: 100%; height: auto; min-width:200px; marginLeft: 0; marginRight: 0;`">
    
        <div class="row">
            <div id="logoRow" class="col-sm-12 container-fluid">
                <img :src="params.logoPath?params.logoPath:`/images/board/logos/none.png`"
                @error="'/images/board/logos/none.png'"
                :style="`width: ${store.getters.GET_BROWSER_SIZE/20}px; height: auto;`">
                <div>
                    <span v-if="params.type === 1">NONE</span>
                    <span v-else-if="params.type === 2">HUMOR</span>
                    <span v-else-if="params.type === 3">INFO</span>
                    <span v-else-if="params.type === 4">NOTICE</span>
                    <span v-else>?????</span>
                </div>
                <div>글쓴이: {{params.nickname}}</div>
                <div>올린 시간: {{params.timeStamp}}</div>
                <div>인덱스: {{params.index}}</div>
                <button v-if="params.isAbleModif" @click="methods.modify">수정</button>
                <button v-if="params.isAbleModif" @click="methods.removeContent">삭제</button>
                <button @click="methods.recommend">추천</button>
                <button @click="methods.unRecommend">비추천</button>
            </div>
        </div>

        <div class="row" @click="methods.print">
            <div id="titleRow" class="col-sm-12 container-fluid">
                <div>제목: {{params.title}}</div> 
            </div>
        </div>

        <div class="row">
            <div id="viewNrecommendRow" class="col-sm-12 container-fluid">
                <div>조회수: {{params.viewCount}}</div>
                <div>추천수: {{params.recommendCount}}</div>
                <div>비추천수: {{params.unRecommendCount}}</div>
            </div>
        </div>

        <div class="my-3 d-flex">
            <input 
            :class="`btn ${!params.isContentView? 'btn-primary': 'btn-danger'} flex-grow-1`" 
            type="button" 
            :value="params.isContentView? '닫기': '보기'"
            @click="methods.print">
        </div>

        <transition-group name="print-fade" mode="out-in">
            <div class="row" v-if="params.isContentView">
                <div id="content" class="col-sm-12 container-fluid">
                    <div>내용:</div>
                    <div v-html="params.content"></div>
                </div>
            </div>
        </transition-group>

        <transition-group name="print-fade" mode="out-in" >
            <div class="d-flex justify-content-around" v-if="params.isContentView">
                <div id="content"  v-for="imgPath in params.imgPath" :key="imgPath.id">
                    <img :src="imgPath" :style="`width: ${store.getters.GET_BROWSER_SIZE/10}px; height: auto;`" v-if="imgPath !== ''">
                </div>
            </div>  
        </transition-group>
        
        <transition-group name="comment-fade" mode="out-in" tag="ul" :style="params.transLeavePercen" class="mx-auto container-fluid">
            <div class="row" v-if="params.isContentView">
                <div class="col-sm-12 container-fluid">
                    댓글
                </div>
            </div>

            <li v-for="item in params.commentList" :key="item" v-show="params.isContentView">
                <read-form-comment-vue v-if="params.isContentView"
                @REMOVE="methods.remove"
                :key="index"
                :index="item.index"
                :bindex="item.bindex"
                :nickname="item.nickName"
                :content="item.content"
                :timeStamp="item.timeStamp"
                :recommendCount="item.recommendCount"
                :unRecommendCount="item.unRecommendCount"
                :isAbleModif="item.isAbleModif"/>
            </li>
                
            
        </transition-group>
        

    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';
import ReadFormCommentVue from './ReadFormCommentVue.vue';

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
    name:'ReadFormVue',
    components:{
        ReadFormCommentVue
    },
    props:{
        index: Number,
        title: String,
        type: Number,
        nickname: String,
        uploaderLogoPath: String,
        timeStamp: Number,
        content: String,
        imgPath: String,
        index: Number,
        viewCount: Number,
        recommendCount: Number,
        unRecommendCount: Number,
        isAbleModif: Boolean
    },
    setup(props, context) {
        const store = Store;

        const params = ref({
            index: props.index,
            title: Base64.decode(props.title),
            nickname: props.nickname,
            logoPath: props.uploaderLogoPath,
            timeStamp: props.timeStamp? parseInt(props.timeStamp): '',
            content: Base64.decode(props.content),
            imgPath: props.imgPath,
            index: props.index,
            viewCount: props.viewCount,
            recommendCount: props.recommendCount,
            unRecommendCount: props.unRecommendCount,
            type: props.type,
            isAbleModif: props.isAbleModif,
            isContentView: false,
            commentList: null,
            mountInterval: null,
            transLeavePercen: {
                "--transLeavePercen": "100%",
                "list-style": "none",
            },

        });

        const methods = {
            removeContent: ()=>{
                context.emit("REMOVE", params.value.index);
            },
            print: ()=>{
                params.value.isContentView = !params.value.isContentView;

                if(
                    params.value.commentList === null && params.value.isContentView || 
                    params.value.commentList && params.value.commentList.length < 5 && params.value.isContentView)
                    {
                    methods.printComment();
                }
            },
            recommend: ()=>{
                AXIOS.put(`/community/recommend`, {
                    index: params.value.index,
                    rtype: 'o',
                    isupdate: 'b',
                })
                .then((response)=>{
                    console.log(response.data);
                    store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});

                    if(response.data.result.indexOf('성공') != -1){

                        if(response.data.code === 201){
                            params.value.unRecommendCount -= 1;
                        }

                        params.value.recommendCount += 1;
                    } else if(response.data.result.indexOf('취소') != -1){
                        params.value.recommendCount -= 1;
                    }
                })
                .catch((error)=>{
                    console.log(error.response.data);
                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                })
                .finally(()=>{

                });
            }, 
            unRecommend: ()=>{
                AXIOS.put(`/community/recommend`, {
                    index: params.value.index,
                    rtype: 'x',
                    isupdate: 'b',
                })
                .then((response)=>{
                    console.log(response.data);
                    store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});

                    if(response.data.result.indexOf('성공') != -1){

                        if(response.data.code === 201){
                            params.value.recommendCount -= 1;
                        }

                        params.value.unRecommendCount += 1;
                    } else if(response.data.result.indexOf('취소') != -1){
                        params.value.unRecommendCount -= 1;
                    }
                })
                .catch((error)=>{
                    console.log(error.response.data);
                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                })
                .finally(()=>{
                });
            },
            printComment: ()=>{
                params.value.commentList = [];

                AXIOS.get(`/community/comments?bindex=${params.value.index}&pagesize=5`)
                .then((response)=>{
                    var result = response.data.result;
                    
                    if(result){
                        for(var i in result){
                            if(params.value.commentList.indexOf(result[i]) === -1)
                                params.value.commentList.push(result[i]);
                        }
                    }
                    
                    console.log(response.data);
                })
                .catch((error)=>{
                    console.log(error.response.data);
                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                })
                .finally(()=>{

                });
            },
            remove: (cindex)=>{
                AXIOS.delete(`/community/comment?cindex=${cindex}`)
                .then((response)=>{
                    console.log(response.data);
                    store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"success"});

                    for(var i in params.value.commentList){
                        if(params.value.commentList[i].index === cindex){
                            params.value.commentList.splice(i, 1);
                            break;
                        }
                    }
                })
                .catch((error)=>{
                    console.log(error);
                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                });
            },
            modify: ()=>{
                store.commit("CHANGE_FOREGROUND_COMPONENT", {name:'ModifyFormVue'});
                store.commit("MODIFY_READY", {
                    title: params.value.title,
                    content: params.value.content,
                    type: params.value.type,
                    hideLevel: params.value.hideLevel,
                    imgPath: params.value.imgPath,
                    index: params.value.index,
                });
                store.commit("OPEN_FOREGROUND");
            }
        };

        params.value.timeStamp = yyyymmdd_HHMMSS(params.value.timeStamp);

        if(params.value.imgPath)
            params.value.imgPath = props.imgPath.split('c3BhY2VcdA==');

        onMounted(()=>{
            // console.log(params.value);
            params.value.mountInterval = setInterval(()=>{
                params.value.transLeavePercen["--transLeavePercen"] = document.getElementById("readCommentFormRoot")? `${document.getElementById("readCommentFormRoot").clientWidth}px`: "100%";
                
                
            }, 500);
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{
            clearInterval(params.value.mountInterval);
        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>

.print-fade-enter-from,
.print-fade-leave-to{
    opacity: 0;
}

.print-fade-enter-active,
.print-fade-leave-active{
    transition: all 0.3s ease;
}

.comment-fade-enter-active{
    transition: all 0.3s ease;
}

.comment-fade-leave-active{
    transition: all 0.3s ease;
    min-width: var(--transLeavePercen);
    position: fixed;
}

.comment-fade-enter-from{
    top: 0;
    left: 0;
    bottom: 0;
    position: fixed;
    opacity: 0;
}

.comment-fade-leave-to{
    transform: translate(0, 0);
    opacity: 0;
}

.comment-fade-move{
    transition: all 0.5s ease;
}

</style>
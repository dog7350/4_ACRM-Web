<template>
    <div id="readCommentFormRoot" class="container-fluid d-flex flex-column pt-3 my-3 mx-auto"
    :style="`background: rgb(128, 170, 255); width: 100%; height: auto; min-width:200px; marginLeft: 0; marginRight: 0;`">
    
        <div class="row">
            <div id="logoRow" class="col-sm-12 container-fluid">
                <!-- <img :src="params.logoPath?params.logoPath:`/images/board/logos/none.png`"
                @error="'/images/board/logos/none.png'" :style="`width: ${store.getters.GET_BROWSER_SIZE/20}px; height: auto;`"> -->

                <div>글쓴이: {{params.nickname}}</div>
                <div>올린 시간: {{params.timeStamp}}</div>
                <div>글 인덱스: {{params.bindex}}</div>
                <div>댓글 인덱스: {{params.index}}</div>

                <button v-if="params.isAbleModif">수정</button>
                <button v-if="params.isAbleModif" @click="methods.removeContent">삭제</button>
                <button @click="methods.recommend">추천</button>
                <button @click="methods.unRecommend">비추천</button>
            </div>
        </div>

        <div class="row">
            <div id="viewNrecommendRow" class="col-sm-12 container-fluid">
                <div>추천수: {{params.recommendCount}}</div>
                <div>비추천수: {{params.unRecommendCount}}</div>
            </div>
        </div>

        <!-- <transition-group name="print-fade" mode="out-in"> -->
            <div class="row">
                <div id="content" class="col-sm-12 container-fluid">
                    <div>내용:</div>
                    <div v-html="params.content"></div>
                </div>
            </div>
        <!-- </transition-group> -->

        <!-- <transition-group name="print-fade" mode="out-in" 
            @before-enter="methods.imgBeforeEnter" @after-enter="methods.imgAfterEnter"
        > -->
            <div class="d-flex justify-content-around" v-if="params.isContentView">
                <div id="content"  v-for="imgPath in params.imgPath" :key="imgPath.id">
                    <img :src="imgPath" :style="`width: ${store.getters.GET_BROWSER_SIZE/10}px; height: auto;`" v-if="imgPath !== ''">
                </div>
            </div>  
        <!-- </transition-group> -->
        

    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

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
    name:'ReadFormCommentVue',
    props:{
        index: Number,
        bindex: Number,
        nickname: String,
        // uploaderLogoPath: String,
        timeStamp: Number,
        content: String,
        recommendCount: Number,
        unRecommendCount: Number,
        isAbleModif: Boolean
    },
    setup(props, context) {
        const store = Store;

        const params = ref({
            index: props.index,
            bindex: props.bindex,
            nickname: props.nickname,
            uploaderLogoPath: props.uploaderLogoPath,
            timeStamp: props.timeStamp,
            content: Base64.decode(props.content),
            recommendCount: props.recommendCount,
            unRecommendCount: props.unRecommendCount,
            isAbleModif: props.isAbleModif,
        });

        const methods = {
            removeContent: ()=>{
                context.emit("REMOVE", params.value.index);
            },
            recommend: ()=>{
                AXIOS.put(`/community/recommend`, {
                    index: params.value.index,
                    rtype: 'o',
                    isupdate: 'c',
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
                    isupdate: 'c',
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
        };

        onMounted(()=>{
            params.value.timeStamp = yyyymmdd_HHMMSS(params.value.timeStamp);
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{
        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>

</style>
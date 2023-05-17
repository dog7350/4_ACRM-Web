<template>
    <div id="FeedBackListRootWrapper" class="w-100 m-0 p-0 d-flex flex-wrap justify-content-center">
        <div class="w-100 d-flex flex-wrap justify-content-center border-radius-c my-0 px-3 py-2" style="border: 3px #767676 solid;background-color: white;">
            <div class="w-100 m-0 p-0 d-flex flex-wrap justify-content-between">
                <div class="d-flex flex-column justify-content-center align-self-center">
                    <div class="">정렬순서</div>
                    <div>
                        <select name="" id="" v-model="params.sort">
                            <option value="0">날짜(내림차순)</option>
                            <option value="1">날짜(오름차순)</option>
                            <option value="2">추천(내림차순)</option>
                            <option value="3">추천(오름차순)</option>
                            <option value="4">비추천(내림차순)</option>
                            <option value="5">비추천(오름차순)</option>
                        </select>
                    </div>
                </div>
                <div class="d-flex flex-column justify-content-center align-self-center">
                    <div>검색날짜</div>
                    <div>
                        <select name="" id="" v-model="params.daySort">
                            <option value="0">최근 7일</option>
                            <option value="1">최근 30일</option>
                            <option value="2">최근 3달</option>
                            <option value="3">최근 6달</option>
                            <option value="4">최근 1년</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <transition>
            <div class="container-fluid m-0 p-0" v-if="params.contentList.length != 0">
                <transition-group name="multipleBoardList" mode="out-in" tag="ul" class="container-fluid p-0 m-0" style="listStyle: none;">
                    <li v-for="item in params.contentList" :key="item.id"
                    class="w-100 d-flex flex-wrap justify-content-center border-radius-c my-3 p-3" style="border: 3px #767676 solid;background-color: white;">
                        <div class="w-100 d-flex flex-wrap text-start ">
                            <div class="w-100 fspl font-bold">
                                제목: {{item.title}}
                            </div>
                            <div class="w-100 fsps">
                                작성날짜: {{yyyymmdd_HHMMSS(item.uploadDate)}}
                            </div>
                            <div class="w-100 fsps d-flex flex-wrap justify-content-start">
                                <div class="m-0 p-0">{{item.bigName}}&nbsp;-&nbsp;{{item.smallName}}</div>
                            </div>
                        </div>

                        <hr class="w-100">
                        
                        <div class="w-100 d-flex flex-wrap text-start fspm">
                            <div class="w-100 d-flex flex-wrap justify-content-start">
                                <div>내용</div>
                            </div>
                            <div class="w-100 d-flex flex-wrap">
                                {{item.content}}
                            </div>
                            <div class="w-100 d-flex flex-wrap justify-content-end">
                                <div class="w-auto text-center d-flex flex-wrap">
                                    <div>
                                        <i @click="methods.recFb(item.findex, 'o')"
                                        class="bi bi-hand-thumbs-up-fill over-cursor"></i> {{item.rec}}
                                    </div>
                                    <div class="mx-2">
                                        <i @click="methods.recFb(item.findex, 'x')"
                                        class="bi bi-hand-thumbs-down-fill over-cursor"></i> {{item.unrec}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </transition-group>
            </div>
            <div class="container-fluid m-0 p-5 d-flex flex-wrap justify-content-center align-items-center" v-else-if="params.loadEnd === false">
                <div id="loadingding" class="d-flex justify-content-center">
                    <i class="bi bi-hourglass align-self-center icon-size-standard"></i>
                </div>
                <div class="container-fluid ">피드백 목록 불러오는 중</div>  
            </div>
            <div class="container-fluid m-0 p-0" v-else>
                <div class="container-fluid ">피드백 목록이 존재하지 않습니다.</div>  
            </div>
        </transition>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, onUpdated, watch } from 'vue'
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
    name:'FeedBackList',
    setup(props, context) {
        const store = Store;

        const params = ref({
            contentList: [],
            sort: 0, daySort: 1, isFirstOpen: true, loadEnd: false,
            days: [7, 30, 90, 180, 365],
        });

        const methods = {
            getContents: (sort = 0, daySort = 1, init = false)=>{
                params.value.loadEnd = false;

                if(init){
                    params.value.contentList = [];
                }

                AXIOS.get(`/community/feedbacklist?desc=${sort}&lastRange=${params.value.days[daySort]}`)
                .then((response)=>{
                    params.value.isFirstOpen = false;
                    params.value.contentList.push(...response.data.result);

                    console.log(response.data.result);
                })
                .catch((error)=>{
                    console.log(error.response.data.result);
                })
                .finally(()=>{
                    params.value.loadEnd = true;
                })
            },
            okBack: ()=>{
                context.emit("OKBACK", {});
            },
            recFb: (index, type)=>{
                const tempIndex = index;
                AXIOS.get(`community/feedbackrec?findex=${index}&recType=${type}`)
                .then((response)=>{
                    const data = response.data;

                    for(var i in params.value.contentList){
                        if(params.value.contentList[i].findex === tempIndex){
                            params.value.contentList[i].rec = data.after.rec;
                            params.value.contentList[i].unrec = data.after.unrec;

                            break;
                        }
                    }

                    store.commit('CREATE_ALERT', {msg: data.result, time: 2, type:"success"});
                })
                .catch((error)=>{
                    console.log(error.response.data.result);

                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                })
                .finally(()=>{
                })
            },
        }; 

        watch(()=>params.value.sort, ()=>{
            methods.getContents(params.value.sort, params.value.daySort, true);
        })

        watch(()=>params.value.daySort, ()=>{
            methods.getContents(params.value.sort, params.value.daySort, true);
        })

        onMounted(()=>{
            methods.getContents(params.value.sort, params.value.daySort, true);
        });

        onUnmounted(()=>{

        });

        return{
            params, methods, store, yyyymmdd_HHMMSS
        };
    },
}
</script>

<style scoped>
@keyframes loadingAnimation {
    0%{

    }
    100%{
        transform: rotate(2turn);
    }
}

.multipleBoardList-enter-from, .multipleBoardList-leave-to{
    opacity: 0;
}

.multipleBoardList-enter-active, .multipleBoardList-leave-active{
    transition: all 0.3s ease;
}
</style>
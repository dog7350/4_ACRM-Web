<template>
    <div id="FeedBackRootWrapper" class="w-100 m-0 p-0 d-flex flex-wrap justify-content-center">
        <div class="w-100 d-flex flex-wrap justify-content-center border-radius-c my-3 p-3" style="border: 3px #767676 solid;background-color: white;">
            
            <div class="container-fluid my-2 mx-0 p-0 text-start">
                <label for="feedbackTitle" class="font-bold">피드백 제목:&nbsp;</label>
                <input id="feedbackTitle" type="text" placeholder="제목을 작성해주세요. (5자보다 길어야 합니다.)" v-model="params.feedBackTitle">
            </div>

            <div class="container-fluid mt-2 mx-0 p-0 text-start">
                <label class="font-bold">피드백 종류:&nbsp;</label>

                <select name="" @change="methods.bigTagChange"
                id="bigtag" v-model="params.currentBigTag" v-if="params.result">
                    <option v-for="item, index in params.result" :key="index" :value="index">
                        {{item.bigName}}
                    </option>
                </select>
                &nbsp;
                <select name="" id="smalltag" v-model="params.currentSmallTag" v-if="params.result">
                    <option v-for="item, index in params.result[params.currentBigTag].smallTag" :key="index" :value="item.smallTag">
                        {{item.smallName}}
                    </option>
                </select>
            </div>

            <div class="container-fluid d-flex flex-column mt-2 mx-0 p-0 text-start">
                <div class="font-bold fspll">내용</div>
                <textarea id="feedBackContents" class="w-100 m-0 p-0 awesome-scroll" placeholder="내용을 작성해주세요. (20자보다 길어야 합니다.)" v-model="params.feedBackCotents"></textarea>
            </div>
            
            <input type="submit" class="container-fluid btn btn-outline-primary mt-3" @click="methods.sendFeedBack" :value="'피드백 전송'">
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'FeedBackParts',
    setup(props, context) {
        const store = Store;

        const params = ref({
            feedBackCotents: '',
            feedBackTitle: '',
            feedBckList: null,
            bigSeries: [],
            result: null,
            currentBigTag: '000',
            currentSmallTag: '000',
            stop: false,
        });

        const methods = {
            getFeedBack: ()=>{
                AXIOS.get('/community/feedbacktag')
                .then((res)=>{
                    console.log(res.data);
                    // params.value.bigSeries.push(...Object.keys(res.data.result));
                    // console.log(params.value.bigSeries);
                    params.value.result = res.data.result;
                })
                .catch((error)=>{
                    console.log(error);
                });
            },
            bigTagChange: ()=>{
                params.value.currentSmallTag = '000';
            },
            sendFeedBack: ()=>{
                let request = {
                    title: params.value.feedBackTitle,
                    content: params.value.feedBackCotents,
                    bigTag: params.value.currentBigTag,
                    smallTag: params.value.currentSmallTag,
                };

                console.log(request);
                params.value.stop = true;

                AXIOS.post('/community/feedback', request)
                .then((res)=>{
                    store.commit('CREATE_ALERT', {msg: res.data.result, time: 2, type:"success"});
                    methods.okBack();
                })
                .catch((err)=>{
                    store.commit('CREATE_ALERT', {msg: err.response.data.result, time: 2, type:"danger"});
                })
                .finally(()=>{
                    params.value.stop = false;
                });
            },
            okBack: ()=>{
                context.emit("OKBACK", {});
            },
        }; 

        onMounted(()=>{
            methods.getFeedBack();
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
#feedBackContents{
    min-height: 200px;
    max-height: 350px;
    overflow: hidden scroll;
}
</style>
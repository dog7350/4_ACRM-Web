<template>
    <div id="boardWriteRootWrapper" class="container-fluid d-flex align-items-center justify-content-center py-3 test-border border-radius-d fsps" >
        <div id="divUnderRoot" >
            <div class="container-fluid row d-flex align-items-center m-auto p-auto text-align-center" v-if="true">
                <div class="col-sm-12 my-1 fspl">
                    <label for="title">제목</label>
                    <input type="text" class="form-control" id="title" placeholder="제목을 입력해주세요." v-model="params.title">
                </div>

                <div class="col-sm-12 my-1 container-fluid d-flex flex-column fspm">
                    <div>
                        보여질 범위
                    </div>
                    <select class="form-select" v-model="params.hideLevel">
                        <option v-for="option, idx in params.hideLevelList" :key="option.id" :value="idx">
                            {{ option }}
                        </option>
                    </select>
                </div>
                <div class="col-sm-12 my-1 container-fluid d-flex flex-column">
                    <div>
                        게시글 종류
                    </div>
                    <select class="form-select" v-model="params.contentType">
                        <option v-for="option, idx in params.selectList" :key="option.id" :value="idx+1">
                            {{ option }}
                        </option>
                    </select>
                </div>
                <div class="col-sm-12 my-1">
                    <textarea class="form-control thin-y-scrollbar" id="content" placeholder="내용을 입력해주세요." style="height:10em; resize: none;" v-model="params.content"></textarea>
                </div>
                <div class="col-sm-12 my-1">
                    <input class="form-control" type="file" id="imageFiles" accept="image/gif, image/jpeg, image/png" @change="methods.changeFile" multiple>
                </div>
                <div class="col-sm-12 my-1" v-if="params.loadFileIsOverMax">
                    <span class="text-danger">선택된 파일의 개수가 4개를 초과했습니다! (아래에 나타난 사진들만 로드됩니다.)</span>
                </div>
                <div id="dynamicUl" class="col-sm-12 my-1">
                    <ul class="d-flex justify-conetnt-around mx-auto" style="listStyle: none; padding:0;">
                        <li class="d-flex align-items-center mx-auto border border-info rounded" v-for="item in params.fileList" :key="item.id" 
                        style="display:inline-block;  background-color: rgba(0,0,0,0.3);">
                            <img :style="`${item} width:${store.getters.GET_BROWSER_SIZE/10}px; height:auto;`">
                        </li>
                    </ul>
                </div>
                <div class="form-floating col-sm-12 my-1 fspl">
                    <button type="submit" class="btn btn-primary" @click="methods.printFormDataDebounced">글 올리기</button>
                </div>
            </div>

            <div v-else>

            </div>
            
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
    name:'WriteFormVue',
    setup(props, context) {
        const store = Store;

        store.commit('LOGIN_CHECK');

        const reader = new FileReader();
        const params = ref({
            title: '',
            fileFrom: null,
            fileList: [],
            beforeList: [],
            loadFileIsOverMax: false,
            currentIndex: 0,
            ulHeight: 0,
            hideLevel: 0, // 0 is all, 1 is friends, follower, 2 is friends, 3 is me // 'null or undeinfed or any number' is change 3,
            isWrtings: false,
            content: '',
            contentType: 1,
            hideLevelList: ['ALL', 'FOLLOWER & FRIEND', 'FRIEND'],
            selectList: ['SMALL TALK', 'HUMOR', 'INFO'], // 1 - none, 2 - humor, 3 - info, 4 - notice
        });

        const methods = {
            changeFile: (e)=>{
                params.value.loadFileIsOverMax = false;
                params.value.fileList = [];
                params.value.beforeList = e.target.files;
                params.value.currentIndex = 0; 

                if(params.value.beforeList.length > 0){
                    reader.readAsDataURL(params.value.beforeList[params.value.currentIndex]);
                    reader.onload = (e2)=>{
                        if(params.value.fileList.length < 4) {
                            params.value.fileList.push(`content: url(${e2.target.result});`);
                        }

                        params.value.currentIndex++;
                        
                        if(params.value.currentIndex < params.value.beforeList.length){
                            reader.readAsDataURL(params.value.beforeList[params.value.currentIndex]);
                        } else{
                            if(params.value.beforeList.length - 4 > 0){
                                params.value.loadFileIsOverMax = true;
                            }
                            reader.onload = null;
                        }             
                    };
                }
            },
            printFormData: ()=>{
                if(!params.value.isWrtings) {
                    params.value.isWrtings = true;
                    var formData = new FormData();
                    var imageFiles = document.getElementById("imageFiles");

                    formData.append("title", params.value.title);
                    for(var i = 0; i < 4 ; i++) {
                        if(i === imageFiles.length){
                            break;
                        }
                        formData.append("imageFiles", imageFiles.files[i]);
                    }
                    formData.append("hideLevel", params.value.hideLevel);
                    formData.append("content", params.value.content);
                    formData.append("type", params.value.contentType);

                    AXIOS.post('/community/board', formData, {headers:{"Content-Type": "multipart/form-data"}})
                    .then((response)=>{
                        console.log(response.data);
                        store.commit('CREATE_ALERT', {msg:'성공적으로 작성되었습니다.', time: 2, type:"success"});
                        store.commit('CLOSE_FOREGROUND');
                        var socket = store.getters.GET_SOCKET;

                        socket.emit('upload_boards');
                    })
                    .catch((error)=>{
                        console.log(error.response.data);
                        if(error.response.data.result === null ||
                            error.response.data.result === undefined &&
                            error.response.data.indexOf('dGhpc2lzbm90anBlZ3BuZ2pwZ2ltYWdlISE') !== -1){
                            store.commit('CREATE_ALERT', {msg:'이미지 파일을 다시 확인해주세요.', time: 2, type:"danger"});
                        } else{
                            store.commit('CREATE_ALERT', {msg:error.response.data.result, time: 2, type:"danger"});
                        }
                    });
                    
                    params.value.isWrtings = false;
                }
            },
            printFormDataDebounced: null,
        };

        methods.printFormDataDebounced = _.debounce(methods.printFormData, 100);

        onMounted(()=>{
            if(!store.getters.GET_IS_LOGIN){
                store.commit('CREATE_ALERT', {msg:'로그인이 필요한 서비스 입니다.', time: 2, type:"danger"});

                // store.commit('CLOSE_FOREGROUND');
                
                store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'});
            }

            if(store.getters.GET_AUTH === 'o'){
                params.value.selectList.push("NOTICE");
            }
        });

        onUpdated(()=>{
            // params.value.ulHeight = document.getElementById("dynamicUl").clientHeight;
            // ${(store.state.browserHeight)*0.4+params.ulHeight}px
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

#boardWriteRootWrapper{
    position:fixed;
    background-color: rgb(31, 31, 96);
    color: white;
    top:150px;
    z-index:1501;
    height: auto;
    width: 80vw;
    min-width:250px;
}

.thin-y-scrollbar::-webkit-scrollbar{
    width: 7px;
}

.thin-y-scrollbar::-webkit-scrollbar-thumb{
    border-radius: 4px;
    background-color: rgb(44, 93, 255);
}

.thin-y-scrollbar::-webkit-scrollbar-track{
    background-color: transparent;
    margin: 5px 2px 5px 0;
}

.thin-y-scrollbar::-webkit-scrollbar-button{
    display: none;
}

.thin-y-scrollbar::-webkit-scrollbar-corner{
    display: none;
}

.thin-y-scrollbar::-webkit-scrollbar-track-piece{
    display: none;
}

.thin-y-scrollbar::-webkit-resizer{
    display: none;
}
</style>
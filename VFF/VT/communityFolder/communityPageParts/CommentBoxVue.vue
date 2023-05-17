<template>
    <div id="commentBoxWrapper" class="d-flex px-2 py-2 mx-0 my-0 test-border border-radius-b">
        <div class="user-comment-card-head-wrapper px-2 py-0">
            <img class="user-logo-img my-auto rounded-circle" :src="params.logoPath? params.logoPath: '/images/board/logos/none.png'" alt="로고이미지">
        </div>

        <div class="user-comment-card-body-tail-wrapper flex-grow-1 d-flex flex-column px-2 py-0">
            <div class="user-comment-card-body-wrapper container-fluid d-flex flex-column p-0">
                <div id="commentNickName" class="fspm bold-font d-flex justify-content-between">
                    <div>{{params.nickName}}</div>
                    <div class="d-flex align-self-center">
                        <a  href="#"
                        :id="`gearFocuser${params.cindex}`" 
                        @click.prevent="methods.gearClick" 
                        class="over-cursor over-cursor-rotate-half-n-half is-have-plain-transition">
                            <i class="bi bi-gear-fill align-self-center"></i>
                        </a>
                        <div id="manageList" class="" v-if="params.manageVisible">
                            <table class="table table-striped fsps" style="width:auto; backgroundColor: white; minWidth:40px;">
                                <tbody>
                                    <tr>
                                        <td class="over-cursor-pointer-background">
                                            <i class="bi bi-eraser">수정</i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="over-cursor-pointer-background" @mousedown="methods.deleteBoard">
                                            <i class="bi bi-pen">삭제</i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="over-cursor-pointer-background">
                                            <i class="bi bi-telephone-minus">신고</i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div id="commentTimeStamp" class="fspss">{{params.timeStamp}}</div>
                <div id="commentContent" class="fspm">{{params.content}}</div>
            </div>

            <div class="user-comment-card-tail-wrapper container-fluid d-flex p-0 justify-content-around">
                <div><i class="bi bi-hand-thumbs-up"></i> {{params.recommendCount}}</div>
                <div><i class="bi bi-hand-thumbs-down"></i> {{params.unRecommendCount}}</div>
                <div><i class='bi bi-exclamation-lg'></i> {{params.objectionCount}}</div>
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
    name:'CommentBoxVue',
    props: {
        nickName: String,
        cindex: Number,
        bindex: Number,
        timeStamp: Number,
        content: String,
        hideLevel: Number,
        recommendCount: Number,
        unRecommendCount: Number,
        objectionCount: Number,
        isAbleModif: Boolean,
        logoPath: String,
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            nickName: props.nickName,
            bindex: props.bindex,
            cindex: props.cindex,
            timeStamp: yyyymmdd_HHMMSS(props.timeStamp),
            content: Base64.decode(props.content),
            hideLevel: props.hideLevel,
            recommendCount: props.recommendCount,
            unRecommendCount: props.unRecommendCount,
            objectionCount: props.unRecommendCount,
            isAbleModif: props.isAbleModif,
            logoPath: props.logoPath? props.logoPath: false,
            manageVisible: false,
        });

        const methods = {
            gearClick: ()=>{

            },
        };

        onMounted(()=>{
            params.value.manageVisible = false;
            setTimeout(()=>{
                if(document.getElementById(`gearFocuser${params.value.cindex}`)){
                    document.getElementById(`gearFocuser${params.value.cindex}`).onfocus=()=>{
                        params.value.manageVisible = true;
                    };

                    document.getElementById(`gearFocuser${params.value.cindex}`).onblur=()=>{
                        params.value.manageVisible = false;
                    };
                }
            }, 150);
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{

        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
a, a:hover, a:focus{
    text-decoration: none;
    color: white;
}

#manageList{
    position: absolute;
    margin:1.3rem 0 0 1.3rem;
}

#commentContent{
    padding: 1.5vmin 0 0 0;
}

.user-logo-img {
    max-width: 55px;
    max-height: 55px;
    min-width: 45px;
    min-height: 45px;
    width: 5vmax;
    height: 5vmax;
}

</style>
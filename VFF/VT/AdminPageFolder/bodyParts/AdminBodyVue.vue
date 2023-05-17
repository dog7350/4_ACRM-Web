<template>
    <div id="adminPageBodyContainer" class="d-flex flex-wrap justify-content-center align-content-start text-center awesome-scroll">

        <div id="adminTitleWrapper" class="container-fluid d-flex justify-content-center mt-5">
            <div id="adminImgWrapper" class="d-flex justify-content-start">
                <div id="imageFrame" class="m-3">
                    <picture>
                        <source srcSet="/images/admin/admin0.webp" type="image/webp">
                        <img class="" src="/images/admin/admin0.png" alt="" srcset="">
                    </picture>
                </div>
            </div>
            <div id="adminTitleWrapper" class="container-fluid d-flex flex-column justify-content-start text-start">
                <div id="titleFrame" class="fspll font-bold">
                    관리자 페이지
                </div>
                <div id="titleFrame" class="fspl">
                    ------------
                </div>
            </div>
        </div>

        <div id="seperLine"></div>
        
        <request-url-list-vue @BODYACTIONREGISTED="methods.bodyActionRegisted"
        v-for="item in urlList" :key="item.mainTitle.unique" :form="item"></request-url-list-vue>  
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import RequestUrlListVue from './requestParts/RequestUrlListVue.vue';
import {QueryNBodyItemInfo, QueryNBodyItem, TitleItem, ActionItem, UrlForm} from './requestParts/itemFolder/TAForm';

import { testFilter, boardDecoder, commentdDecoder, boardsDecoder } from './requestParts/itemFolder/met/base64Helper';
import AdminActionForm1 from './requestParts/itemFolder/userManage';
import GetInfoAdminForm from './requestParts/itemFolder/getInfoAdminForm';
import DBCRUD from './requestParts/itemFolder/dbcrud';






const urlList = [];

GetInfoAdminForm.pushFilter(boardsDecoder, 0);
GetInfoAdminForm.pushFilter(boardDecoder, 1);
GetInfoAdminForm.pushFilter(commentdDecoder, 2);

AdminActionForm1.pushFilter(testFilter,3);

urlList.push(GetInfoAdminForm);
urlList.push(AdminActionForm1);
urlList.push(DBCRUD);

export default {
    components: { RequestUrlListVue },
    name:'AdminBodyVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        
        const params = ref({
            index: 0
        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
                window.scrollTo(0, 0);
            },
            bodyActionRegisted: (payload)=>{
                context.emit("BODYACTIONREGISTED", payload);
            }
        }

        onMounted(()=>{

        });

        return{
            params, methods, store, urlList
        };
    },
}
</script>

<style scoped>

#adminPageBodyContainer{
    width: 100%;
    height: 100vh;
    padding-bottom: 20vh;
    overflow-x: hidden;
    overflow-y: scroll;
}

#seperLine{
    width: 101%;
    border: 1px white solid;
    margin: 1.5em 0 1em 0;
}

.width100{
    width: 100%;
}

#adminImgWrapper{
    margin: 0 2vw 0 3vw;
}

#adminTitleWrapper{
    margin-top: 5vh;
}

</style>
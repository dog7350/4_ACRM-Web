<template>
    <div id="footerIntroduceWrapper" class="container-fluid d-flex flex-column justify-content-center white-font">
        <div class="mx-auto  d-flex justify-content-center align-items-center" style="margin-bottom: 5vh;">
            <div class="container-fluid d-flex flex-wrap justify-content-around align-items-center">
                <img width="150" id="" src="/images/logos/segaLogo.png" alt="">

                <div :class="`${store.getters.GET_BROWSER_SIZE <= 1000? 'text-center': ''}`">
                    COPYRIGHT ©2020 NIMBLE NEURON CORPORATION. ALL RIGHTS RESERVED. <br>PARTNERSHIP INQUIRIES: eternalreturn@nimbleneuron.com
                </div>
            </div>
        </div>

        <div class="mx-auto d-flex justify-content-center align-items-center white-font">
            <img width="80" id="" src="/images/all.png" alt="">
            <table class="white-font fsps">
                <tbody>
                    <tr>
                        <td>제명</td>
                        <td>AccroMemories</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>이용등급</td>
                        <td>ALL</td>
                        <td>등급분류번호</td>
                        <td>HWS-20401-SD</td>
                    </tr>
                    <tr>
                        <td>등급분류 일자</td>
                        <td>2022-05-29</td>
                        <td>제작사</td>
                        <td>PSA2</td>
                    </tr>
                </tbody>
            </table>
        </div> 
    </div>
</template>

<script>
import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'FooterVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            trackImgSrc: [],
            currentHover: -1,
        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
            },
        };

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>

#footerIntroduceWrapper{
    width: 100vw;
    height: fit-content;
    background: rgb(122, 122, 122);
    padding: 5vh 0;
}

img{
    margin: 0 10vw 0 0;
}

tbody{
    border: 4px rgb(51, 51, 51) solid;
}

td{
    padding: 5px;
    margin: 5px;
    border: 2px transparent solid;
    background-color: none;
}

</style>




<template>
    <nav class="navbar navbar-expand-xl navbar-dark fixed-top" id="main-nav" style="background: rgba(0,0,0,0.3); width:100%;">
        <div class="container-fluid row mx-auto">
            <div class="container-fluid d-flex justify-content-center col-xl-4">
                <div class="row">
                    <router-link to="/" class="navbar-brand col-sm-12 d-flex justify-content-center m-0 p-0"><img class="img-fluid" src="/images/testLogo.png" alt=""></router-link>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
            </div>
            <div class="container-fluid col-xl-8">
                <ul class=" justify-content-between navbar-nav navbar-collapse collapse" id="collapsibleNavbar">
                    <li class="nav-item">
                        <router-link to="/main" class="nav-link lis"><div>게임소개</div></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/main/item" class="nav-link lis" ><div>아이템정보</div></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/main/track" class="nav-link lis" ><div>트랙정보</div></router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/main/slide_test" class="nav-link lis" ><div>슬라이드 테스트</div></router-link>
                    </li>
                    <li class="nav-item lgnninfo">
                        <router-link to="" class="nav-link">
                            <div>
                            <span v-if="!store.getters.GET_IS_LOGIN" @click="store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'})">
                                로그인
                            </span>
                            <span v-else @click="store.commit('OPEN_FOREGROUND', {name: 'LoginNOutVue'})">
                                내 정보
                            </span>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../VXS/VuexStore'
import AXIOS from 'axios';
import _ from 'lodash';

export default {
    name:'MainNavigationVue',
    setup(props, context) {
        const store = Store;
        
        const params = ref({
            isVisible: true,
        });

        const methods = {

        };

        return {
            params, methods, store
        };
    },
}
</script>

<style scoped>
a, a:hover, a:active, a:link, a:visited {
    color: white;
    font-weight: bold;
    text-decoration: none;
}

div{
    color: white;
    font-weight: bold;
}

ul{
    font-size: 1.5vmax;
    list-style:none;
    text-align:center;
    padding:0;
}

@media screen and (max-width: 768px) {
    ul{
        font-size: 2vmax;
        list-style:none;
        text-align:center;
        padding:0;
    }
}

.router-link-active.router-link-exact-active.lis::after{
    content: '';
    position: relative;
    display: inline-block;
    left: 0;
    top:0;
    animation: bottomBorder 0.2s ease forwards;
}

@keyframes bottomBorder {
    from{
        width: 0%;
        border-bottom: solid rgba(0,0,0,0);
    }
    to{
        width: 100%;
        border-bottom: solid white;
    }
}


</style>




import { createApp, shallowRef } from 'vue';
import IndexVue from '../VT/IndexVue'
import vueRouter from '../VR/vueRoute';
import Store from '../VXS/VuexStore'

import WriteFormVue from '../VT/vueComponent/community/WriteFormVue';
import MainNavigationVue from '../VT/vueComponent/MainNavigationVue';
import LoginNOutVue from '../VT/vueComponent/LoginNOutVue';
import RegistVue from '../VT/vueComponent/RegistVue';
import RegistCertVue from '../VT/vueComponent/RegistCert';
import AlertVue from '../VT/vueComponent/AlertVue';
import ModifyFormVue from '../VT/vueComponent/community/ModifyFormVue';
import CashChargeVue from '../VT/vueComponent/CashChargeVue';
import WriteCommentFormVue from '../VT/vueComponent/community/WriteCommentFormVue';
import ObjectionFormVue from '../VT/vueComponent/community/ObjectionFormVue';

import YoutubePlayerVue from '../VT/vueComponent/YoutubePlayerVue';
import ImgScaleUpVue from '../VT/communityFolder/communityPageParts/boardParts/ImgScaleUpVue';
import LoadingVue from '../VT/vueComponent/LoadingVue';
import QuestionVue from '../VT/vueComponent/QuestionVue';
import FindIdVue from '../VT/vueComponent/FindIdVue';
import FindPwVue from '../VT/vueComponent/FindPwVue';
import NotifiListVue from '../VT/vueComponent/NotifiListVue'
import GoodsInfoVue from  '../VT/shopParts/goods/parts/mainGoodsPart/GoodsInfo';
import RegistGoodsFormVue from '../VT/shopParts/goods/parts/mainGoodsPart/RegistGoodsForm';
import ManagedGoodsVue from '../VT/shopParts/goods/parts/mainGoodsPart/ManagedGoods';
import MyGoodsPurcahseLogListVue from '../VT/shopParts/goods/parts/mainGoodsPart/MyGoodsPurcahseLogList';

Store.commit("ADD_COMPONENT", {name: 'MainNavigationVue', component: shallowRef(MainNavigationVue)});QuestionVue
Store.commit("ADD_COMPONENT", {name: 'LoginNOutVue', component: shallowRef(LoginNOutVue)});
Store.commit("ADD_COMPONENT", {name: 'AlertVue', component: shallowRef(AlertVue)});
Store.commit("ADD_COMPONENT", {name: 'WriteFormVue', component: shallowRef(WriteFormVue)});
Store.commit("ADD_COMPONENT", {name: 'RegistVue', component: shallowRef(RegistVue)});
Store.commit("ADD_COMPONENT", {name: 'RegistCertVue', component: shallowRef(RegistCertVue)});
Store.commit("ADD_COMPONENT", {name: 'ModifyFormVue', component: shallowRef(ModifyFormVue)});
Store.commit("ADD_COMPONENT", {name: 'CashChargeVue', component: shallowRef(CashChargeVue)});
Store.commit("ADD_COMPONENT", {name: 'WriteCommentFormVue', component: shallowRef(WriteCommentFormVue)});
Store.commit("ADD_COMPONENT", {name: 'LoadingVue', component: shallowRef(LoadingVue)});
Store.commit("ADD_COMPONENT", {name: 'ImgScaleUpVue', component: shallowRef(ImgScaleUpVue)});
Store.commit("ADD_COMPONENT", {name: 'YoutubePlayerVue', component: shallowRef(YoutubePlayerVue)});
Store.commit("ADD_COMPONENT", {name: 'QuestionVue', component: shallowRef(QuestionVue)});
Store.commit("ADD_COMPONENT", {name: 'FindIdVue', component: shallowRef(FindIdVue)});
Store.commit("ADD_COMPONENT", {name: 'FindPwVue', component: shallowRef(FindPwVue)});
Store.commit("ADD_COMPONENT", {name: 'ObjectionFormVue', component: shallowRef(ObjectionFormVue)});
Store.commit("ADD_COMPONENT", {name: 'NotifiListVue', component: shallowRef(NotifiListVue)});
Store.commit("ADD_COMPONENT", {name: 'GoodsInfoVue', component: shallowRef(GoodsInfoVue)});
Store.commit("ADD_COMPONENT", {name: 'RegistGoodsFormVue', component: shallowRef(RegistGoodsFormVue)});
Store.commit("ADD_COMPONENT", {name: 'ManagedGoodsVue', component: shallowRef(ManagedGoodsVue)});
Store.commit("ADD_COMPONENT", {name: 'MyGoodsPurcahseLogListVue', component: shallowRef(MyGoodsPurcahseLogListVue)});

Store.commit("CHANGE_NAVIGATION_COMPONENT", {name: 'MainNavigationVue'});

const app = createApp(IndexVue);
app.use(vueRouter);
app.mount("#root");
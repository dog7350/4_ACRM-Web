import { createWebHistory, createRouter } from "vue-router"; 

import mainPage from '../VT/MainPage'
import testMainPage from '../VT/mainPageFolder/MainPage'
import itemPage from '../VT/ItemPage';
import gunPage from '../VT/GunPage';
import trackPage from '../VT/TrackPage';
import AdminPage from '../VT/AdminPageFolder/AdminPage';
import CommunityReadPage from '../VT/CommunityReadPage';
import ModifyPage from '../VT/ModifyPage'
import FileStoragePage from '../VT/fileStorageFolder/FileStoragePage';
import ErrorRouter from '../VT/RouterError'
import ShopPage from '../VT/shopParts/ShopPage';

import TestCommunityPage from '../VT/communityFolder/CommunityPage';



const routes = 
[
    { path: '/', redirect: '/main' },
    
    { path: '/main', component: testMainPage},

    { path: '/main/item', component: itemPage },
    { path: '/main/gun', component: gunPage },
    { path: '/main/track', component: trackPage },
    { path: '/main/admin', component: AdminPage },
    { path: '/main/modify', component: ModifyPage},
    { path: '/main/community', component: TestCommunityPage},
    { path: '/main/storage', component: FileStoragePage},
    { path: '/main/shop', component: ShopPage},

    { path: '/main/abondon/community', component: CommunityReadPage},
    { path: '/main/abandon', component: mainPage},
    { path: '/:pathMatch(.*)*', component: ErrorRouter },
]; //라우팅 패스, 컴포넌트 등 정의

const router = createRouter({
    history : createWebHistory(),
    routes
});

export default router;
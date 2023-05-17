<template>
    <div id="adminHeaderWrapper">
        <div id="adminHeaderLogoWrapper" class="d-flex justify-content-center admin-header-logo-wrapper">
            <img class="over-cursor" @click="methods.routeURL('/main')" src="/images/logos/segaLogo.png" alt="">
        </div>
        
        <div id="adminHeaderMenuWrapper" class="d-flex flex-column justify-content-start fspm text-start">

            <div id="seperLine"></div>

            <div class="m-0 p-0" style="" v-for="item in props.itemList" :key="item.mainTitle.unique">
                <header-menu-list-vue :name="item.mainTitle.url" :unique="item.mainTitle.unique"
                ></header-menu-list-vue>

                <div class="m-0 p-0" style="" v-for="actionItem in item.action" :key="actionItem.titleInfo.unique">
                    <header-menu-item-vue 
                    :parentName="item.mainTitle.url" :parentUnique="item.mainTitle.unique"
                    :name="actionItem.titleInfo.actionName" :unique="actionItem.titleInfo.unique"
                    ></header-menu-item-vue>
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../VXS/VuexStore'
import AXIOS from 'axios';
import HeaderMenuListVue from './headerPartsPart/HeaderMenuListVue.vue';
import HeaderMenuItemVue from './headerPartsPart/HeaderMenuItemVue.vue';

export default {
    components: { HeaderMenuListVue, HeaderMenuItemVue },
    props: {
        itemList: Array,
    },
    name:'AdminHeaderVue',
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
        }

        onMounted(()=>{

        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style>
#adminHeaderWrapper, #adminHeaderLogoWrapper{
    width: 100%;
}

#adminHeaderWrapper{
    overflow-x: hidden;
    overflow-y: scroll;
    /* border-right: 1px white solid; */
}

#adminHeaderWrapper::-webkit-scrollbar{
    width: 7px;
}

#adminHeaderWrapper::-webkit-scrollbar-thumb{
    border-radius: 4px;
    background-color: rgb(44, 93, 255);
}

#adminHeaderWrapper::-webkit-scrollbar-track{
    background-color: transparent;
    border: 1px white solid;
    /* margin: 5px 2px 5px 0; */
}

#adminHeaderWrapper::-webkit-scrollbar-button{
    display: none;
}

#adminHeaderWrapper::-webkit-scrollbar-corner{
    display: none;
}

#adminHeaderWrapper::-webkit-scrollbar-track-piece{
    display: none;
}

#adminHeaderWrapper::-webkit-resizer{
    display: none;
}

#adminHeaderMenuWrapper{
    width: 100%;
}


#adminHeaderLogoWrapper>img{
    width: inherit;
    margin: 3em 0 2em 0;
}

.header-item{
    border-left: solid transparent;
    border-bottom: solid transparent;
    margin-bottom: 1em;
}

.header-list{
    width: 70%;
    margin-bottom: 1em;
}

#seperLine{
    width: 101%;
    border: 1px white solid;
    margin: 1.5em 0 1em 0;
}

.my-ml-0{
    margin-left: 0;
}
.my-ml-1{
    margin-left: 1rem;
}
.my-ml-2{
    margin-left: 1.5rem;
}
.my-ml-3{
    margin-left: 2rem;
}
.my-ml-4{
    margin-left: 2.5rem;
}
.my-ml-5{
    margin-left: 3rem;
}
.my-ml-6{
    margin-left: 3.5rem;
}
.my-ml-7{
    margin-left: 4rem;
}
.my-ml-8{
    margin-left: 4.5rem;
}
.my-ml-9{
    margin-left: 5rem;
}

</style>
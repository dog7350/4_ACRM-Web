<template>
    <div @mouseover="methods.over" @mouseout="methods.out" @mouseleave="methods.leave"
    @click="methods.scrollMenuList" 
    id="menuList" :class="`is-have-plain-transition header-item header-list font-bold my-ml-1 over-cursor ${params.currentOver? 'current-over': ''}`">
        <!-- 메뉴 -->
        {{props.name}}
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';

export default {
    name:'HeaderMenuListVue',
    props: {
        name: String, unique: Number
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        
        const params = ref({
            index: 0,
            currentOver: false,
        });

        const methods = {
            routeURL: (routeUrl)=>{
                router.push(routeUrl);
                window.scrollTo(0, 0);
            },
            scrollMenuList: ()=>{
                var bool = true;
                var scrollWindow = $('#adminPageBodyContainer');
                var item = $(`#requestURLListWrapper${props.unique}`);

                if(scrollWindow){
                    if(item && item.offset()){
                        scrollWindow.animate({scrollTop: scrollWindow.scrollTop()+item.offset().top}, 300);
                        // window.scrollTo(item.offset().top, 0);
                        // console.log('HeaderMenuListVue scroll', scrollWindow.scrollTop()+item.offset().top);
                        if(bool) {
                            try{
                                if(item.attr('class').indexOf('opend') === -1)
                                    item.children('#collapseToggle').trigger('click');
                            }
                            catch(error){
                                console.log(error);
                            }
                        }
                        
                    }
                }
            },
            over: ()=>{
                params.value.currentOver = true;
            },
            out: ()=>{
                params.value.currentOver = false;
            },
            leave: ()=>{
                params.value.currentOver = false;
            },
        }

        onMounted(()=>{
            // console.log(props.name, props.unique);
        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
#menuList{
    padding-left: 0.5em;
    margin-bottom: 0.5em;
    margin-top: 0.5em;
}

.current-over{
    background-color: rgba(255, 255, 255, 0.2);
    border-left: white solid;
}
</style>
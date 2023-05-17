<template>
    <div @mouseover="methods.over" @mouseout="methods.out" @mouseleave="methods.leave" @click="methods.scrollMenuitem"
    id="menuItem" :class="`is-have-plain-transition header-item over-cursor font-bold my-ml-4 fsps ${params.currentOver? 'current-over': ''}`">
        <!-- 메뉴 아이템 명 -->
        {{props.name}}
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';

export default {
    name:'HeaderMenuItemVue',
    props: {
        parentName: String, name: String, parentUnique: Number, unique: Number
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
            scrollMenuitem: ()=>{
                var bool = true;
                var scrollWindow = $('#adminPageBodyContainer');
                var item = $(`#requestUrlWrapper${props.parentUnique}${props.unique}`);

                if(scrollWindow){
                    if(item && item.offset()){
                        scrollWindow.animate({scrollTop: scrollWindow.scrollTop()+item.offset().top}, 300);
                        // console.log('HeaderMenuItemVue scroll1', scrollWindow.scrollTop()+item.offset().top);
                        // window.scrollTo(item.offset().top, 0);
                        if(bool) {
                            try{
                                if(item.attr('class').indexOf('opend') === -1)
                                    item.children('#collapseToggle').trigger('click');
                            }
                            catch(error){
                                console.log(error);
                            }
                        }
                    } else{
                        item = $(`#requestURLListWrapper${props.parentUnique}`);
                        if(item && item.offset()){
                            scrollWindow.animate({scrollTop: scrollWindow.scrollTop()+item.offset().top}, 300);
                            // console.log('HeaderMenuItemVue scroll2', scrollWindow.scrollTop()+item.offset().top);
                            // window.scrollTo(item.offset().top, 0);
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
#menuItem{
    width: fit-content;
    padding: 0.2em 3em 0.2em 0.5em;
}

.current-over{
    background-color: rgba(255, 255, 255, 0.2);
    border-left: white solid;
}

</style>
<template>
    <div class="container-fluid d-flex justify-content-between mx-auto white-font">

        <div id="boardsTypeWrapper" class="fspm font-bold" >
            {{props.currentBoardType}}
        </div>

        <div id="boardsSelectionWrapper" class="d-flex justify-content-center">
            <a id="selectorLabel" href="#" @click.prevent="methods.aclickdel">
                <div id="currentSelection" class="d-flex justify-content-between align-items-center fspm font-bold over-cursor"
                @mouseover="methods.overSelectionList"
                @mouseout="methods.outSelectionList">
                    <div>
                        {{params.orderSortingList[props.currentOrderType]}}
                    </div>&nbsp;
                    <div id="selectorIconWrapper" class="d-flex align-self-center" style="padding: 0.25rem 0 0 0.25rem;">
                        <div id="selectorIcon" class="d-flex align-self-center is-have-fast-transition out">
                            <i class="bi bi-caret-down"></i>
                        </div>
                    </div>
                </div>
            </a>
            <div id="selectorListWrapper" class="fsps border-radius-c" v-if="params.selectorVisible" tabindex="-1">
                <ul id="selectorList" class="d-flex flex-column border-radius-b px-2">
                    <li v-for="item, index in params.orderSortingList" :key="item" @mousedown="methods.changeOrdeStandard(index)"
                    class="container-fluid justify-content-center mx-auto my-2 px-2 over-cursor border-radius-c">{{item}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'

export default {
    name:'ListOrderBoxVue',
    props:{
        currentBoardType: String,
        currentOrderType: Number
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            selectorVisible: false,
            orderSortingList: [
                '최신',
                '추천수',
                '조회수',
                '댓글수',
            ],
        });

        const intervals = {
            orderInterval: null
        };

        const methods = {
            overSelectionList: ()=>{
                if(params.value.selectorVisible){

                } else{
                    $('#selectorIcon').removeClass('out');
                    $('#selectorIcon').addClass('over');
                }
            },
            outSelectionList: ()=>{
                if(params.value.selectorVisible){

                } else{
                    $('#selectorIcon').removeClass('over');
                    $('#selectorIcon').addClass('out');
                }
            },
            aclickdel: ()=>{
                // console.log(document.activeElement.id);
            },
            changeOrdeStandard: (index)=>{
                // params.value.currentIndex = index;
                console.log(index);
                context.emit("LISTORDERCALLER", {'order': index});
            },
        };

        onMounted(()=>{
            document.getElementById("selectorLabel").onfocus=()=>{
                params.value.selectorVisible = true;
                $('#selectorIcon').removeClass('out');
                $('#selectorIcon').addClass('over');
            };

            document.getElementById("selectorLabel").onblur=()=>{
                params.value.selectorVisible = false;
                $('#selectorIcon').removeClass('over');
                $('#selectorIcon').addClass('out');
            };

            intervals.orderInterval = setInterval(()=>{
                if(!store.getters.GET_IS_LOGIN || ['o', 'm'].indexOf(store.getters.GET_AUTH) === -1){
                    if(params.value.orderSortingList.indexOf('신고수') !== -1){
                        params.value.orderSortingList.pop();

                        if(props.currentOrderType === 4){
                            context.emit("LISTORDERCALLER", {'order': 0});
                        }
                    }
                } else{
                    if(params.value.orderSortingList.indexOf('신고수') === -1){
                        params.value.orderSortingList.push('신고수');
                    }
                }
            }, 1000);
        });

        onUpdated(()=>{
            // if(!store.getters.GET_IS_LOGIN || ['o', 'm'].indexOf(store.getters.GET_AUTH) === -1){
            //     if(params.value.orderSortingList.indexOf('신고수') !== -1){
            //         params.value.orderSortingList.pop();

            //         if(props.currentOrderType === 4){
            //             context.emit("LISTORDERCALLER", {'order': 0});
            //         }
            //     }
            // } else{
            //     if(params.value.orderSortingList.indexOf('신고수') === -1){
            //         params.value.orderSortingList.push('신고수');
            //     }
            // }
        });

        onUnmounted(()=>{
            document.getElementById("selectorLabel").onfocus = null;

            document.getElementById("selectorLabel").onblur = null;

            clearInterval(intervals.orderInterval);
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

.out{
    transform: rotate(0.25turn);
}

.over{
    transform: rotate(0);
}

#selectorListWrapper{
    position: absolute;
    margin-top: 3em;
}

#selectorList{
    list-style: none;
    margin: 0;
    padding: 0;
    background: white;
    box-shadow: 0px 2px 2px orangered, 0px -2px 2px orangered, 2px 0px 2px orangered, -2px 0px 2px orangered;
}

li{
    color: rgb(20, 0, 51);
}

li:hover{
    color: rgb(0, 102, 255);
    background-color: rgb(200, 222, 254);
}

.is-selected-btype{
    color: cornflowerblue;
}

.over-cursor-blue:hover{
    color: cornflowerblue;
}

</style>
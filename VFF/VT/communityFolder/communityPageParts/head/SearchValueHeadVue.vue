<template>
    <div id="community-header-main-wrapper" style="margin:0 1vmin;" class="d-flex flex-wrap align-self-center main-container-width justify-content-center border-radius-d">
        <div id="inputGroup" class="d-flex justify-content-center m-0 border-radius-d" :style="`height:${store.getters.GET_BROWSER_SIZE <= 700?'34.75':'4vh'};`">
            
            <i id="dodbogi" :class="`${params.iconValueJson[params.selectIconValue]} align-self-center fspm over-cursor is-have-plain-transition`" style="padding:3px; margin: 0 7px 0 0;"
            @click="methods.dodbogiClick">
                <div id="dodbogi-hawi-wrapper"
                :class="`d-flex justify-content-around border-radius-a fspl is-have-plain-transition dodbogi-hawi ${params.isClickedDodbogi?'dodbogi-hawi-invisible':'dodbogi-hawi-invisible'}`"
                :style="`padding:0 3px 0 3px; width:${params.isClickedDodbogi?`${methods.getInputGroupWidth()}px`:'0vw;'}; height:${store.getters.GET_BROWSER_SIZE <= 700?'26.75':'3vh'};`">
                    
                    <i @mouseover="methods.overIcon(0)" @click="methods.iconClick(0)"
                    :class="`d-flex flex-wrap align-items-center h-100 px-2 fspm bi bi-search align-self-center over-cursor is-have-plain-transition ${params.isHoverIconValue === 0?'is-seleted-icon':''}`">
                        <span class="fsps px-2">전체</span>
                    </i>

                    <i @mouseover="methods.overIcon(1)" @click="methods.iconClick(1)"
                    :class="`d-flex flex-wrap align-items-center h-100 px-2 fspl bi bi-person-lines-fill align-self-center over-cursor is-have-plain-transition ${params.isHoverIconValue === 1?'is-seleted-icon':''}`">
                        <span class="fsps px-2">유저</span>
                    </i>

                    <!-- <i @mouseover="methods.overIcon(2)" @click="methods.iconClick(2)"
                    :class="`d-flex flex-wrap align-items-center h-100 px-2 fspm bi bi-clock-history align-self-center over-cursor is-have-plain-transition ${params.isHoverIconValue === 2?'is-seleted-icon':''}`">
                        <span class="fsps px-2">전적</span>
                    </i> -->
                </div>
            </i>


            <input type="text" class="flex-grow-1 fspm border-radius-d" id="mainWrapperText" placeholder="입력해주세요."
            v-model="params.searchValue" @keydown.enter="methods.searchEnter" autocomplete="off">


            <i v-if="params.searchValue.length > 0" 
            @mousedown="methods.reset"
            class="bi bi-x align-self-center fspm over-cursor" 
            style="padding:0 3px 0 10px;"/>
        </div>
        <!-- <div id="preSearchContainer">

        </div> -->
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'

export default {
    name:'SearchValueHeadVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
            searchValue: '', searchCode: 1, // 0 - 전체, 1 - 유저검색
            page: 1, pageSize: 5,
            isClickedDodbogi: false, isHoverIconValue: 0, selectIconValue: 0,
            iconValueJson: {
                0:'bi bi-search fspm',
                1:'bi bi-person-lines-fill fspm',
                2:'bi bi-clock-history fspm', 
            },
        });

        const intervals = {
            autoComInterval: null,
        };

        const methods = {
            reset: ()=>{
                params.value.searchValue = '';
            },
            dodbogiClick: ()=>{
                params.value.isClickedDodbogi = !params.value.isClickedDodbogi;
            },
            overIcon: (index)=>{
                params.value.isHoverIconValue = index;
            },
            iconClick: (index)=>{
                params.value.selectIconValue = index;
                params.value.searchCode = index;
            },
            getInputGroupWidth: ()=>{
                return document.getElementById('inputGroup').offsetWidth-24;
            },
            searchEnter: (e)=>{
                try {
                    if(params.value.searchValue){
                        $(':focus').blur();
                        context.emit('CHANGEPAGE', {isOpen: 'b'});
                        store.commit('SEARCH_USER', {userName: params.value.searchValue, page: params.value.page, pageSize: params.value.pageSize, searchCode: params.value.searchCode});
                    }     
                } catch (error) {
                    console.log(error);
                }
            }
        };

        onMounted(()=>{
            $('#mainWrapperText').on('focus', ()=>{
                $('#inputGroup').addClass('inputGroup-focus');
                $('#preSearchContainer').addClass('inputGroup-focus');
            });

            $('#mainWrapperText').on('focusout', ()=>{
                $('#inputGroup').removeClass('inputGroup-focus');
                $('#preSearchContainer').removeClass('inputGroup-focus');
            });
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{
        });

        return{
            params, methods, store
        };
    },
}
</script>

<style scoped>
#dodbogi{
    position: relative;
}

input[type=text] { 
    border: none;
    background: black;
    opacity: 0.7;
    color: white;
    width: 100%;
    transition: all 0.3s ease;
}

input[type=text]:focus{ 
    outline: none;
    background: white;
    opacity: 1;
    color: black;
}

.inputGroup-focus { 
    outline: solid cornflowerblue;
    /* box-shadow: 4px 0px cornflowerblue, -4px 0px cornflowerblue, 0px -4px cornflowerblue; */
    background: white;
    opacity: 1;
    color: black;
}


#autoComplete{
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    color: black;
    margin: 0 2vw;
    top: 60px;
    list-style: none;
}

#inputGroup{
    z-index: 0;
}

#preSearchContainer{
    z-index: 1;
}

@media screen and (max-width: 1000px){
    #inputGroup{
        padding: 0 1.5vmin;
        width: 60vw;
        transition: all 0.3s ease;
    }

    /* #preSearchContainer{
        padding: 0 1.5vmin;
        width: 60vw;
        transition: all 0.3s ease;
    } */

    #dodbogi-hawi-wrapper{
        padding: 0 1.5vmin;
        /* width: 60vw; */
    }

    #autoComplete{
        width: 66vw;
    }
}

@media screen and (min-width: 1000px){
    #inputGroup{
        padding: 0 1.5vmin;
        width: 30vw;
        transition: all 0.3s ease;
    }

    /* #preSearchContainer{
        padding: 0 1.5vmin;
        height: 10px;
        width: 30vw;
        transition: all 0.3s ease;
    } */

    #dodbogi-hawi-wrapper{
        padding: 0 1.5vmin;
        /* width: 30vw; */
    }

    #autoComplete{
        width: 26vw;
    }
}

#dodbogi-hawi-wrapper{
    position: absolute;
    color:white;
    background-color: rgba(255, 255, 255, 0);
    border: 1px cornflowerblue solid;
    transform-origin: left;
    top: 50px;
    left: 0;
    overflow: hidden;
    cursor: default;
}

.dodbogi-hawi-invisible{
    color: transparent;
    background-color: transparent;
    border: 1px transparent solid;
    opacity: 0;
}

.is-seleted-icon{
    color: rgb(29, 104, 243);
}

i{
    font-style: normal;
    font-weight: 700;
    
}

</style>
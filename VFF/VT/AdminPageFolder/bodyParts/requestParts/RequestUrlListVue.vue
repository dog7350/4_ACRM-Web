<template>
    <div :id="`requestURLListWrapper${params.form.mainTitle.unique}`" :class="`${params.isOpen?'opend':''} request-url-list-wrapper d-flex flex-wrap justify-content-center`">
        <div @click="methods.click"
        id="collapseToggle" class="container-fluid over-cursor d-flex justify-content-between is-have-plain-transition">
            <!-- <div id="protocolWrapper" class="align-self-center border-radius-a test-border d-flex justify-content-center">
                <span class="align-self-center text-center">프로토콜명</span>
            </div> -->
            <div id="URLVibiler" class="align-self-center text-start flex-grow-1 fspl font-bold">
                {{params.form.mainTitle.url}}
            </div>
            <div id="toggleButton" :class="`align-self-center is-have-plain-transition ${params.isOpen? 'is-opend': ''}`">
                <i class="bi bi-arrow-bar-down icon-size-standard"></i>
            </div>
        </div>

        <transition name="url-fade" mode="out-in">
        <div v-if="params.isOpen" id="collapserWrapper" style="margin: 0.5em 0;">
            <div id="collapser">
                <request-url-vue
                v-for="jsonForm, index in params.form.action"
                :key="index"
                :infoForm="jsonForm"
                :parentUnique="params.form.mainTitle.unique"
                ></request-url-vue>
            </div>
        </div>
        </transition>

    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'
import AXIOS from 'axios';
import RequestUrlVue from './RequestUrlVue.vue';

export default {
    components: { RequestUrlVue },
    props: {
        form: JSON,
    },
    name:'RequestUrlListVue',
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();
        
        const params = ref({
            isOpen: false,
            form: props.form? props.form: {},
        });

        const methods = {
            click: ()=>{
                params.value.isOpen = !params.value.isOpen;
            },
            bodyActionRegisted: (payload)=>{
                context.emit("BODYACTIONREGISTED", payload);
            }
        }

        onMounted(()=>{
            methods.bodyActionRegisted(props.form);
        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
.request-url-list-wrapper{
    position: relative;
    overflow: hidden;
    z-index: 5;
    width: 90%;
    margin-top: 20px;
}

#collapseToggle{
    padding: 1em 1.2em;
    border-bottom: 1px cornflowerblue solid;
}

#collapseToggle:hover{
    background-color: rgba(255, 255, 255, 0.1);
}

#collapserWrapper{
    position: relative;
    width: 100%;
    padding: 0;
}

.url-fade-enter-from{
    /* transform: translateY(-100%); */
    opacity: 0;
}

.url-fade-leave-to{
    /* transform: translateY(-100%); */
    opacity: 0;
}

.url-fade-enter-active, .url-fade-leave-active{
    transition: all 0.5s ease;
}

#URLVibiler{
    /* padding: 0 1.5em; */
}

#protocolWrapper{
    padding: 2px;
    min-width: 7em;
    height: 100%;
}

.is-opend{
    transform: rotate(-180deg);
}
</style>
<template>
    <li style="font-weight: bold;" class="w-100 p-0 mx-0 mb-2 alert alert-info border-radius-a text-start d-flex flex-wrap px-3 py-1">
        <div class="w-100 fsps">
            <span class="opacity-half">{{methods.convertDate(props.item.notifidate)}}</span>
        </div>
        <div class="text-align-center w-100 fspm">
             {{methods.convertContent(props.item)}}
        </div>
    </li>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'

const yyyymmdd_HHMMSS = (dateTime)=>{
    let result = 'yyyy-mm-dd HH:MM:ss';
    try{
        var timeZone = new Date(dateTime);
        var time = timeZone.toString().split(' ')[4];
        var date = null;

        var year = timeZone.getFullYear();
        var month = timeZone.getMonth()+1;
        var day = timeZone.getDate();

        date = `${year}-${("00"+month.toString()).slice(-2)}-${("00"+day.toString()).slice(-2)}`;
        result = date + ' ' + time;
    }
    catch(error){
        console.log(error);
    }

    return result;
}

export default {
    name:'NotifiPart',
    props:{
        item: JSON,
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const params = ref({
        });

        const methods = {
            convertDate: (date)=>{
                return yyyymmdd_HHMMSS(date);
            },
            convertContent: (item)=>{
                let tempJson = JSON.parse(item.content);
                let content = Base64.decode(tempJson.content);

                if(tempJson.type === 100){
                    return `${props.item.name} 님이 게시글 '${content}'을(를) 작성했습니다.`;
                } if(tempJson.type === 200 || tempJson.type === 201 || tempJson.type === 300 || tempJson.type === 400){
                    return content;
                } else{
                    console.log(item);
                    return '타입을 지정하지 않았습니다!';
                }
            },
        };

        onMounted(()=>{
            
        });

        onUpdated(()=>{

        });

        onUnmounted(()=>{

        });

        return{
            params, methods, store, props
        };
    },
}
</script>

<style scoped>
.opacity-half{
    opacity: 0.7;
}
</style>
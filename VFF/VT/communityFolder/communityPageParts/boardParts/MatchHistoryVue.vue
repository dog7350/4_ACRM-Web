<template>
    <div id="matchHistoryContentsWrapper" class="w-100">
        <div id="matchHistoryContents" class="w-100 d-flex justify-content-center">
            <div id="resultLeftWrapper" class="h-100" 
            :style="`background-color: ${props.result<4? 'orange': '#543701'}; border: 1px ${props.result<4? 'orange': '#543701'} solid;`">

            </div>

            <div id="resultMainWrapper" class="d-flex align-items-center py-2"
            :style="`border: 1px ${props.result<4? 'orange': '#543701'} solid;`">
                <div id="resultNumberWrapper" class="d-flex flex-column justify-content-center text-center fspll font-bold px-4" 
                :style="`color: ${props.result<4?'#11b288': '#6a6a6a'};`">
                    <div>
                        #{{props.result}}
                    </div>
                    <div id="matchDateWrapper" class="fspss" data-bs-toggle="tooltip" data-bs-placement="right" :title="params.sliceDate">
                        {{params.timeDiff}}
                    </div>
                </div>

                
                <div id="multipleWrapper" class="d-flex justify-content-around flex-grow-1">
                    <div id="logoWrapper" class="border-radius-b">
                        <img data-bs-toggle="tooltip" data-bs-placement="right" :title="props.name" width=50 height=50
                        :src="`${props.logoPath? props.logoPath:'/images/board/logos/none.png'}`" @error="`/images/board/logos/none.png`" alt="">
                    </div>

                    <div id="matchCarWrapper" class="border-radius-b">
                        <img data-bs-toggle="tooltip" data-bs-placement="right" :title="props.resultCar" width=50 height=50
                        :src="`${`/images/cars/car${props.resultCarNum-1}.png`}`" @error="`/images/board/logos/none.png`" alt="">
                    </div>

                    <div id="matchGunWrapper" class="border-radius-b">
                        <img data-bs-toggle="tooltip" data-bs-placement="right" :title="props.resultGun" width=50 height=50
                        :src="`${`/images/guns/gun${props.resultGunNum-1}.jpg`}`" @error="`/images/board/logos/none.png`" alt="">
                    </div>
                </div>
            </div>

            <div id="resultRightWrapper" class="h-100" 
            :style="`background-color: ${props.result<4? 'orange': '#543701'}; border: 1px ${props.result<4? 'orange': '#543701'} solid;`">

            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../VXS/VuexStore'

const timeDiff = (resultTime)=>{
    var day1 = new Date(Date.now());
    var day2 = new Date(resultTime);
    var day3 = (day1 - day2) / 1000;

    var scaleCompare = [
        {scale: 365*24*60*60, exp:'년전'},
        {scale: 30*24*60*60, exp:'월전'},
        {scale: 24*60*60, exp:'일전'},
        {scale: 60*60, exp:'시간전'},
        {scale: 60, exp:'분전'},
        {scale: 1, exp:'초전'},
    ];

    var dayCompare = scaleCompare.map((value)=>{
        var mapResult = parseInt(day3/value.scale);

        if(mapResult > 0){
            return mapResult+value.exp;
        } else{
            return false
        }
    });

    var result = '최근';

    for(var i in dayCompare){
        if(dayCompare[i] !== false){
            result = dayCompare[i];
            break;
        }
    }

    return result;
}

export default {
    name:'MatchHistoryVue',
    props: {
        id: String,
        name: String,
        matchDate: String,
        result: String,
        resultCarNum: Number,
        resultGunNum: Number,
        resultCar: String,
        resultGun: String,
        logoPath: String
    },
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        

        const params = ref({
            timeDiff: null,
            sliceDate: null,
        });

        const methods = {

        };

        params.value.sliceDate = props.matchDate.split('T')[0] + ' ' + props.matchDate.split('T')[1].substr(0, 8);

        onMounted(()=>{
            params.value.timeDiff = timeDiff(props.matchDate);

            console.log(props);

            let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            })
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

#matchHistoryContentsWrapper{

}

#matchHistoryContents{
    position: relative;
}

#resultMainWrapper{
    width: 96%;
    cursor: default;
}

#resultLeftWrapper{
    position: absolute;
    width: 2%;
    top: 0;
    left: 0;
}

#resultRightWrapper{
    position: absolute;
    width: 2%;
    top: 0;
    right: 0;
}

#logoWrapper{
    border: 1px rgb(255, 51, 51) solid;
    overflow: hidden;
}

#matchCarWrapper{
    border: 1px rgb(26, 102, 241) solid;
    overflow: hidden;
}

#matchGunWrapper{
    border: 1px rgb(5, 250, 156) solid;
    overflow: hidden;
}


</style>
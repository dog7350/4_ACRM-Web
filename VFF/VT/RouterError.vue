<template>
    <div class="container-fluid d-flex justify-content-center">
        <div class="container-fluid d-flex flex-column text-align-center">

            <div class="container-fluid d-flex justify-content-center">
                <img src="/images/etcs/blockpage.png" alt="넌모찌나간다." style="width:500px" @click="methods.routeMain">
            </div>
            
            <div class="container-fluid d-flex justify-content-center">
                <h1>넌 모찌나간다.</h1>
            </div>
            
            <div class="container-fluid d-flex justify-content-center">
                <h3>404 NOT FOUND</h3>
            </div>
            
        </div>
    </div>
</template>

<script>
import {useRouter} from 'vue-router'

export default {
    name:'RouterError',
    setup() {
        const router = useRouter();

        const methods = {
            routeMain: ()=>{
                router.push('/main');
            }
        };
        return {
            methods
        };
    },
}
</script>

<style>

</style>
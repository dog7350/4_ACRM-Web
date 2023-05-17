<template>
    <div id="GoodsInfoRootWrapper" class="container-fluid m-0 p-0 d-flex flex-wrap justify-content-center" style="position:fixed; z-index:1501; width:80vw; height: auto; min-width:300px; max-width:800px;">
        <div id="GoodsInfoWrapper" class="m-0 px-0 py-3 d-flex flex-wrap container-fluid border-radius-d">
            <div id="titleWrapper" :class="`container-fluid mt-${store.getters.GET_IS_MOBILE? 1:3} p-0 text-center fsplll font-bold`">
                {{params.itemInfo.goodsName}}
            </div>
            <div :class="`container-fluid mx-0 mt-${store.getters.GET_IS_MOBILE? 1:3} mb-0 p-0`" style="border: 1px solid black; height:1px;"
            ></div>

            <div id="contentsRoot" class="container-fluid m-0 p-0 d-flex flex-wrap awesome-scroll">
                <div id="contentWrapper" class="d-flex flex-wrap container-fluid mt-3 mx-2 p-2 text-center fspm font-bold border-radius-b">
                    {{params.itemInfo.goodsPs}}
                </div>
                <div id="contentWrapper" class="d-flex flex-wrap container-fluid mt-3 mx-2 p-2 text-center fspm font-bold border-radius-b">
                    <span style="color: rgba(0,0,0,0.7)">최대 구매 가능 개수는&nbsp;{{params.itemInfo.maxNumberOfProduct}}개 입니다.</span>
                </div>
                <div id="contentWrapper" class="d-flex flex-wrap container-fluid mt-3 mx-2 p-2 text-center fspm font-bold border-radius-b">
                    <img 
                    class="w-100 m-0 p-0" :src="params.itemInfo.goodsImagePath" @error="(e)=>{e.target.src='/images/board/logos/none.png'}" alt="">
                </div>
            </div>
            
            <div style="border: 3px solid rgb(75, 75, 75);"
            id="buyingWrapper" class="container-fluid d-flex flex-wrap justify-content-between mt-3 mx-2 py-2 px-4 text-center fsps border-radius-b">
                <div class="d-flex flex-wrap m-0 p-0 justify-content-around align-items-center fspm font-bold">
                    <div>
                        개당 가격
                    </div> 
                    <div class="ms-2">
                        {{params.itemInfo.price}} 캐쉬
                    </div>
                </div>
                
                <div class="d-flex flex-wrap m-0 p-0 justify-content-around align-items-center">
                    <div>
                        <input v-model="params.currentValue"
                        type="number" name="" id="">&nbsp;개
                    </div> 
                </div>

                <div class="container-fluid mx-0 mt-1 mb-0 p-0"  style="border: 1px solid black; height: 1px;"></div>

                <div class="container-fluid d-flex flex-wrap m-0 my-2 p-0 justify-content-start align-items-center text-start">
                    <div class="fspm font-bold mb-2">
                        배송지 <input class="mx-2 fsps" @click="methods.checkAddress" type="button" value="주소찾기">
                    </div> 
                    <div class="container-fluid d-flex flex-wrap px-0">
                        <input class="container-fluid" v-model="params.address" placeholder="주소 (미 입력시 등록되어있는 기본주소로 배송됩니다.)"
                        type="text" name="" id="">
                    </div> 
                </div>

                <div class="container-fluid mx-0 mt-1 mb-0 p-0" style="border: 1px solid black; height:1px;"></div>
                <div class="container-fluid d-flex flex-wrap m-0 p-0 mt-1 justify-content-between align-items-center">
                    <div class="fspm d-flex">
                        결제 방식: &nbsp;
                        <div class="fsps d-flex align-self-center">
                            <div class="form-check d-flex align-self-center">
                                <input type="radio" class="form-check-input" id="pradio1" name="optradio" value="1" checked v-model="params.purchaseType">
                                <label class="form-check-label" for="pradio1">현금 결제</label>
                            </div>
                            &nbsp;&nbsp;
                            <div class="form-check d-flex align-self-center">
                                <input type="radio" class="form-check-input" id="pradio2" name="optradio" value="2" v-model="params.purchaseType">
                                <label class="form-check-label" for="pradio2">캐쉬 구매</label>
                            </div>
                            &nbsp;&nbsp;
                            <div class="form-check d-flex align-self-center">
                                <input type="radio" class="form-check-input" id="pradio3" name="optradio" value="3" v-model="params.purchaseType">
                                <label class="form-check-label" for="pradio3">하이브리드 결제</label>
                            </div>
                        </div>
                    </div>

                    <div class="fsps font-red">
                        {{
                            params.purchaseType === "1"? '현금 결제 시 캐쉬를 사용하지 않아 결제를 진행합니다.': ''
                        }}
                        {{
                            params.purchaseType === "2"? '캐쉬 구매 시 해당 금액만큼 캐쉬를 충전하여 구매를 진행합니다.': ''
                        }}
                        {{
                            params.purchaseType === "3"? '현재 가지고 있는 캐쉬를 원하는 만큼 사용하여 구매를 진행합니다.': ''
                        }}
                    </div>
                </div>

                <div class="container-fluid mx-0 mt-1 mb-0 p-0" style="border: 1px solid black; height:1px;"></div>
                <div class="container-fluid d-flex flex-wrap m-0 p-0 mt-1 justify-content-between align-items-center">
                    <div class="fspm">
                        현재 결제 금액: &nbsp;{{params.currentValue*params.itemInfo.price}} 캐쉬
                    </div>
                    
                    <div @click="methods.buyProductDebounced"
                    class="btn btn-primary">
                        구매하기
                    </div>
                </div>
            </div>
        </div>
        <div v-if="params.hybridOn"
        id="GoodsHBPopWrapper" :class="`d-flex flex-wrap justify-content-center align-items-center text-black `">
            <div id="purchaseFormWrapper" :class="`border-test d-flex flex-wrap justify-content-center align-items-center p-4 border-radius-c`">
                <div id="mx-4 my-3 px-3 px-2 d-flex justify-content-center">
                    <div id="" :class="`container-fluid text-end justify-content-end fsplll`">
                        <i @click="methods.cancleHybrid"
                        class="bi bi-x-square-fill over-cursor"></i>
                    </div>

                    <div id="" :class="`container-fluid text-center fsplll font-bold`">
                        하이브리드 결제
                    </div>

                    <div class="w-100 mt-2" style="height:1px; border: 1px solid black;"></div>

                    <div id="" :class="`w-100 mt-2 text-start `">
                        현재 보유 캐쉬: {{store.state.myInfo.cash}}
                    </div>
                    <div id="" :class="`w-100 mt-2 text-start  d-flex`">
                        <label for="">사용할 캐쉬: </label>
                        <input type="number" name="" id="" v-model="params.useMoney">
                    </div>
                    <div id="" :class="`w-100 mt-2 text-start `">
                        충전 할 금액이 없는 경우 전부 캐쉬에서 차감됩니다!
                    </div>

                    <div class="w-100 mt-2" style="height:1px; border: 1px solid black;"></div>

                    <div id="" :class="`w-100 mt-2 text-start `">
                        총 결제 금액: {{(params.currentValue*params.itemInfo.price)}}
                    </div>
                    
                    <div id="" :class="`w-100 mt-2 text-start `">
                        충전 할 금액: {{(params.currentValue*params.itemInfo.price)-params.useMoney}}
                    </div>
                    
                    <div class="w-100 mt-2" style="height:1px; border: 1px solid black;"></div>

                    <div @click="methods.purcahseHybrid"
                    class="w-100 mt-2 btn btn-primary">
                        구매하기
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Store from '../../../../../VXS/VuexStore'
import axios from 'axios';
import { debounce } from 'lodash';

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
    name: "GoodsInfo",
    setup(props, context) {
        const store = Store;
        const route = useRoute();
        const router = useRouter();

        const { IMP } = window;
        

        IMP.init('imp84365986');

        const params = ref({
            itemInfo: store.state.goodsInfo, currentValue: 0, waitAMinute: false, hybridOn: false, 
            postNumber: '', baseAddr: '', address: '', purchaseType: '1', useMoney: 0,
        });

        const methods = {
            buyProduct: ()=>{
                // console.log("ptype ->", params.value.purchaseType);

                if(!params.value.waitAMinute){
                    params.value.waitAMinute = true;

                    let body = {
                        goodsNumber: params.value.itemInfo.goodsNumber,
                        value: params.value.currentValue,
                        address: params.value.address, 
                    };

                    if(body.value == 0){
                        store.commit('CREATE_ALERT', {msg: '구매 수량은 하나 이상이여야 합니다.', time: 2, type:"danger"});
                        params.value.waitAMinute = false;
                    } else{
                        if(params.value.purchaseType == "1"){
                            
                            store.commit("SET_FORCED_REQ_PRICE", {forcedReqPrice: params.value.currentValue*params.value.itemInfo.price});
                            store.commit("SET_LAST_BUY_BODY_PRODUCT", {lastBuyBodyValue: {...body, isDirect: true}});
                            
                            setTimeout(()=>{
                                let socketListen = `buy_now_${store.state.myInfo.id}`;
                                let nextUrl = `__main__shop___isBuying_____gn____${body.goodsNumber}_____vl____${body.value}_____adr____${body.address}`;
                                
                                if(store.getters.GET_IS_MOBILE){
                                    // console.log(nextUrl);
                                    store.commit('SET_NEXT_URL', {'nextUrl': nextUrl});
                                }

                                

                                store.commit('OPEN_FOREGROUND', {name: 'CashChargeVue'});

                                store.getters.GET_SOCKET.on(socketListen, (payload)=>{
                                    store.getters.GET_SOCKET.off(socketListen);

                                    let plushBody = store.getters.GET_LAST_BUY_BODY_PRODUCT;
                                    store.commit("SET_LAST_BUY_BODY_PRODUCT", {lastBuyBodyValue: null});
                                    console.log(payload);
                                    
                                    axios.post('/shop/goods', plushBody)
                                    .then((response)=>{
                                        store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"primary"});
                                    })
                                    .catch((error)=>{
                                        console.log(error.response);
                                        store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                                    })
                                    .finally(()=>{
                                        store.commit('REMOVE_LOADING');
                                        store.commit("CLOSE_FOREGROUND");
                                    });
                                });
                            }, 50);
                        } else if(params.value.purchaseType == "2"){
                            axios.post('/shop/goods', body)
                            .then((response)=>{
                                let result = response.data.gap;
                                let socketListen = `buy_now_${store.state.myInfo.id}`;
                                console.log(response);

                                if(response.status === 201){
                                    store.commit('CREATE_QUESTION', {
                                        questionText: "캐쉬가 모자랍니다 충전을 진행하시겠습니까?", 
                                        yesText: "예", 
                                        noText: "아니오",
                                        method: (isOk)=>{
                                            if(isOk){
                                                // store.commit('CREATE_ALERT', {msg: "충전을 더 하겠습니다.", time: 2, type:"primary"});
                                                store.commit("SET_FORCED_REQ_PRICE", {forcedReqPrice: result});
                                                store.commit("SET_LAST_BUY_BODY_PRODUCT", {lastBuyBodyValue: body});

                                                let nextUrl = `__main__shop___isBuying_____gn____${body.goodsNumber}_____vl____${body.value}_____adr____${body.address}`;
                                
                                                if(store.getters.GET_IS_MOBILE){
                                                    // console.log(nextUrl);
                                                    store.commit('SET_NEXT_URL', {'nextUrl': nextUrl});
                                                }

                                                
                                                
                                                setTimeout(()=>{
                                                    store.commit('OPEN_FOREGROUND', {name: 'CashChargeVue'});

                                                    store.getters.GET_SOCKET.on(socketListen, (payload)=>{
                                                        store.getters.GET_SOCKET.off(socketListen);

                                                        let plushBody = store.getters.GET_LAST_BUY_BODY_PRODUCT;
                                                        store.commit("SET_LAST_BUY_BODY_PRODUCT", {lastBuyBodyValue: null});
                                                        console.log(payload);
                                                        
                                                        axios.post('/shop/goods', plushBody)
                                                        .then((response)=>{
                                                            store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"primary"});
                                                        })
                                                        .catch((error)=>{
                                                            console.log(error.response);
                                                            store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                                                        })
                                                        .finally(()=>{
                                                            store.commit('REMOVE_LOADING');
                                                            store.commit("CLOSE_FOREGROUND");
                                                        });
                                                    });
                                                }, 50);

                                            } else{
                                                store.commit('CREATE_ALERT', {msg: "충전을 하지 않겠습니다.", time: 2, type:"danger"});
                                            }
                                        },
                                    });
                                } else{
                                    store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"primary"});
                                    store.commit("CLOSE_FOREGROUND");
                                }
                            })
                            .catch((error)=>{
                                console.log(error.response);

                                store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                            })
                            .finally((response)=>{
                                params.value.waitAMinute = false;
                            });
                        } else{ // params.currentValue*params.itemInfo.price
                            console.log('hybridon');

                            // if(store.state.myInfo.cash === 0){
                            //     store.commit('CREATE_ALERT', {msg: "보유한 캐쉬가 없어 하이브리드 결제를 진행할 수 없습니다.", time: 2, type:"danger"});
                            //     return;
                            // }
                            params.value.hybridOn = true;
                            params.value.waitAMinute = false;
                        }
                    }              
                }
            },
            buyProductDebounced: null,
            checkAddress: ()=>{
                new daum.Postcode({
                    oncomplete: function(data) {
                        params.value.postNumber = data.zonecode;

                        var addr = ''; // 주소 변수
                        var extraAddr = ''; // 참고항목 변수

                        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                            addr = data.roadAddress;
                        } else { // 사용자가 지번 주소를 선택했을 경우(J)
                            addr = data.jibunAddress;
                        }

                        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                        if(data.userSelectedType === 'R'){
                            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                                extraAddr += data.bname;
                            }
                            // 건물명이 있고, 공동주택일 경우 추가한다.
                            if(data.buildingName !== '' && data.apartment === 'Y'){
                                extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                            }
                            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                            if(extraAddr !== ''){
                                extraAddr = ' (' + extraAddr + ')';
                            }
                        }

                        params.value.baseAddr = addr + " " + extraAddr;

                        params.value.address = `${params.value.postNumber}, ${params.value.baseAddr}`
                    }
                }).open();
            },
            cashEnoughQuestionMethod: (isOk)=>{
                if(isOk){
                    // store.commit('CREATE_ALERT', {msg: "충전을 더 하겠습니다.", time: 2, type:"primary"});
                    // store.commit("SET_FORCED_REQ_PRICE", {forcedReqPrice: });
                    store.commit('OPEN_FOREGROUND', {name: 'CashChargeVue'});

                } else{
                    store.commit('CREATE_ALERT', {msg: "충전을 하지 않겠습니다.", time: 2, type:"danger"});
                }
            },
            cancleHybrid: ()=>{
                params.value.hybridOn = false;
            },
            purcahseHybrid: ()=>{
                let body = {
                    goodsNumber: params.value.itemInfo.goodsNumber,
                    value: params.value.currentValue,
                    address: params.value.address, 
                };

                if(((params.value.currentValue*params.value.itemInfo.price)-params.value.useMoney) === 0){
                    axios.post('/shop/goods', body)
                    .then((response)=>{
                        let result = response.data.gap;
                        let socketListen = `buy_now_${store.state.myInfo.id}`;
                        console.log(response);

                        if(response.status === 201){
                            store.commit('CREATE_QUESTION', {
                                questionText: "캐쉬가 모자랍니다 충전을 진행하시겠습니까?", 
                                yesText: "예", 
                                noText: "아니오",
                                method: (isOk)=>{
                                    if(isOk){
                                        // store.commit('CREATE_ALERT', {msg: "충전을 더 하겠습니다.", time: 2, type:"primary"});
                                        store.commit("SET_FORCED_REQ_PRICE", {forcedReqPrice: result});
                                        store.commit("SET_LAST_BUY_BODY_PRODUCT", {lastBuyBodyValue: body});

                                        let nextUrl = `__main__shop___isBuying_____gn____${body.goodsNumber}_____vl____${body.value}_____adr____${body.address}`;
                        
                                        if(store.getters.GET_IS_MOBILE){
                                            // console.log(nextUrl);
                                            store.commit('SET_NEXT_URL', {'nextUrl': nextUrl});
                                        }

                                        
                                        
                                        setTimeout(()=>{
                                            store.commit('OPEN_FOREGROUND', {name: 'CashChargeVue'});

                                            store.getters.GET_SOCKET.on(socketListen, (payload)=>{
                                                store.getters.GET_SOCKET.off(socketListen);

                                                let plushBody = store.getters.GET_LAST_BUY_BODY_PRODUCT;
                                                store.commit("SET_LAST_BUY_BODY_PRODUCT", {lastBuyBodyValue: null});
                                                console.log(payload);
                                                
                                                axios.post('/shop/goods', plushBody)
                                                .then((response)=>{
                                                    store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"primary"});
                                                })
                                                .catch((error)=>{
                                                    console.log(error.response);
                                                    store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                                                })
                                                .finally(()=>{
                                                    store.commit('REMOVE_LOADING');
                                                    store.commit("CLOSE_FOREGROUND");
                                                });
                                            });
                                        }, 50);

                                    } else{
                                        store.commit('CREATE_ALERT', {msg: "충전을 하지 않겠습니다.", time: 2, type:"danger"});
                                    }
                                },
                            });
                        } else{
                            store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"primary"});
                            store.commit("CLOSE_FOREGROUND");
                        }
                    })
                    .catch((error)=>{
                        console.log(error.response);

                        store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                    })
                    .finally((response)=>{
                        params.value.waitAMinute = false;
                    });
                } else{
                        store.commit("SET_FORCED_REQ_PRICE", {forcedReqPrice: (params.value.currentValue*params.value.itemInfo.price)-params.value.useMoney});
                store.commit("SET_LAST_BUY_BODY_PRODUCT", {lastBuyBodyValue: {...body, isDirect: true}});
                
                setTimeout(()=>{
                    let socketListen = `buy_now_${store.state.myInfo.id}`;
                    let nextUrl = `__main__shop___isBuying_____gn____${body.goodsNumber}_____vl____${body.value}_____adr____${body.address}`;
                    
                    if(store.getters.GET_IS_MOBILE){
                        // console.log(nextUrl);
                        store.commit('SET_NEXT_URL', {'nextUrl': nextUrl});
                    }

                    

                    store.commit('OPEN_FOREGROUND', {name: 'CashChargeVue'});

                    store.getters.GET_SOCKET.on(socketListen, (payload)=>{
                        store.getters.GET_SOCKET.off(socketListen);

                        let plushBody = store.getters.GET_LAST_BUY_BODY_PRODUCT;
                        store.commit("SET_LAST_BUY_BODY_PRODUCT", {lastBuyBodyValue: null});
                        console.log(payload);
                        
                        axios.post('/shop/goods', plushBody)
                        .then((response)=>{
                            store.commit('CREATE_ALERT', {msg: response.data.result, time: 2, type:"primary"});
                        })
                        .catch((error)=>{
                            console.log(error.response);
                            store.commit('CREATE_ALERT', {msg: error.response.data.result, time: 2, type:"danger"});
                        })
                        .finally(()=>{
                            store.commit('REMOVE_LOADING');
                            store.commit("CLOSE_FOREGROUND");
                        });
                    });
                }, 50);
                }
            }
        };

        methods.buyProductDebounced = debounce(methods.buyProduct, 300);

        watch(()=>store.getters.GET_IS_LOGIN, (a, b)=>{

        });

        watch(()=>params.value.currentValue, (a, b)=>{
            if(!Number.isInteger(parseInt(a))){
                alert("구매갯수는 숫자만 지정할 수 있습니다.");
                params.value.currentValue = 0;
            }

            if(parseInt(a) > params.value.itemInfo.maxNumberOfProduct){
                alert("최대 구매 가능 개수는 "+params.value.itemInfo.maxNumberOfProduct+"개 입니다.");

                params.value.currentValue = params.value.itemInfo.maxNumberOfProduct;
            }

            if(parseInt(a) < 0){
                alert("0보다 작은 개수로는 정할 수 없습니다.");
                params.value.currentValue = 0;
            }
        });

        watch(()=>params.value.useMoney, (a, b)=>{
            if(a < 0) {
                params.value.useMoney = 0;

                store.commit('CREATE_ALERT', {msg: '사용할 캐쉬는 0원보다 커야합니다.', time: 2, type:"danger"});
                return;    
            }

            if(a > store.state.myInfo.cash){
                params.value.useMoney = store.state.myInfo.cash

                store.commit('CREATE_ALERT', {msg: '사용할 캐쉬는 소유한 캐쉬 보다 클 수 없습니다.', time: 2, type:"danger"});
                return;
            }

            if(a > (params.value.currentValue*params.value.itemInfo.price)){
                params.value.useMoney = (params.value.currentValue*params.value.itemInfo.price);

                store.commit('CREATE_ALERT', {msg: '사용할 캐쉬는 결제금액보다 클 수 없습니다.', time: 2, type:"danger"});
                return;
            }
        });

        watch(()=>params.value.hybridOn, (a, b)=>{
            if(a){
                params.value.useMoney = 0;
                store.commit("UPDATE_INFO", null);
            }
        });

        onMounted(()=>{
            if(store.getters.GET_IS_MOBILE){
                if(store.getters.GET_GOODS_INFO){
                    
                }
            }
        });

        return {
            params, methods, store, props, yyyymmdd_HHMMSS
        };
    },
}
</script>

<style scoped>
#GoodsInfoWrapper{
    border: 3px solid black;
    background-color: rgba(255, 255, 255, 1);
    /* min-height:600px; */
    color: black;
}

#contentWrapper{
    border: 3px solid rgb(75, 75, 75);
}

#contentsRoot{
    max-height: 550px;
    overflow-x: hidden;
    overflow-y: scroll;
}

@media screen and (max-width: 1000px) {
    #contentsRoot{
        max-height: 350px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
}

#GoodsHBPopWrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.301);
    color: black;;
}

#purchaseFormWrapper{
    border: 3px solid orange;
    background-color: rgb(211, 211, 211);
    min-width: 300px;
}
</style>
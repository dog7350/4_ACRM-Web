
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

module.exports = {
    testFilter: (resultData)=>{
        if(resultData){
            if(resultData.result && resultData.result.length && resultData.code === 200){
                resultData = resultData.result;

                resultData = resultData.map((item)=>{
                    // return {
                    //     content: `[${yyyymmdd_HHMMSS(item.createdAt)}]${item.id} : ${item.cmd} ${item.opt} ${item.content}`,
                    //     updateDate: yyyymmdd_HHMMSS(item.updatedAt),
                    // }
                    return ` [${yyyymmdd_HHMMSS(item.createdAt)}]${item.id} : ${item.cmd} ${item.opt} ${item.content} `
                });
            }
        }

        return resultData;
    },
    boardDecoder: (resultData)=>{
        if(resultData){
            if(resultData.result){
                if(resultData.result.boards && resultData.result.boards.length > 0){
                    for(var i in resultData.result.boards){
                        resultData.result.boards[i].title = Base64.decode(resultData.result.boards[i].title);
                        // console.log(resultData.result.boards[i].title);
                        resultData.result.boards[i].content = Base64.decode(resultData.result.boards[i].content);
                        
                        if(resultData.result.boards[i].imgPath){
                            var imgArray = resultData.result.boards[i].imgPath.split('c3BhY2VcdA==');
                            resultData.result.boards[i].imgPath = imgArray;
                        }
                        
                        resultData.result.boards[i].timeStamp = yyyymmdd_HHMMSS(resultData.result.boards[i].timeStamp);
                    }
                }
            }
        }
    
        return resultData;
    },
    boardsDecoder: (resultData)=>{
        if(resultData){
            if(resultData.result && resultData.result.length > 0){
                for(var i in resultData.result){
                    resultData.result[i].title = Base64.decode(resultData.result[i].title);
                    // console.log(resultData.result.boards[i].title);
                    resultData.result[i].content = Base64.decode(resultData.result[i].content);
                    
                    if(resultData.result[i].imgPath){
                        var imgArray = resultData.result[i].imgPath.split('c3BhY2VcdA==');
                        resultData.result[i].imgPath = imgArray;
                    }
                    
                    resultData.result[i].timeStamp = yyyymmdd_HHMMSS(resultData.result[i].timeStamp);
                }
            }
        }
    
        return resultData;
    },
    commentdDecoder: (resultData)=>{
        if(resultData){
            if(resultData.result){
                if(resultData.result.comments && resultData.result.comments.length > 0){
                    for(var i in resultData.result.comments){
                        // console.log(resultData.result.boards[i].title);
                        resultData.result.comments[i].content = Base64.decode(resultData.result.comments[i].content);
                        
                        
                        resultData.result.comments[i].timeStamp = yyyymmdd_HHMMSS(resultData.result.comments[i].timeStamp);
                    }
                }
            }
        }
    
        return resultData;
    },
}
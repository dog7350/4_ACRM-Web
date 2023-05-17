const mp = require('./EBF/T/mongooseDir/mongoPartner');

const allAsync = async ()=>{
    try {
        await mp.connectMongoose();
        await mp.findChat({createdAt: {$lt: new Date(Date.now()-24*60*60*1000)}}, null, null);

        console.log('\n');
        console.log(new Date(Date.now()-24*60*60*1000));
        console.log('\n');
    } catch (error) {
        console.log(error);
    }
}

allAsync();
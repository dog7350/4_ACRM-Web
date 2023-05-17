const mailsender = require('../EBF/T/mailsender');




async function mailSenddd(){
    try{
        console.log(await mailsender.sendMail('', '', ''));
    }
    catch(error){
        console.log(error);
    }
}

mailSenddd();
const mailler = require('nodemailer');
const dotEnv = require('./../CP/envHell');
const commonFunction = require('../RS/common');
const transporter = mailler.createTransport({
    host: dotEnv.SMTP_HOST,
    port: dotEnv.SMTP_PORT,
    secure: false,
    auth: {
      user: dotEnv.SMTP_ID,
      pass: dotEnv.SMTP_PW,
    },
  });

module.exports = {
  /**
   * @returns email 형식이 맞지않거나 문제가 발생할 경우 null
  */
  sendMail: async (to, subject, content)=>{
    let result = null;

    try {
      if(commonFunction.emailRegCheck(to)){
        result = await transporter.sendMail({
        from: dotEnv.SMTP_ID,
        to: to,
        subject: subject,
        html: `<h1>${content}</h1>`
        });
      } else{
        result = null;
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  },
};
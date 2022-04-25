const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    service: '163',
    port: 465,
    secureConnection: true,
    auth: {
        user: '18662535054@163.com',
        pass: 'BMDTHFJTSPZQJCJC'
    },
})

function sendMail(msg) {
    const mailOptions = {
        from: '"18662535054" <18662535054@163.com',
        to: 'lvjiajia@fofund.com.cn',
        subject: '部署通知',
        html: msg
    }
    
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error)
        }else{
            console.log('Message send: %s', info.messageId)
        }
    })
}

module.exports = sendMail;
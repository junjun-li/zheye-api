import nodemailer from 'nodemailer'

// async..await is not allowed in global scope, must use a wrapper
async function send (sendInfo) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount()

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // 这里需要换成发件服务器的域名
    host: 'smtp.qq.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '981311431@qq.com', // generated ethereal user
      pass: 'dcnnbewveqvfbbec' // generated ethereal password
    }
  })
  // let sendInfo = {
  //   code: '1234',
  //   expire: '2019-10-01',
  //   email: '11776174@qq.com',
  //   user: 'Brian'
  // }
  let url = 'http://www.imooc.com'
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"您正在更换邮箱 👻" <981311431@qq.com>', // 来自谁的
    to: sendInfo.email, // 接受者的邮箱
    subject: 'Imooc社区更换邮箱', // 邮件主体
    html: `
        <div style="border: 1px solid #dcdcdc;color: #676767;width: 600px; margin: 0 auto; padding-bottom: 50px;position: relative;">
          <div style="height: 60px; background: #393d49; line-height: 60px; color: #58a36f; font-size: 18px;padding-left: 10px;">Imooc社区——欢迎来到官方社区-您正在重置邮箱</div>
          <div style="padding: 25px">
            <div>您好，${sendInfo.user}童鞋，重置链接有效时间30分钟，请在${sendInfo.expire}之前重置您的邮箱：</div>
            <a href="${url}" style="padding: 10px 20px; color: #fff; background: #009e94; display: inline-block;margin: 15px 0;">立即重置邮箱</a>
            <div style="padding: 5px; background: #f2f2f2;">如果该邮件不是由你本人操作，请勿进行激活！否则你的邮箱将会被他人绑定。</div>
          </div>
          <div style="background: #fafafa; color: #b4b4b4;text-align: center; line-height: 45px; height: 45px; position: absolute; left: 0; bottom: 0;width: 100%;">系统邮件，请勿直接回复</div>
         </div>
      `
  })

  return 'Message sent: %s' + info.messageId
}

export default send

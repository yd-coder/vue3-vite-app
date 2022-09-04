const nodemailer = require('nodemailer')
const { body, validationResult } = require('express-validator') // 导入验证模块
const express = require('express')
const router = express.Router()
const db = require('../db')
const session = require('express-session')

const obj = {
  transporter: nodemailer.createTransport({
    host: 'smtp.qq.com', // 默认是这个
    secure: true, // 使用 SSL
    secureConnection: true, // 使用 SSL
    port: 465,
    auth: {
      user: '2395183536@qq.com',
      pass: 'kmynmbbqmidrdica',
    },
  }),

  send: function (mail, code) {
    const mailOptions = {
      subject: '注册验证码',
      from: '2395183536@qq.com',
      to: mail,
      text: `您的注册验证码为：${code}, 24小时内有效，请谨慎保管`,
      html: `
      <head>
      <base target="_blank" />
      <style type="text/css">::-webkit-scrollbar{ display: none; }</style>
      <style id="cloudAttachStyle" type="text/css">#divNeteaseBigAttach, #divNeteaseBigAttach_bak{display:none;}</style>
      <style id="blockquoteStyle" type="text/css">blockquote{display:none;}</style>
      <style type="text/css">
          body{font-size:14px;font-family:arial,verdana,sans-serif;line-height:1.666;padding:0;margin:0;overflow:auto;white-space:normal;word-wrap:break-word;min-height:100px}
          td, input, button, select, body{font-family:Helvetica, 'Microsoft Yahei', verdana}
          pre {white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;width:95%}
          th,td{font-family:arial,verdana,sans-serif;line-height:1.666}
          img{ border:0}
          header,footer,section,aside,article,nav,hgroup,figure,figcaption{display:block}
          blockquote{margin-right:0px}
          </style>
      </head>
      <body tabindex="0" role="listitem">
      <table width="700" border="0" align="center" cellspacing="0" style="width:700px;">
          <tbody>
          <tr>
              <td>
                  <div style="width:700px;margin:0 auto;border-bottom:1px solid #ccc;margin-bottom:30px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="700" height="39" style="font:12px Tahoma, Arial, 宋体;">
                          <tbody><tr><td width="210"></td></tr></tbody>
                      </table>
                  </div>
                  <div style="width:680px;padding:0 10px;margin:0 auto;">
                      <div style="line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d;">
                          <strong style="display:block;margin-bottom:15px;">尊敬的用户：<span style="color:#f60;font-size: 16px;"></span>您好！</strong>
                          <strong style="display:block;margin-bottom:15px;">
                              您正在进行<span style="color: red">账号注册</span>操作，请在验证码输入框中输入：<span style="color:#f60;font-size: 24px">${code}</span>，以完成操作(验证码5分钟内有效)。
                          </strong>
                      </div>
                      <div style="margin-bottom:30px;">
                          <small style="display:block;margin-bottom:20px;font-size:12px;">
                              <p style="color:#747474;">
                                  注意：此操作可能会修改您的密码、登录邮箱或绑定手机。如非本人操作，请及时登录并修改密码以保证帐户安全
                                  <br>（工作人员不会向你索取此验证码，请勿泄漏！)
                              </p>
                          </small>
                      </div>
                  </div>
                  <div style="width:700px;margin:0 auto;">
                      <div style="padding:10px 10px 0;border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;">
                          <p>此为系统邮件，请勿回复<br>
                              请保管好您的邮箱，避免账号被他人盗用
                          </p>
                          <p>屿东</p>
                      </div>
                  </div>
              </td>
          </tr>
          </tbody>
      </table>
      </body>
  `,
    }
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: %s', info.messageId)
    })
  },
}

// 获取邮箱验证码
router.post(
  '/sendMailCode',
  [body('email').isEmail().withMessage('请输入正确格式的邮箱！')],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.send({ code: 400, msg: errors.array()[0].msg })
    }
    const { email } = req.body
    // 验证邮箱是否已经注册
    db.query(
      'select * from user where username = ? ',
      email,
      (err, results) => {
        if (err) {
          return res.send({ code: 400, msg: '服务器错误' })
        }
        if (results.length > 0) {
          return res.send({
            code: 400,
            msg: '邮箱已被注册！请尝试直接登录或更换邮箱',
          })
        } else {
          const MAIL_CODE = Math.floor(Math.random() * (9999 - 1000)) + 1000
          const timestamp = +new Date()
          req.session.mailCode = MAIL_CODE
          req.session.mailCodeTime = timestamp
          obj.send(email, MAIL_CODE)
          res.send({ code: 200, msg: '验证码已发您邮箱，请注意查收' })
        }
      }
    )
  }
)

module.exports = router

const express = require('express')
const router = express.Router()
const db = require('../db')
// 加盐加密库
const bcrypt = require('bcryptjs')
// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { register_rule } = require('../rules/user')

// 用户注册
router.post('/register', expressJoi(register_rule), (req, res) => {
  // 获取表单数据
  const { username, code, password, againPwd } = req.body
  const timestamp = Date.now()
  // 验证表单数据
  if (password !== againPwd) {
    return res.send({ code: 400, msg: '两次输入的密码不一致！' })
  }
  // 验证邮箱验证码的正确性和有效性
  if (
    code != req.session.mailCode ||
    timestamp - req.session.mailCodeTime > 300000
  ) {
    return res.send({ code: 400, msg: '验证码错误！' })
  }
  // 判断用户是否存在
  const sqlStr = 'select * from user where username = ?'
  db.query(sqlStr, username, (err, results) => {
    if (err) {
      return res.send({ code: 400, msg: '服务器错误' })
    }
    if (results.length > 0) {
      return res.send({
        code: 400,
        msg: '邮箱已被注册！请尝试直接登录或更换邮箱',
      })
    }
    // 用户不存在，添加用户
    const sqlStr = 'insert into user set ?'
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    const newPwd = bcrypt.hashSync(password, 10)
    db.query(
      sqlStr,
      {
        username: username,
        password: newPwd,
        nick_name: '默认用户',
        avatar: 'https://urlify.cn/qumqQf',
        timestamp: +new Date(),
      },
      (err, data) => {
        if (err) {
          return res.json({
            code: 400,
            msg: '服务器错误',
          })
        }
        if (data.affectedRows !== 1) {
          return res.json({
            code: 400,
            msg: '注册失败',
          })
        }
        res.json({
          code: 200,
          msg: '注册成功，赶快去登录吧~',
        })
      }
    )
  })
})

module.exports = router

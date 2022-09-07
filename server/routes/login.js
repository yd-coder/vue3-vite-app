const express = require('express')
const router = express.Router()
const db = require('../db')
// 生成 Token 字符串库
const jwt = require('jsonwebtoken')
// 加盐加密库
const bcrypt = require('bcryptjs')
// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { login_rule } = require('../rules/user')
// 导入配置文件
const config = require('../config')

// 用户登录
router.post('/login', expressJoi(login_rule), (req, res) => {
  const { username, password } = req.body
  const sql = `select * from user where username=?`
  db.query(sql, username, (err, results) => {
    if (err) {
      return res.send({ code: 400, msg: '服务器错误' })
    }
    if (results.length !== 1) {
      return res.send({ code: 400, msg: '用户名不存在!' })
    }
    // 判断密码是否正确
    const compareResult = bcrypt.compareSync(password, results[0].password)
    if (!compareResult) {
      return res.send({ code: 400, msg: '用户名或密码错误!' })
    }
    const timestamp = +new Date()
    const user = { ...results[0], timestamp }
    delete user.password
    // 生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: '24h', // token 有效期为 24 个小时
    })
    res.send({
      code: 200,
      msg: '登录成功，欢迎回来！',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer ' + tokenStr,
      data: {
        ...user,
      },
    })
  })
})

module.exports = router

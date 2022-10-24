const express = require('express')
const router = express.Router()
const db = require('../db')

router.post('/updateUserInfo', (req, res) => {
  const { nick_name, avatar, username } = req.body
  const sql = `update user set nick_name = ${nick_name},avatar = ${avatar} where username = ${username}`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ code: 400, msg: '服务器错误' })
    }
    res.send({
      code: 200,
      msg: '资料修改成功！',
    })
  })
})

module.exports = router

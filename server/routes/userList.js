const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/getUserList', (req, res) => {
  const sql = `select id,nick_name,online_status,username,avatar,session_history,chat_id from user where id != ${req.user.id}`
  db.query(sql, (err, results) => {
    if (err) {
      return res.send({ code: 400, msg: '服务器错误' })
    }
    res.send({
      code: 200,
      msg: '获取用户列表成功',
      data: {
        list: results,
      },
    })
  })
})

module.exports = router

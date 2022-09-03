var express = require('express')
var router = express.Router()
// 导入验证模块
const { body, validationResult } = require('express-validator')
var Mail = require('../Mail/Mail')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ code: 200, msg: 'success' })
})

router.post(
  '/sendMailCode',
  [body('email').isEmail().withMessage('请输入正确格式的邮箱！')],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.send({ code: 400, msg: errors.array()[0].msg })
    }
    const { email } = req.body
    const MAIL_CODE = Math.floor(Math.random() * (9999 - 1000)) + 1000
    Mail.send(email, MAIL_CODE)
    res.send({ code: 200, msg: '验证码已发您邮箱，请注意查收' })
    next()
  }
)

module.exports = router

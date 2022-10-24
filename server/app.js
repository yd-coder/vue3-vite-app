const express = require('express')
const cors = require('cors')
const router = require('./routes/index')
const app = express()
const session = require('express-session')
const joi = require('joi')
// 导入配置文件
const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(
  expressJWT({
    secret: config.jwtConfig.secret,
  }).unless({
    path: ['/api/login', '/api/register', '/api/sendMailCode'],
  })
)

// 使用express-session 来存放数据到session中
app.use(
  session({
    secret: 'yudong', // 加密字符串
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2, // 有效期，单位是毫秒
    },
  })
)

// 配置解析post请求表单数据的中间件
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 配置跨域
app.use(
  cors({
    origin: ['http://localhost:5000'],
    credentials: true,
    maxAge: '1728000',
  })
)

// 全局错误中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError)
    return res.send({
      code: 400,
      msg: err instanceof Error ? err.message : err,
    })
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError')
    return res.send({
      code: 400,
      msg: '身份认证失败！',
    })
  // 未知错误
  res.send({ code: 400, msg: err instanceof Error ? err.message : err })
})

// 托管静态资源
app.use(express.static('public'))

// 注册路由模块，添加访问前缀
app.use('/api', router)

const server = app.listen(5001, function () {
  console.log('listening on *:5001')
})

// 聊天socket
const socket = require('./utils/socket')
socket(server)

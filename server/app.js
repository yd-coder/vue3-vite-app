const express = require('express')
const http = require('http')
const server = http.createServer()
const cors = require('cors')
const router = require('./routes/index')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
// 注册路由模块，添加访问前缀
app.use('/api', router)

// const io = require('socket.io')(http, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// })

// // socket监听连接
// io.on('connection', (socket) => {
//   console.log('连接成功')

//   // receive a message from the client
//   socket.on('message', (e) => {
//     var username = e.name
//     io.emit('message', e)
//   })

//   socket.on('disconnecting', () => {
//     console.log(socket.id)
//     console.log('用户离开，连接断开')
//   })
// })

app.listen(465, function () {
  console.log('listening on *:465')
})

const express = require('express')
const router = express.Router()
const db = require('../db')
// 引入上传文件模块
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

router.post('/uploadAvatar', upload.single('file'), (req, res, next) => {
  try {
    res.send({
      code: 200,
      msg: '上传头像成功',
      data: {
        url: 'http://localhost:5001/' + 'images/' + req.file.filename,
      },
    })
  } catch (err) {
    return res.send({ code: 400, msg: '服务器错误' })
  }
})
module.exports = router

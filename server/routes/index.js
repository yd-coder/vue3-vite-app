const emailRouter = require('./Mail')
const registerRouter = require('./register')
const loginRouter = require('./login')
const userListRouter = require('./userList')
const uploadAvatarRouter = require('./uploadAvatar')

module.exports = [
  emailRouter,
  registerRouter,
  loginRouter,
  userListRouter,
  uploadAvatarRouter,
]

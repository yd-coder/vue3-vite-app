const emailRouter = require('./Mail')
const registerRouter = require('./register')
const loginRouter = require('./login')

module.exports = [emailRouter, registerRouter, loginRouter]

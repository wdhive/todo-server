const colors = require('colors/safe')

const getFail = (message, statusCode) => {
  return {
    status: statusCode < 500 ? 'fail' : 'error',
    message,
  }
}

const getSuccess = (data) => {
  return {
    status: 'success',
    data,
  }
}

exports.getFail = getFail
exports.getSuccess = getSuccess

const isResponseInvalid = (res) => {
  if (res.headersSent) {
    return console.warn(colors.red('!!!', 'Headers already sent')), true
  }
}

exports.ping = (req, res) => res.status(200).json({ message: 'Hello, world!' })
exports.reqBody = (req, res, next) => {
  if (req.body == null) req.body = {}
  next()
}

exports.success = function (data, code = 200) {
  if (isResponseInvalid(this)) return

  const jSendData = getSuccess(data)
  this.status(code).json(code === 204 ? null : jSendData)
  return jSendData
}

exports.getBody = function (fields) {
  if (typeof fields === 'string') {
    fields = fields.split(' ').filter((feild) => feild.trim())
  }

  const newObj = {}
  fields.forEach((feild) => {
    const value = this.body[feild]
    if (value !== undefined) newObj[feild] = value
  })
  return newObj
}

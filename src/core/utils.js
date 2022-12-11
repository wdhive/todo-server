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

exports.ping = (req, res) => res.status(200).json({ message: 'Hello, world!' })
exports.reqBody = (req, res, next) => {
  if (req.body == null) req.body = {}
  next()
}

exports.success = function (data, code = 200) {
  const jSendData = getSuccess(data)

  if (!this.headersSent) {
    this.status(code).json(code === 204 ? null : jSendData)
  } else {
    console.warn(colors.red('!!!', 'Headers already sent'))
  }

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

const jsonwebtoken = require('jsonwebtoken')
const User = require('../model/user-model')
const errorMessages = require('./error-messages')

exports.generate = (id) => {
  return jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  })
}

exports.verify = (token) => {
  const tokenInfo = jsonwebtoken.verify(token, process.env.JWT_SECRET)
  const currentTime = Math.floor(Date.now() / 1000)
  if (tokenInfo.exp <= currentTime) {
    throw new ReqError(errorMessages.auth.jwtExpire)
  }
  return tokenInfo
}

exports.decode = (token) => {
  return jsonwebtoken.decode(token, {})
}

exports.verifyUser = async (rawToken) => {
  if (!rawToken.startsWith('Bearer ')) rawToken = null
  else rawToken = rawToken.replace(/^Bearer /, '')

  const token = this.verify(rawToken)
  const user = await User.findById(token.id)

  if (!user) {
    throw new ReqError(errorMessages.user.deleted)
  }
  if (user.passwordChangedAfter(token.iat)) {
    throw new ReqError(errorMessages.auth.jwtExpire)
  }

  return user
}

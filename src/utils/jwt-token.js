const jsonwebtoken = require('jsonwebtoken')
const User = require('../model/user-model')
const errorMessages = require('./error-messages')

exports.generate = id => {
  return jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  })
}

exports.verify = token => {
  const tokenInfo = jsonwebtoken.verify(token, process.env.JWT_SECRET)
  const currentTime = Math.floor(Date.now() / 1000)
  if (tokenInfo.exp <= currentTime) {
    throw new ReqError(errorMessages.auth.jwtExpire)
  }
  return tokenInfo
}

exports.decode = token => {
  return jsonwebtoken.decode(token, {})
}

exports.verifyUser = async rawToken => {
  const [token] = rawToken?.match(/(?<=^Bearer ).*$/) || []
  const tokenInfo = this.verify(token)
  const user = await User.findById(tokenInfo.id)

  if (!user) {
    throw new ReqError(errorMessages.user.deleted)
  }
  if (user.passwordChangedAfter(token.iat)) {
    throw new ReqError(errorMessages.auth.jwtExpire)
  }

  return user
}

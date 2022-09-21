const jsonwebtoken = require('jsonwebtoken')

exports.generate = id => {
  return jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  })
}

exports.verify = token => {
  const tokenInfo = jsonwebtoken.verify(token, process.env.JWT_SECRET)
  const currentTime = Math.floor(Date.now() / 1000)
  if (tokenInfo.exp <= currentTime) {
    throw new ReqError('Auth token has been expired')
  }
  return tokenInfo
}

exports.decode = token => {
  return jsonwebtoken.decode(token, {})
}

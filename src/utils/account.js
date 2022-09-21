const jwtToken = require('./jwt-token')

exports.sendUserAndJWT = (res, user) => {
  const token = jwtToken.generate(user._id)
  res.success({ user: user.getSafeInfo(), token })
}

const jwtToken = require('../../utils/jwt-token')
const errorMessages = require('../../utils/error-messages')

exports.sendJWT = (res, userId) => {
  const token = jwtToken.generate(userId)
  res.success({ token })
}

exports.getFindUserQuery = login => {
  if (typeof login !== 'string') throw new ReqError('Login field is missing')
  return login.includes('@') ? { email: login } : { username: login }
}

exports.checkOtpRequest = async (Model, findQuery, code) => {
  const otpRequest = await Model.findOne(findQuery)
  console.log(findQuery, otpRequest)

  if (!otpRequest) throw new ReqError(errorMessages.otp.notExists)
  if (!(await otpRequest.checkCode(code))) {
    throw new ReqError(errorMessages.otp.wrong)
  }

  return otpRequest
}

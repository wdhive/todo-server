const errorMessages = require('../../utils/error-messages')

exports.getFindUserQuery = (login) => {
  if (typeof login !== 'string') throw new ReqError('Login field is missing')
  return login.includes('@') ? { email: login } : { username: login }
}

exports.checkOtpRequest = async (Model, findQuery, code) => {
  const otpRequest = await Model.findOne(findQuery)

  if (!otpRequest) throw new ReqError(errorMessages.otp.notExists)
  if (!(await otpRequest.checkCode(code))) {
    throw new ReqError(errorMessages.otp.wrong)
  }

  return otpRequest
}

const disposableEmailList = ['dni8.com']
exports.checkIsDisposable = (email) => {
  const domain = email.split('@')[1]
  return disposableEmailList.includes(domain)
}

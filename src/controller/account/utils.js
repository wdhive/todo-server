const mongoose = require('mongoose')
const jwtToken = require('../../utils/jwt-token')
const User = require('../../model/user-model')
const errorMessages = require('../../utils/error-messages')
const generateOtp = require('../../utils/generate-otp')

exports.sendUserAndJWT = (res, user) => {
  const userMode =
    !(user instanceof mongoose.Types.ObjectId) && user instanceof Object

  const token = jwtToken.generate(userMode ? user._id : user)
  const data = { token }
  if (userMode) data.user = user.getSafeInfo()
  res.success(data)
}

exports.getFindUserQuery = login => {
  if (typeof login !== 'string') throw new ReqError('Login field is missing')
  return login.includes('@') ? { email: login } : { username: login }
}

exports.usersExists = async userIds => {
  const uniqueUserIds = [...new Set(userIds)]
  const usersCount = await User.find({ _id: uniqueUserIds }).countDocuments()
  return uniqueUserIds.length === usersCount
}

exports.validateOtpRequest = async (Model, findQuery, code) => {
  const otpRequest = await Model.findOne(findQuery)
  if (!otpRequest) throw new ReqError(errorMessages.otp.notExists)
  if (!(await otpRequest.checkCode(code))) {
    throw new ReqError(errorMessages.otp.wrong)
  }
}

const User = require('../../model/user-model')
const UserSettings = require('../../model/user-settings-model')
const VerifyEmail = require('../../model/otp-verify-email-model')
const ForgetPass = require('../../model/otp-forget-pass-model')
const generateOtp = require('../../utils/generate-otp')
const sendMail = require('../../mail/send-mail')
const errorMessages = require('../../utils/error-messages')
const jwtToken = require('../../utils/jwt-token')
const accountFactory = require('./account-factory')
const {
  sendUserAndJWT,
  getFindUserQuery,
  validateOtpRequest,
} = require('./utils')

exports.checkAuthMiddleware = async (req, res, next) => {
  const [token] = req.headers.authorization?.match(/\S*$/)
  const tokenInfo = jwtToken.verify(token)
  const user = await User.findById(tokenInfo.id)

  if (!user) {
    throw new ReqError(errorMessages.user.deleted)
  }
  if (user.passwordChangedAfter(token.iat)) {
    throw new ReqError(errorMessages.auth.jwtExpire)
  }

  req.user = user
  next()
}

exports.checkPassAfterSignedinMiddleWare = async (req, res, next) => {
  if (!req.body.password) throw new ReqError('Must provide a password')
  const ok = await req.user.checkPassword(req.body.password)
  if (!ok) throw new ReqError(errorMessages.password.wrong)
  next()
}

exports.emailVerifyMiddleWare = async (req, res, next) => {
  const { email } = req.body
  if (await User.findOne({ email }).countDocuments()) {
    throw new ReqError(errorMessages.email.duplicate)
  }
  req.otpType = 'verify-email'
  next()
}

exports.forgetPasswordMiddleWare = async (req, res, next) => {
  const { login } = req.body
  const user = await User.findOne(getFindUserQuery(login)).select('email')
  res.success({
    email: user.email,
    message: `Email sent to your email. (if the any user exists)`,
  })

  if (!user) return
  req.user = user
  req.otpType = 'forget-password'
  next()
}

exports.verifyEmailOtpMiddleware = async (req, res, next) => {
  const { email, code } = req.body
  await validateOtpRequest(VerifyEmail, { email }, code)
  next()
}

exports.sendOtpMail = async (req, res) => {
  const emailMode = req.otpType === 'verify-email'

  const Model = emailMode ? VerifyEmail : ForgetPass
  const findQuery = emailMode
    ? { email: req.body.email }
    : { _id: req.user._id }

  const request = await Model.findOne(findQuery)
  const email = emailMode ? req.body.email : req.user.email
  const code = generateOtp(emailMode ? 6 : 8)

  if (request) {
    request.code = code
    await request.save()
  } else {
    const data = {
      _id: req.user?._id,
      email,
      code,
    }
    await Model.create(data)
  }

  res.headersSent || res.success({ email }, 201)
  await sendMail.verifyEmailCode(email, code)
}

exports.signup = async (req, res) => {
  const reqBody = req.getBody('name email username image password')
  const user = await User.create(reqBody)
  await UserSettings.create({
    _id: user._id,
  })

  sendUserAndJWT(res, user)
}

exports.login = async (req, res) => {
  const { login, password } = req.body
  const user = await User.findOne(getFindUserQuery(login))

  if (!user || !(await user.checkPassword(password))) {
    throw new ReqError(errorMessages.auth.failed)
  }

  sendUserAndJWT(res, user)
}

exports.resetPassword = async (req, res) => {
  const { login, code, new_password } = req.body
  const user = await User.findOne(getFindUserQuery(login))

  if (!user) throw new ReqError(errorMessages.user.notFound)
  await validateOtpRequest(ForgetPass, { _id: user._id }, code)

  user.password = new_password
  await user.save()
  await otpRequest.delete()
  sendUserAndJWT(res, user)
}

exports.changePassword = accountFactory.changeEmailAndUsername('password')
exports.changeEmail = accountFactory.changeEmailAndUsername('email')
exports.changeUsername = accountFactory.changeEmailAndUsername('username')

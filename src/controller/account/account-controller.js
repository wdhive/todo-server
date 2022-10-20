const User = require('../../model/user-model')
const UserSettings = require('../../model/user-settings-model')
const VerifyEmail = require('../../model/otp-verify-email-model')
const ForgetPass = require('../../model/otp-forget-pass-model')
const generateOtp = require('../../utils/generate-otp')
const sendMail = require('../../mail/send-mail')
const errorMessages = require('../../utils/error-messages')
const accountFactory = require('./account-factory')
const jwtToken = require('../../utils/jwt-token')
const { sendJWT, getFindUserQuery, checkOtpRequest } = require('./utils')

exports.checkAuth = async (req, res, next) => {
  const user = await jwtToken.verifyUser(req.headers.authorization)
  req.user = user
  next()
}

exports.checkPassAfterLoggedIn = async (req, res, next) => {
  const ok = await req.user.checkPassword(req.body.password)
  if (!ok) throw new ReqError(errorMessages.password.wrong)
  next()
}

exports.verifyEmailMail = async (req, res, next) => {
  const { email } = req.body
  if (await User.findOne({ email }).countDocuments()) {
    throw new ReqError(errorMessages.email.duplicate)
  }
  req.user = { email }
  req.otpType = 'verify-email'
  next()
}

exports.forgetPasswordMail = async (req, res, next) => {
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

exports.verifyEmailOtp = async (req, res, next) => {
  const { email, new_email, code } = req.body
  await checkOtpRequest(
    VerifyEmail,
    {
      email: email || new_email,
    },
    code
  )
  next()
}

exports.sendOtpMail = async (req, res) => {
  const emailMode = req.otpType === 'verify-email'
  const { email } = req.user

  const Model = emailMode ? VerifyEmail : ForgetPass
  const findQuery = emailMode ? { email } : { _id: req.user._id }

  const request = await Model.findOne(findQuery)
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
  const reqBody = req.getBody('name email username avatar password')
  const user = await User.create(reqBody)
  await UserSettings.create({
    _id: user._id,
  })

  sendJWT(res, user._id)
}

exports.login = async (req, res) => {
  const { login, password } = req.body
  const user = await User.findOne(getFindUserQuery(login))

  if (!user || !(await user.checkPassword(password))) {
    throw new ReqError(errorMessages.auth.failed)
  }

  sendJWT(res, user._id)
}

exports.resetPassword = async (req, res) => {
  const { login, code, new_password } = req.body
  const user = await User.findOne(getFindUserQuery(login))

  if (!user) throw new ReqError(errorMessages.user.notFound)
  const otpRequest = await checkOtpRequest(ForgetPass, { _id: user._id }, code)

  user.password = new_password
  await user.save()
  await otpRequest.delete()
  sendJWT(res, user._id)
}

exports.changeEmail = accountFactory.changeUserInfo('email')
exports.changeUsername = accountFactory.changeUserInfo('username')
exports.changePassword = accountFactory.changeUserInfo('password')

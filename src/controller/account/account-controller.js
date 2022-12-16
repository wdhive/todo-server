const User = require('../../model/user-model')
const UserSettings = require('../../model/user-settings-model')
const VerifyEmail = require('../../model/otp-verify-email-model')
const ForgetPass = require('../../model/otp-forget-pass-model')
const generateOtp = require('../../utils/generate-otp')
const sendMail = require('../../mail/send-mail')
const errorMessages = require('../../utils/error-messages')
const accountFactory = require('./account-factory')
const jwtToken = require('../../utils/jwt-token')
const { getFindUserQuery, checkOtpRequest } = require('./utils')
const file = require('../../file')

exports.checkAuth = async (req, res, next) => {
  const user = await jwtToken.verifyUser(req.headers.authorization)
  req.user = user
  next()
}

exports.checkPassAfterLoggedIn = async (req, res, next) => {
  const ok = await req.user.checkPassword(req.body.password)
  if (!ok) throw new ReqError(errorMessages.password.wrong, 400)
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
  const { email } = req.body
  const user = await User.findOne({ email }).select('email')
  res.success({
    email,
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

exports.signup = async (req, res, next) => {
  const reqBody = req.getBody('name email avatar username password')
  const user = new User(reqBody)

  await user.validate()
  await file.updateFile(req, user)

  await user.save()
  await UserSettings.create({
    _id: user._id,
  })

  req.user = user
  next()
}

exports.login = async (req, res, next) => {
  const { login, password } = req.body
  const user = await User.findOne(getFindUserQuery(login))

  if (!user || !(await user.checkPassword(password))) {
    throw new ReqError(errorMessages.auth.failed)
  }

  req.user = user
  next()
}

exports.resetPassword = async (req, res, next) => {
  const { email, code, new_password } = req.body
  const user = await User.findOne({ email })

  if (!user) throw new ReqError(errorMessages.user.notFound)
  const otpRequest = await checkOtpRequest(ForgetPass, { _id: user._id }, code)

  user.password = new_password
  await user.save()
  await otpRequest.delete()

  req.user = user
  next()
}

exports.sendJwt = (req, res) => {
  const token = jwtToken.generate(req.user._id)
  res.success({ token })
}

exports.changeEmail = accountFactory.changeUserInfo('email')
exports.changeUsername = accountFactory.changeUserInfo('username')
exports.changePassword = accountFactory.changeUserInfo('password')

const User = require('../../model/user-model')
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
  createOrUpdateCode,
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

exports.verifyEmailCodeMiddleware = async (req, res, next) => {
  const { email, code } = req.body
  const verifyEmailRequest = await VerifyEmail.findOne({ email })
  if (!verifyEmailRequest) {
    throw new ReqError(errorMessages.otp.notExists)
  }
  if (!(await verifyEmailRequest.checkCode(code))) {
    throw new ReqError(errorMessages.otp.wrong)
  }
  next()
}

exports.requestEmailVerify = async (req, res) => {
  const { email } = req.body
  if (await User.findOne({ email }).countDocuments()) {
    throw new ReqError(errorMessages.email.duplicate)
  }

  const code = generateOtp(6)
  await createOrUpdateCode(await VerifyEmail.findOne({ email }), VerifyEmail, {
    email,
    code,
  })
  sendMail.verifyEmailCode(email, code).catch(() => {})

  res.success({ email }, 201)
}

exports.signup = async (req, res) => {
  const reqBody = req.getBody('name email username image password')
  const user = await User.create(reqBody)
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

exports.forgetPassword = async (req, res) => {
  const { login } = req.body
  const user = await User.findOne(getFindUserQuery(login)).select('email')

  res.success({
    email,
    message: `Email sent to your email, if the any user exists with the email`,
  })

  if (!user) return

  const userId = user?._id
  try {
    const existingRequest = await ForgetPass.findById(userId)
    const code = generateOtp(8)
    await createOrUpdateCode(existingRequest, ForgetPass, { _id: userId, code })
    await sendMail.forgetPassCode(user.email, code)
  } catch {}
}

exports.resetPassword = async (req, res) => {
  const { login, code, new_password } = req.body
  const user = await User.findOne(getFindUserQuery(login))
  if (!user) throw new ReqError(errorMessages.user.notFound)

  const forgetPassRequest = await ForgetPass.findById(user._id)
  if (!forgetPassRequest) throw new ReqError(errorMessages.otp.notExists)
  if (!(await forgetPassRequest.checkCode(code))) {
    throw new ReqError(errorMessages.otp.wrong)
  }

  user.password = new_password
  await user.save()
  await forgetPassRequest.delete()
  sendUserAndJWT(res, user)
}

exports.changePassword = accountFactory.changeEmailAndUsername('password')
exports.changeEmail = accountFactory.changeEmailAndUsername('email')
exports.changeUsername = accountFactory.changeEmailAndUsername('username')

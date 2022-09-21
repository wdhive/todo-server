const User = require('../../model/user-model')
const VerifyEmail = require('../../model/otp-verify-email-model')
const ForgetPass = require('../../model/otp-forget-pass-model')
const generateOtp = require('../../utils/generate-otp')
const sendMail = require('../../mail/send-mail')
const { sendUserAndJWT } = require('../../utils/account')

const getFindUserQuery = (email, username) => {
  if (email && username) {
    throw new ReqError('Email and Username cannot be present...')
  }
  return email ? { email } : { username }
}

const createOrUpdateCode = async (doc, model, data) => {
  if (doc) {
    for (let key in data) doc[key] = data[key]
    await doc.save()
  } else {
    await model.create(data)
  }
}

exports.verifyEmail = async (req, res) => {
  const { email } = req.body

  if (await User.findOne({ email })) {
    throw new ReqError('Another account associated with this email', 400)
  }

  const existingRequest = await VerifyEmail.findOne({ email })
  const code = generateOtp(6)
  await createOrUpdateCode(existingRequest, VerifyEmail, { email, code })
  sendMail.verifyEmailCode(email, code).catch(() => {})
  res.success({ email }, 201)
}

exports.signup = async (req, res) => {
  const { name, email, username, image, password, code } = req.body

  const verifyEmailRequest = await VerifyEmail.findOne({ email })
  if (!verifyEmailRequest) {
    throw new ReqError('User never requested for OTP', 400)
  }
  if (!(await verifyEmailRequest.checkCode(code))) {
    throw new ReqError('Wrong information', 403)
  }

  const user = await User.create({ name, email, username, image, password })
  await verifyEmailRequest.delete()
  sendUserAndJWT(res, user)
}

exports.login = async (req, res) => {
  const { email, username, password } = req.body
  if (!password) {
    throw new ReqError('Must need to provide a password')
  }

  const user = await User.findOne(getFindUserQuery(email, username))
  if (!user || !(await user.checkPassword(password))) {
    throw new ReqError('Hehhee')
  }

  sendUserAndJWT(res, user)
}

exports.forgetPassword = async (req, res) => {
  const { email, username } = req.body
  const user = await User.findOne(getFindUserQuery(email, username)).lean()
  const userId = user?._id

  res.success({
    email,
    message: `Email sent to ${email}, if the any user exists with the email`,
  })

  if (!userId) return

  try {
    const existingRequest = await ForgetPass.findById(userId)
    const code = generateOtp(8)
    await createOrUpdateCode(existingRequest, ForgetPass, { _id: userId, code })
    await sendMail.forgetPassCode(email, code)
  } catch (err) {
    console.warn(err)
  }
}

exports.resetPassword = async (req, res) => {
  const { email, username, code, new_password } = req.body
  const user = await User.findOne(getFindUserQuery(email, username))
  if (!user) throw new ReqError('Wrong information', 403)

  const forgetPassRequest = await ForgetPass.findById(user._id)
  if (!forgetPassRequest || !(await forgetPassRequest.checkCode(code)))
    throw new ReqError('Wrong information', 403)

  user.password = new_password
  await user.save()
  await forgetPassRequest.delete()
  sendUserAndJWT(res, user)
}

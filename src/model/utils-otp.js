const brcypt = require('bcrypt')
const errorMessages = require('../utils/error-messages')

module.exports = schema => {
  schema.pre('save', async function (next) {
    if (!this.isModified('code')) return next()

    this.code = await brcypt.hash(
      this.code,
      +process.env.BCRYPT_SALT_ROUND_EXTRA
    )
    next()
  })
  schema.methods.checkCode = function (code) {
    if (typeof code !== 'string') throw new ReqError(errorMessages.otp.invalid)
    return brcypt.compare(code, this.code)
  }
}

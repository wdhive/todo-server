const brcypt = require('bcrypt')
const errorMessages = require('./error-messages')
const { runOnFieldUpdate } = require('./schema')

module.exports = schema => {
  schema.pre(
    'save',
    runOnFieldUpdate('code', async function (next) {
      this.code = await brcypt.hash(
        this.code,
        +process.env.BCRYPT_SALT_ROUND_EXTRA
      )
      next()
    })
  )
  schema.methods.checkCode = function (code) {
    if (typeof code !== 'string') throw new ReqError(errorMessages.otp.invalid)
    return brcypt.compare(code, this.code)
  }
}

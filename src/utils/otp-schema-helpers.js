const brcypt = require('bcrypt')
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
    if (!code) throw new ReqError('Invalid code', 400)
    return brcypt.compare(code, this.code)
  }
}

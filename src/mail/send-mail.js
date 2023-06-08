const { readFileSync } = require('fs')
const mail = require('./mail')

const verifyEmailTemplate = readFileSync(
  __dirname + '/template-verify.html',
  'utf-8'
)
const forgetPassTemplate = readFileSync(
  __dirname + '/template-forget.html',
  'utf-8'
)

exports.verifyEmailCode = (to, code) => {
  return mail({
    to,
    subject: 'Todo account verification code',
    body: verifyEmailTemplate.replace('{%CODE%}', code),
  })
}
exports.forgetPassCode = (to, code) => {
  return mail({
    to,
    subject: 'Todo account password reset code',
    body: forgetPassTemplate.replace('{%CODE%}', code),
  })
}

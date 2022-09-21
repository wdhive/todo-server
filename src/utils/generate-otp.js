const { OTP_CHARACTERS: letters } = require('../config/config')
const lettersLength = letters.length

module.exports = n => {
  let code = ''
  let i = 0
  for (i; i < n; i++) {
    code += letters[Math.floor(Math.random() * lettersLength)]
  }
  return code
}

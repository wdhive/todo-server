const mongoose = require('mongoose')
const { FORGET_PASS_OTP_EXPIRE_DURATION } = require('../config/config')
const otpSchemaHelpers = require('./utils-otp')

const schema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: FORGET_PASS_OTP_EXPIRE_DURATION,
      required: true,
      select: false,
    },
  },
  { versionKey: false }
)

otpSchemaHelpers(schema)
module.exports = mongoose.model('otp-forget-pass', schema)

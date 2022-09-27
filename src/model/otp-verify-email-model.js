const mongoose = require('mongoose')
const { VERIFY_EMAIL_EXPIRE_DURATION } = require('../config/config')
const otpSchemaHelpers = require('./utils-otp')
const commonSchemaField = require('./common-schema-field')

const schema = mongoose.Schema(
  {
    email: commonSchemaField.email,
    code: {
      type: 'string',
      required: true,
    },
    expireAt: {
      required: true,
      type: Date,
      default: Date.now,
      expires: VERIFY_EMAIL_EXPIRE_DURATION,
      select: false,
    },
  },
  { versionKey: false }
)

otpSchemaHelpers(schema)
module.exports = mongoose.model('otp-verify-email', schema)

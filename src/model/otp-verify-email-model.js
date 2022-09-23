const mongoose = require('mongoose')
const { VERIFY_EMAIL_EXPIRE_DURATION } = require('../config/config')
const otpSchemaHelpers = require('../utils/otp-schema-helpers')

const schema = mongoose.Schema(
  {
    email: {
      type: 'string',
      required: [true, 'Did not receive an email. Please try again'],
      unique: [true, 'An account is already associated with this email'],
    },
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

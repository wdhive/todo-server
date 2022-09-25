const mongoose = require('mongoose')
const { VERIFY_EMAIL_EXPIRE_DURATION } = require('../config/config')
const errorMessages = require('../utils/error-messages')
const otpSchemaHelpers = require('../utils/otp-schema-helpers')

const schema = mongoose.Schema(
  {
    email: {
      type: 'string',
      required: [true, errorMessages.email.fieldMissing[0]],
      unique: [true, errorMessages.email.duplicate[0]],
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

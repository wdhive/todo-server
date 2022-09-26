const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { getFeildsFromObject } = require('../utils')
const { runOnFieldUpdate } = require('../utils/schema')
const errorMessages = require('../utils/error-messages')
const { USER_SAFE_INFO } = require('../config/config')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, errorMessages.name.fieldMissing[0]],
    },
    username: {
      type: String,
      required: [true, errorMessages.username.fieldMissing[0]],
      unique: [true, errorMessages.username.duplicate[0]],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, errorMessages.email.fieldMissing[0]],
      unique: [true, errorMessages.email.duplicate[0]],
      lowercase: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: [true, errorMessages.password.fieldMissing[0]],
    },
    passwordModifiedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { versionKey: false }
)

userSchema.pre(
  'save',
  runOnFieldUpdate('password', async function (next) {
    this.password = await bcrypt.hash(
      this.password,
      +process.env.BCRYPT_SALT_ROUND
    )
    this.passwordModifiedAt = Date.now()
    next()
  })
)

userSchema.methods.checkPassword = function (data) {
  return bcrypt.compare(data, this.password)
}

userSchema.methods.getSafeInfo = function () {
  return getFeildsFromObject(this, USER_SAFE_INFO)
}

userSchema.methods.passwordChangedAfter = function (queryTime) {
  if (this?.passwordModifiedAt) {
    const lastModified = Math.floor(this.passwordModifiedAt.getTime() / 1000)
    return lastModified > queryTime
  }
  return false
}

module.exports = mongoose.model('user', userSchema)

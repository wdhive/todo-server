const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { getFeildsFromObject } = require('../utils')
const { runOnFieldUpdate } = require('../utils/schema')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User must have a name'],
    },
    username: {
      type: String,
      required: [true, 'User must have a usrname'],
      unique: [true, "The given username isn't available"],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'User must give an email'],
      unique: [true, 'Another account already exists with this email'],
      lowercase: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'User must have a password'],
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
  return getFeildsFromObject(this, 'name username email image')
}

userSchema.methods.passwordChangedAfter = function (queryTime) {
  if (this?.passwordModifiedAt) {
    const lastModified = Math.floor(this.passwordModifiedAt.getTime() / 1000)
    return lastModified > queryTime
  }
  return false
}

module.exports = mongoose.model('user', userSchema)

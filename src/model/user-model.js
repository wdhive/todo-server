const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { getFeildsFromObject } = require('../utils')
const { runOnFieldUpdate } = require('./utils')
const errorMessages = require('../utils/error-messages')
const { USER_SAFE_INFO } = require('../config/config')
const VerifyEmail = require('./otp-verify-email-model')
const Task = require('./task-model')
const TaskCategory = require('./task-category-model')
const UserSettings = require('./user-settings-model')
const socketStore = require('../socket/socket-store')

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
  {
    versionKey: false,
    toJSON: { virtuals: true },
  }
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

userSchema.post('save', async function () {
  VerifyEmail.deleteOne({ email: this.email }).catch(() => {})
})

userSchema.post('remove', function () {
  Promise.all([
    Task.deleteMany({ owner: this._id }),
    TaskCategory.deleteMany({ user: this._id }),
    UserSettings.deleteOne({ _id: this._id }),
  ]).catch(() => {})

  socketStore.disconnect(this._id, {
    cause: 'Delete Account',
  })
})

userSchema.virtual('settings', {
  ref: 'user-settings',
  localField: '_id',
  foreignField: '_id',
  justOne: true,
})

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

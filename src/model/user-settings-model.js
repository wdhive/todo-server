const mongoose = require('mongoose')

const userSettingsSchema = mongoose.Schema(
  {
    theme: {
      type: String,
      lowercase: true,
      enum: ['dark', 'light'],
    },

    taskCategories: [
      {
        name: {
          type: String,
          required: true,
        },
        hue: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { versionKey: false }
)

module.exports = mongoose.model('user-settings', userSettingsSchema)

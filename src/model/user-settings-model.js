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
          match: [/^[a-zA-Z 0-9]+$/, 'Please insert a valid name'],
        },
        hue: {
          type: Number,
          required: true,
          min: 0,
          max: 240,
        },
      },
    ],
  },
  { versionKey: false }
)

module.exports = mongoose.model('user-settings', userSettingsSchema)

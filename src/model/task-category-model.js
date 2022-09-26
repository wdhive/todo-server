const mongoose = require('mongoose')

const userSettingsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    task: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { versionKey: false }
)

module.exports = mongoose.model('task-category', userSettingsSchema)

const mongoose = require('mongoose')

const userSettingsSchema = mongoose.Schema(
  {
    _id: {
      select: false,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      select: false,
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

const mongoose = require('mongoose')

const taskCategorySchema = mongoose.Schema(
  {
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

taskCategorySchema.index(
  {
    user: 1,
    category: 1,
    task: 1,
  },
  {
    unique: true,
  }
)

module.exports = mongoose.model('task-category', taskCategorySchema)

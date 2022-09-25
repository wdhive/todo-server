const mongoose = require('mongoose')

const participantSchema = mongoose.Schema(
  {
    participant: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    permissions: {
      type: Array,
      required: true,
    },
  },
  { versionKey: false }
)

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    completedBy: {
      type: mongoose.Types.ObjectId,
    },
    startingDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endingDate: {
      type: Date,
    },

    participants: [participantSchema],
    pendingParticipants: [participantSchema],
  },
  { versionKey: false }
)

taskSchema.pre('save', function (next) {
  if (!this.completed) {
    this.completedBy = undefined
    return next()
  }

  if (this.completed && this.completedBy) next()
  throw new ReqError('`completedBy` field is missing')
})

const taskModel = mongoose.model('task', taskSchema)
module.exports = taskModel

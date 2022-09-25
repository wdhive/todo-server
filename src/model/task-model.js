const mongoose = require('mongoose')

const participantSchema = mongoose.Schema(
  {
    _id: false,
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    role: {
      type: String,
      enum: ['admin', 'mod', 'assigner'],
      default: 'assigner',
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
      ref: 'user',
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    completedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    startingDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endingDate: {
      type: Date,
    },
    activeParticipants: [participantSchema],
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

const hasPermission = roles => {
  return function (user) {
    const userId = user._id.toString()

    if (this.owner.toString() === userId) return true

    return this.activeParticipants.some(({ user, role }) => {
      if (user.toString() === userId && roles.includes(role)) return true
    })
  }
}

taskSchema.methods.getAllParticipants = function () {
  const allParticipants = this.activeParticipants.map(({ user }) =>
    user.toString()
  )
  const pendingParticipants = this.pendingParticipants.map(({ user }) =>
    user.toString()
  )
  const mixedArray = [
    this.owner.toString(),
    allParticipants,
    pendingParticipants,
  ].flat()

  return Array.from(new Set(mixedArray))
}

taskSchema.methods.isAdmin = hasPermission(['admin'])
taskSchema.methods.isMod = hasPermission(['admin', 'mod'])
taskSchema.methods.isAssigner = hasPermission(['admin', 'mod', 'assigner'])

const taskModel = mongoose.model('task', taskSchema)
module.exports = taskModel

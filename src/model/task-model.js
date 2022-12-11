const mongoose = require('mongoose')
const socketStore = require('../controller/socket-store')
const { getSuccess } = require('../core/utils')
const Notification = require('./notification-model')
const TaskCollection = require('./task-collection-model')

const participantSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'assigner'],
      default: 'assigner',
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
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
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    participants: [participantSchema],
  },
  { versionKey: false }
)

taskSchema.index({ owner: 1 })

const postTaskDelete = async (task) => {
  const [notis] = await Promise.all([
    Notification.find({
      task: task._id,
      type: 'task-invitation',
    }).select('user'),
    TaskCollection.deleteMany({
      task: task._id,
    }),
  ]).catch(() => {})

  await Promise.all(notis.map((n) => n.delete()))
  notis.forEach((n) =>
    socketStore.send(
      n.user,
      socketStore.events.notification.delete,
      getSuccess({
        notification: n._id,
      })
    )
  )
}

taskSchema.post('remove', function () {
  postTaskDelete(this)
})

const getParticipantsFactory = (isActive) =>
  function () {
    const filteredParticipants = this.participants.filter(
      (user) => user.active === isActive
    )

    const participants = filteredParticipants.map(
      (user) => user.user?._id?.toString() || user.user?.toString()
    )

    const mixedArray = [
      this.owner?._id?.toString() || this.owner?.toString(),
      participants,
    ].flat()

    return Array.from(new Set(mixedArray))
  }

taskSchema.methods.getActiveParticipants = getParticipantsFactory(true)
taskSchema.methods.getInactiveParticipants = getParticipantsFactory(false)

const hasPermission = (roles) => {
  return function (user) {
    const userId = user._id.toString()
    if (this.owner.toString() === userId) return true
    return this.participants.some(({ user, role, active }) => {
      return user.toString() === userId && active && roles.includes(role)
    })
  }
}

taskSchema.methods.isOwner = function (userId) {
  return this.owner.toString() === userId.toString()
}
taskSchema.methods.isAdmin = hasPermission(['admin'])
taskSchema.methods.isModerator = hasPermission(['admin', 'moderator'])
taskSchema.methods.isAssigner = hasPermission([
  'admin',
  'moderator',
  'assigner',
])

const taskModel = mongoose.model('task', taskSchema)
module.exports = taskModel

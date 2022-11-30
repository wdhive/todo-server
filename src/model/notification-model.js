const mongoose = require('mongoose')
const socketStore = require('../controller/socket-store')
const coreUtils = require('../core/utils')

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    task: {
      type: mongoose.Types.ObjectId,
    },
    type: {
      type: String,
      enum: [
        'task-invite',
        'task-invite-accept',
        'task-participant-remove',
        'task-participant-promotion',
        'others',
      ],
      required: true,
      default: 'others',
    },
    createdAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  { versionKey: false }
)

notificationSchema.pre('save', function () {
  if (this.isNew) this.postIsNew = true
})

notificationSchema.post('save', function () {
  if (this.postIsNew && this.type === 'task-invite') {
    socketStore.send(
      this.user,
      socketStore.events.task.invite,
      coreUtils.getSuccess({ task: this.task })
    )
  }
})

const Notification = mongoose.model('notification', notificationSchema)
module.exports = Notification

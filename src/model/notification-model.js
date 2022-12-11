const mongoose = require('mongoose')
const { USER_PUBLIC_INFO } = require('../config/config')
const socketStore = require('../controller/socket-store')
const coreUtils = require('../core/utils')

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      select: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'user',
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
      default: Date.now,
    },
  },
  { versionKey: false }
)

notificationSchema.pre('save', function () {
  if (this.isNew) this.postIsNew = true
})

const sendInvition = async (noti) => {
  const notification = await noti.populate({
    path: 'createdBy',
    select: USER_PUBLIC_INFO,
  })
  socketStore.send(
    noti.user,
    socketStore.events.task.invite,
    coreUtils.getSuccess({ notification })
  )
}

notificationSchema.post('save', function () {
  if (this.postIsNew && this.type === 'task-invite') {
    sendInvition(this)
  }
})

const Notification = mongoose.model('notification', notificationSchema)
module.exports = Notification

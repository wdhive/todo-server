const mongoose = require('mongoose')
const { USER_PUBLIC_INFO } = require('../config/config')
const socketStore = require('../controller/socket-store')
const coreUtils = require('../core/utils')

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
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
        'task-invitation',
        'task-invitation-accepted',
        'task-invitation-denied',
        'task-particiapnt-removed',
        'task-particiapnt-left',
      ],
      required: true,
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

  socketStore.send(noti.user, noti.type, coreUtils.getSuccess({ notification }))
}

notificationSchema.post('save', function () {
  if (this.postIsNew) sendInvition(this)
})

notificationSchema.post('remove', function () {
  socketStore.send(
    this.user,
    socketStore.events.notification.delete,
    coreUtils.getSuccess({ notification: this._id }, 204)
  )
})

const Notification = mongoose.model('notification', notificationSchema)
module.exports = Notification

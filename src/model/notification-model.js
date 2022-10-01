const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema(
  {
    users: [mongoose.Types.ObjectId],
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
  },
  { versionKey: false }
)

module.exports = mongoose.model('notification', notificationSchema)

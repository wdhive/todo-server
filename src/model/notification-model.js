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
      ],
    },
  },
  { versionKey: false }
)

module.exports = mongoose.model('notification', notificationSchema)

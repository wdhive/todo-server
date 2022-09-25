const Task = require('../../model/task-model')

exports.taskPopulater = [
  {
    path: 'pendingParticipants activeParticipants',
    populate: {
      path: 'user',
      select: 'name username image',
    },
  },
  {
    path: 'owner',
    select: 'name username image',
  },
]
exports.generateGetAllTaskQuery = userId => {
  userId = userId.toString()
  return Task.find().where(
    `this.owner.toString() === ${userId} ||
     this.activeParticipants.some(({ user }) => user.toString() === ${userId} )`
  )
}


const { USER_PUBLIC_INFO } = require('../../config/config')

exports.taskPopulater = [
  {
    path: 'pendingParticipants activeParticipants',
    populate: {
      path: 'user',
      select: USER_PUBLIC_INFO,
    },
  },
  {
    path: 'owner',
    select: USER_PUBLIC_INFO,
  },
]

exports.getAllTaskCanDeleteScript = userId => {
  userId = userId.toString()
  return `this.owner.toString() === ${userId} ||
     this.activeParticipants.some(({ user, role }) =>
     user.toString() === ${userId} && role === 'admin')`
}

exports.getAllTaskScript = userId => {
  userId = userId.toString()
  return `this.owner.toString() === ${userId} ||
     this.activeParticipants.some(({ user }) => user.toString() === ${userId} )`
}

exports.validateParticipants = list => {
  const userIds = list.map(({ user }) => {
    if (user && typeof user === 'string') return user
    throw new ReqError('Invalid input')
  })

  const uniqueUserIds = new Set(userIds)
  if (uniqueUserIds.size !== userIds.length) {
    throw new ReqError('Duplicate input')
  }
}

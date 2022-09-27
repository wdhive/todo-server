const { USER_PUBLIC_INFO } = require('../../config/config')
const { usersExists } = require('../account/utils')

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

exports.getAllTaskFilter = userId => {
  return {
    $or: [
      { owner: userId },
      {
        pendingParticipants: {
          $elemMatch: {
            user: userId,
          },
        },
      },
    ],
  }
}

exports.validateParticipants = async list => {
  if (!list) return

  const userIds = list.map(({ user }) => {
    if (user && typeof user === 'string') return user
    throw new ReqError('Invalid input')
  })

  const uniqueUserIds = new Set(userIds)
  if (uniqueUserIds.size !== userIds.length) {
    throw new ReqError('Duplicate input')
  }

  if (!(await usersExists(userIds))) {
    throw new ReqError('All the users does not exists')
  }
}

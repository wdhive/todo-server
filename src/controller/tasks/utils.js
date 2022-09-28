const { USER_PUBLIC_INFO } = require('../../config/config')
const { usersExists } = require('../account/utils')

exports.taskPopulater = [
  {
    path: 'participants',
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
        participants: {
          $elemMatch: {
            user: userId,
            active: true,
          },
        },
      },
    ],
  }
}

exports.checkParticipants = async taskBody => {
  const list = taskBody.participants
  if (!list) return
  const userIds = []

  const okList = list.map(participants => {
    if (participants.user.toString() === taskBody.owner.toString()) {
      throw new ReqError('You can not invite the owner for a task')
    }

    userIds.push(participants.user)
    participants.active = false
    return participants
  })

  if (new Set(userIds).size !== userIds.length) {
    throw new ReqError('Duplicate input')
  }

  if (!(await usersExists(userIds))) {
    throw new ReqError('All the users does not exists')
  }

  return okList
}

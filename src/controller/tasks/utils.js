const Task = require('../../model/task-model')
const TaskCollection = require('../../model/task-collection-model')
const { USER_PUBLIC_INFO } = require('../../config/config')
const { usersExists } = require('../user/utils')
const Notification = require('../../model/notification-model')

exports.createInviteNotification = (task, participants) => {
  participants.forEach(({ user }) => {
    Notification.create({
      user,
      task: task._id,
      createdBy: task.owner,
      type: 'task-invitation',
    }).catch(() => {})
  })
}

exports.populateParticipants = [
  {
    path: 'participants',
    populate: {
      path: 'user',
      select: USER_PUBLIC_INFO,
    },
  },
  {
    path: 'owner completedBy',
    select: USER_PUBLIC_INFO,
  },
]

exports.getUsersAllTaskFilter = (userId, active = true) => {
  const filter = {
    $or: [
      { owner: userId },
      {
        participants: {
          $elemMatch: { user: userId },
        },
      },
    ],
  }

  if (active) {
    filter.$or[1].participants.$elemMatch.active = true
  }

  return filter
}

const getUsersTaskFilter = (taskId, ...args) => {
  return {
    $and: [
      {
        _id: taskId,
      },
      this.getUsersAllTaskFilter(...args),
    ],
  }
}
exports.getUsersTaskFilter = getUsersTaskFilter

exports.sanitizeParticipant = async (list, ownerId) => {
  const userIds = []

  const okList = list.map((participants) => {
    if (participants.user.toString() === ownerId.toString()) {
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

exports.saveAndGetTask = async (req) => {
  const savedTask = await req.task.save()
  const populated = await savedTask.populate(this.populateParticipants)

  let collectionId = req.task_collection?.collectionId
  if (!collectionId) {
    const collection = await TaskCollection.exists({
      user: req.user._id,
      task: req.task._id,
    })
      .lean()
      .select('collectionId')

    collectionId = collection?.collectionId
  }

  populated._doc.collection = collectionId
  return populated
}

exports.isTaskExists = async (taskId, userId) => {
  const filter = getUsersTaskFilter(taskId, userId, true)
  return Task.exists(filter)
}

exports.getParticipant = (task, userId) => {
  const participant = task.participants.find(({ user }) => {
    return user.toString() === userId.toString()
  })
  if (!participant) {
    throw new ReqError('Participant does not exists')
  }

  return participant
}

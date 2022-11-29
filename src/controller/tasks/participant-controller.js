const Notification = require('../../model/notification-model')
const socketStore = require('../socket-store')
const { saveAndGetTask } = require('./utils')
const coreUtils = require('../../core/utils')

const getParticipant = (req, userId, throwErrorAtNull = true) => {
  const participant = req.task.participants.find(({ user }) => {
    return user.toString() === userId.toString()
  })
  if (throwErrorAtNull && !participant) {
    throw new ReqError('Participant does not exists')
  }

  return participant
}

exports.removeUser = async (req, res, next) => {
  const participant = getParticipant(req, req.params.userId)
  participant.remove()
  next()

  await Notification.deleteMany({
    task: req.task._id,
    user: req.params.userId,
  })

  socketStore.send(
    req.params.userId,
    socketStore.events.task.participantDelete,
    coreUtils.getSuccess({ task: req.task._id })
  )
}

exports.changeRole = async (req, res, next) => {
  const roleBody = req.getBody('role')
  const participant = getParticipant(req, req.params.userId)
  participant.set(roleBody)
  next()
}

exports.acceptUser = async (req, res, next) => {
  const participant = getParticipant(req, req.user._id)
  if (participant.active) throw new ReqError('You are already in')
  participant.set({ active: true })
  next()
}

const Notification = require('../../model/notification-model')
const socketStore = require('../socket-store')
const coreUtils = require('../../core/utils')
const { getParticipant } = require('./utils')

exports.removeUser = async (req, res, next) => {
  const participant = getParticipant(req.task, req.params.userId)
  participant.remove()
  next()

  const foundNoti = await Notification.findOne({
    task: req.task._id,
    user: req.params.userId,
    type: 'task-invitation',
  })

  if (foundNoti) {
    await foundNoti.delete()
    socketStore.send(
      req.params.userId,
      socketStore.events.notification.delete,
      coreUtils.getSuccess({ notification: foundNoti._id })
    )
  }

  await Notification.create({
    task: req.task._id,
    user: req.params.userId,
    createdBy: req.task.owner,
    type: 'task-particiapnt-removed',
  })
}

exports.changeRole = async (req, res, next) => {
  const roleBody = req.getBody('role')
  const participant = getParticipant(req.task, req.params.userId)
  participant.set(roleBody)
  next()
}

exports.acceptUser = async (req, res, next) => {
  const participant = getParticipant(req.task, req.user._id)
  if (participant.active) throw new ReqError('You are already in')
  participant.set({ active: true })

  await req.task.validate()
  await Notification.create({
    task: req.task._id,
    user: req.task.owner,
    type: 'task-invitation-accepted',
    createdBy: req.user._id,
  })
  await Notification.deleteMany({
    task: req.task._id,
    user: req.user._id,
    type: 'task-invitation',
  })

  next()
}

exports.leftUser = async (req, res, next) => {
  throw new ReqError('This feature still not implemented')
}

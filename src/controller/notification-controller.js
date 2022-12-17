const { USER_PUBLIC_INFO } = require('../config/config')
const Notification = require('../model/notification-model')
const Task = require('../model/task-model')
const socketStore = require('./socket-store')
const { getParticipant } = require('./tasks/utils')

exports.getAll = async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id,
  }).populate({
    path: 'createdBy',
    select: USER_PUBLIC_INFO,
  })

  res.success({ notifications }, 200)
}

exports.clearOne = async (req, res, next) => {
  const noti = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  })

  if (noti.type !== 'task-invitation') {
    await noti.delete()
    return res.success(null, 204)
  }

  const task = await Task.findById(noti.task)
  const participant = task && getParticipant(task, req.user._id)

  if (!participant) {
    await noti.delete()
    return res.success(null, 204)
  }

  participant.remove()
  await Promise.all([
    noti.delete(),
    Notification.create({
      type: 'task-invitation-denied',
      task: task._id,
      user: task.owner,
      createdBy: req.user._id,
    }),
  ])

  req.task = task
  next()
}

exports.clearAll = async (req, res) => {
  await Notification.deleteMany({
    user: req.user._id,
    type: { $not: { $eq: 'task-invitation' } },
  })

  socketStore.send(
    req,
    socketStore.events.notification.deleteAll,
    res.success(null, 204)
  )
}

const accountUtils = require('../account/utils')
const Task = require('../../model/task-model')
const TaskSocketClient = require('./task-socket-client')
const socketStore = require('../../core/socket-store')
const { getFeildsFromObject } = require('../../utils')
const { taskPopulater, generateGetAllTaskQuery } = require('./utils')

exports.getAllTask = async (req, res) => {
  const tasks = await generateGetAllTaskQuery(req.user._id)
    .limit(100)
    .lean()
    .populate(taskPopulater)

  const tasksCount = await generateGetAllTaskQuery(
    req.user._id
  ).estimatedDocumentCount()

  res.success({ tasksCount, tasks })
}

exports.createTask = async (req, res) => {
  const { title, description, startingDate, endingDate, pendingParticipants } =
    req.body
  accountUtils.validateParticipants(pendingParticipants)

  const task = await (
    await Task.create({
      title,
      description,
      startingDate,
      endingDate,
      owner: req.user._id,
      pendingParticipants,
    })
  ).populate(taskPopulater)
  socketStore.sendDataExceptReq(
    req,
    TaskSocketClient.events.task.create,
    res.success({ task }, 201)
  )
}

exports.updateTask = async (req, res) => {
  if (!req.task.isMod(req.user)) {
    if (req.task.isAssigner(req.user)) {
      taskBody = getFeildsFromObject(taskBody, 'completed')
    } else throw new ReqError('You do not have permission to update this task')
  }

  let taskBody = getFeildsFromObject(
    req.body,
    'title description startingDate endingDate completed'
  )

  for (let key in taskBody) {
    const value = taskBody[key]

    if (value != null) {
      req.task[key] = value
    }
  }

  const updatedTask = await (await req.task.save()).populate(taskPopulater)
  socketStore.sendDataExceptReq(
    req,
    TaskSocketClient.events.task.update,
    res.success({ task: updatedTask })
  )
}

exports.deleteTask = async (req, res) => {
  if (!req.task.isAdmin(req.user)) {
    throw new ReqError('You do not have permission to delete this task')
  }
  await req.task.delete()
  const allParticipants = req.task.getAllParticipants()

  socketStore.sendDataExcept(
    allParticipants,
    req.body && req.body.socketId,
    TaskSocketClient.events.task.delete,
    res.success({ taskId: req.task._id }, 204)
  )
}

exports.setTaskParticipantsMiddleWare = async (req, res, next) => {
  const task = await Task.findById(req.params.taskId).select(
    'owner pendingParticipants activeParticipants'
  )
  if (!task) throw new ReqError('No task found', 404)

  req.task = task
  next()
}

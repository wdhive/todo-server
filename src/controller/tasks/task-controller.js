const Task = require('../../model/task-model')
const TaskCategory = require('../../model/task-category-model')
const taskFactory = require('./task-factory')
const {
  populateParticipants,
  getUsersAllTaskFilter,
  sanitizeParticipant,
  saveAndGetTask,
} = require('./utils')
const socketStore = require('../socket-store')

exports.setTaskFromActiveUsers = taskFactory.setTaskParticipants(true)
exports.setTaskFromInactiveUsers = taskFactory.setTaskParticipants(false)
exports.onlyForOwner = (req, res, next) => {
  if (!req.task.isOwner(req.user._id)) {
    throw new ReqError('You need to be the owner to remove a user')
  }
  next()
}

exports.onlyForAssigner = (req, res, next) => {
  if (!req.task.isAssigner(req.user._id)) {
    throw new ReqError('You need to be an assigner to do this operation')
  }
  next()
}

exports.saveAndSendTask = async (req, res) => {
  const task = await saveAndGetTask(req.task)
  const data = res.success({ task })

  socketStore.send(req, socketStore.events.task.update, data, {
    rooms: task.getActiveParticipants(),
  })
}

exports.getAllTask = async (req, res) => {
  const queryScript = getUsersAllTaskFilter(req.user._id)
  const tasks = await Task.find(queryScript).populate(populateParticipants)
  const totalTasks = await Task.find(queryScript).countDocuments()

  const taskIds = tasks.map(task => task._id)
  const taskCategories = await TaskCategory.find({
    user: req.user._id,
    task: taskIds,
  })

  res.success({ totalTasks, tasks, taskCategories })
}

exports.createTask = async (req, res, next) => {
  const taskBody = req.getBody(
    'title description startingDate endingDate participants'
  )
  taskBody.owner = req.user._id
  taskBody.participants = await sanitizeParticipant(taskBody)

  req.task = new Task(taskBody)
  next()
}

exports.updateTask = async (req, res, next) => {
  let taskBody = req.getBody('title description startingDate endingDate')
  if (!req.task.isModerator(req.user)) {
    throw new ReqError('You do not have permission to update this task')
  }

  req.task.set(taskBody)
  next()
}

exports.completeTask = async (req, res, next) => {
  req.task.completed = true
  req.task.completedBy = req.user._id
  next()
}

exports.unCompleteTask = async (req, res, next) => {
  req.task.completed = false
  req.task.completedBy = undefined
  next()
}

exports.deleteTask = async (req, res) => {
  if (!req.task.isAdmin(req.user)) {
    throw new ReqError('You do not have permission to delete this task')
  }
  await req.task.delete()

  socketStore.send(
    req,
    socketStore.events.task.delete,
    res.success({ task: req.task._id }, 204),
    {
      rooms: [
        ...req.task.getActiveParticipants(),
        ...req.task.getInactiveParticipants(),
      ],
    }
  )
}

const Task = require('../../model/task-model')
const TaskCategory = require('../../model/task-category-model')
const taskFactory = require('./task-factory')
const {
  populateParticipants,
  getUsersAllTaskFilter,
  sanitizeParticipant,
} = require('./utils')

exports.setTaskFromActiveUsers = taskFactory.setTaskParticipants(true)
exports.setTaskFromInactiveUsers = taskFactory.setTaskParticipants(false)
exports.onlyForOwner = (req, res, next) => {
  if (!req.task.isOwner(req.user._id)) {
    throw new ReqError('You need to be the owner to remove a user')
  }
  next()
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
  let taskBody = req.getBody(
    'title description startingDate endingDate completed'
  )

  if (!req.task.isModerator(req.user)) {
    if (req.task.isAssigner(req.user)) {
      taskBody = req.getBody('completed')
    } else {
      throw new ReqError('You do not have permission to update this task')
    }
  }

  req.task.set(taskBody)
  next()
}

exports.deleteTask = async (req, res) => {
  if (!req.task.isAdmin(req.user)) {
    throw new ReqError('You do not have permission to delete this task')
  }
  await req.task.delete()

  res.success({ taskId: req.task._id }, 204)
}

exports.saveAndSendTask = async (req, res) => {
  const savedTask = await req.task.save()
  const task = await savedTask.populate(populateParticipants)
  res.success({ task })
}

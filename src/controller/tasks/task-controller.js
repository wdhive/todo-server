const Task = require('../../model/task-model')
const TaskCategory = require('../../model/task-category-model')
const UserSettings = require('../../model/user-settings-model')
const TaskSocketClient = require('../socket-client')
const socketStore = require('../../socket/socket-store')
const {
  populateParticipants,
  getUsersAllTaskFilter,
  sanitizeParticipant,
} = require('./utils')

exports.setTaskParticipants = async (req, res, next) => {
  const task = await Task.findById(req.params.taskId).select(
    'owner participants'
  )
  if (!task) throw new ReqError('No task found', 404)
  req.task = task
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

exports.createTask = async (req, res) => {
  const taskBody = req.getBody(
    'title description startingDate endingDate participants'
  )
  taskBody.owner = req.user._id
  taskBody.participants = await sanitizeParticipant(taskBody)

  const task = await (
    await Task.create(taskBody)
  ).populate(populateParticipants)
  socketStore.send(
    req,
    TaskSocketClient.events.task.create,
    res.success({ task }, 201)
  )
}

exports.updateTask = async (req, res) => {
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

  const updatedTask = await (
    await req.task.set(taskBody).save()
  ).populate(populateParticipants)

  socketStore.send(
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

  socketStore.send(
    req,
    TaskSocketClient.events.task.delete,
    res.success({ taskId: req.task._id }, 204),
    {
      rooms: req.task.getAllParticipants(),
    }
  )
}

exports.addCategory = async (req, res) => {
  const isTaskExists = await Task.findById(req.params.taskId).countDocuments()
  if (!isTaskExists) throw new ReqError('Task not exists!')

  const isCategoryExists = await UserSettings.find({
    $and: [
      {
        _id: req.user._id,
      },
      {
        taskCategories: {
          $elemMatch: {
            _id: req.body.category,
          },
        },
      },
    ],
  }).countDocuments()
  if (!isCategoryExists) throw new ReqError('Category not exists!')

  const taskCategoryData = {
    user: req.user._id,
    task: req.params.taskId,
    category: req.body.category,
  }

  const isTaskCategoryAlreadyAdded = await TaskCategory.find(
    taskCategoryData
  ).countDocuments()
  if (isTaskCategoryAlreadyAdded) {
    throw new ReqError('Category already added')
  }

  const category = await TaskCategory.create(taskCategoryData)
  res.success({ category })
}

exports.removeCategory = async (req, res) => {
  if (!(req.user._id && req.params.taskId && req.params.categoryId)) {
    throw new ReqError('Invalid input')
  }

  await TaskCategory.deleteMany({
    user: req.user._id,
    task: req.params.taskId,
    category: req.params.categoryId,
  })
  res.success(null, 204)
}

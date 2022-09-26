const Task = require('../../model/task-model')
const TaskCategory = require('../../model/task-category-model')
const UserSettings = require('../../model/user-settings-model')
const TaskSocketClient = require('./task-socket-client')
const socketStore = require('../../socket/socket-store')
const { getFeildsFromObject } = require('../../utils')
const {
  taskPopulater,
  getAllTaskFilter,
  validateParticipants,
} = require('./utils')

exports.setTaskParticipantsMiddleWare = async (req, res, next) => {
  const task = await Task.findById(req.params.taskId).select(
    'owner pendingParticipants activeParticipants'
  )
  if (!task) throw new ReqError('No task found', 404)
  req.task = task
  next()
}

exports.getAllTask = async (req, res) => {
  const queryScript = getAllTaskFilter(req.user._id)
  const tasks = await Task.find(queryScript).lean().populate(taskPopulater)
  const tasksCount = await Task.find(queryScript).countDocuments()

  const taskIds = tasks.map(task => task._id)
  const taskCategories = await TaskCategory.find({
    user: req.user._id,
    task: taskIds,
  })

  tasks.forEach(task => {
    const taskCategory = taskCategories.find(
      taskCategory => taskCategory.task.toString() === task._id.toString()
    )
    if (taskCategory) {
      task.category = taskCategory.category
    }
  })

  res.success({ tasksCount, tasks })
}

exports.createTask = async (req, res) => {
  const taskBody = req.getBody(
    'title description startingDate endingDate pendingParticipants'
  )

  validateParticipants(taskBody.pendingParticipants)

  const task = await (
    await Task.create({
      ...taskBody,
      owner: req.user._id,
    })
  ).populate(taskPopulater)

  socketStore.send(
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

  let taskBody = req.getBody(
    'title description startingDate endingDate completed'
  )

  for (let key in taskBody) {
    const value = taskBody[key]

    if (value != null) {
      req.task[key] = value
    }
  }

  const updatedTask = await (await req.task.save()).populate(taskPopulater)
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
  const allParticipants = req.task.getAllParticipants()

  socketStore.send(
    req,
    TaskSocketClient.events.task.delete,
    res.success({ taskId: req.task._id }, 204),
    {
      rooms: allParticipants,
    }
  )
}

exports.addCategory = async (req, res) => {
  const categoryIsExists = await UserSettings.find({
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
  if (!categoryIsExists) throw new ReqError('Category not exists!')

  const category = await TaskCategory.create({
    user: req.user._id,
    task: req.params.taskId,
    category: req.body.category,
  })

  res.success({ category })
}

exports.removeCategory = async (req, res) => {
  await TaskCategory.deleteMany({
    user: req.user._id,
    category: req.body.category,
  })

  res.success(null, 204)
}

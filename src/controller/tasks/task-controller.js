const Task = require('../../model/task-model')
const TaskCategory = require('../../model/task-category-model')
const UserSettings = require('../../model/user-settings-model')
const taskFactory = require('./task-factory')
const {
  populateParticipants,
  getUsersAllTaskFilter,
  sanitizeParticipant,
  getUsersTaskFilter,
} = require('./utils')

exports.restrictedToOwner = (req, res, next) => {
  if (!req.task.isOwner(req.user._id)) {
    throw new ReqError('You need to be the owner to remove a user')
  }
  next()
}

exports.setTaskActiveParticipants = taskFactory.setTaskParticipants(true)
exports.setTaskAllParticipants = taskFactory.setTaskParticipants(false)

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

exports.addCategory = async (req, res) => {
  const isTaskExists = await Task.findOne(
    getUsersTaskFilter(req.params.taskId, req.user._id)
  ).countDocuments()
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

exports.saveAndSendTask = async (req, res) => {
  const savedTask = await req.task.save()
  const task = await savedTask.populate(populateParticipants)
  res.success({ task })
}

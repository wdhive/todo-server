const Task = require('../../model/task-model')
const TaskCollection = require('../../model/task-collection-model')
const taskFactory = require('./task-factory')
const {
  populateParticipants,
  getUsersAllTaskFilter,
  sanitizeParticipant,
  saveAndGetTask,
  isTaskExists,
  createInviteNotification,
} = require('./utils')
const socketStore = require('../socket-store')

exports.setTaskFromActiveUsers = taskFactory.setTaskParticipants({
  active: true,
})
exports.setTaskFromAllUsers = taskFactory.setTaskParticipants({
  active: false,
})
exports.isTaskExistsFromActiveUsers = async (req, res, next) => {
  if (await isTaskExists(req.params.taskId, req.user._id)) {
    return next()
  }

  throw new ReqError("Task doesn't exists", 404)
}

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
  const task = await saveAndGetTask(req)
  const data = res.success({ task })

  socketStore.send(req, socketStore.events.task.update, data, {
    rooms: task.getActiveParticipants(),
  })
}

exports.getAllTask = async (req, res) => {
  const queryScript = getUsersAllTaskFilter(req.user._id)

  const totalTasks = await Task.find(queryScript).countDocuments()
  const tasks = await Task.find(queryScript)
    .lean()
    .populate(populateParticipants)

  const collectionsArray = await TaskCollection.find({
    user: req.user._id,
    task: tasks.map((task) => task._id),
  }).lean()
  const collectionsIds = {}
  collectionsArray.forEach(({ task, collectionId }) => {
    collectionsIds[task] = collectionId
  })

  tasks.forEach((task) => {
    task.collection = collectionsIds[task._id]
  })

  res.success({ totalTasks, tasks })
}

exports.createTask = async (req, res, next) => {
  const taskBody = req.getBody('title description startingDate endingDate')
  taskBody.startingDate ||= Date.now()
  taskBody.owner = req.user._id
  req.task = new Task(taskBody)

  const participants = req.body.participants
  if (!participants) return next()

  req.task.participants = await sanitizeParticipant(
    participants,
    req.task.owner
  )

  await req.task.validate()
  next()
  createInviteNotification(req.task, participants)
}

exports.updateTask = async (req, res, next) => {
  let taskBody = req.getBody('title description startingDate endingDate')
  if (!req.task.isModerator(req.user)) {
    throw new ReqError('You do not have permission to update this task')
  }
  req.task.set(taskBody)

  const participants = req.body.participants
  if (!participants || !req.task.isOwner(req.user._id)) return next()

  const alreadyParticipants =
    req.task.participants?.map(({ user }) => user.toString()) ?? []
  const validParticipants = await sanitizeParticipant(
    participants,
    req.task.owner
  )

  validParticipants.forEach(({ user }) => {
    if (alreadyParticipants.includes(user)) {
      throw new ReqError('User already invited')
    }
  })

  req.task.participants.push(...validParticipants)
  await req.task.validate()
  next()
  createInviteNotification(req.task, validParticipants)
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

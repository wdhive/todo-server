const TaskCollection = require('../../model/task-collection-model')
const UserSettings = require('../../model/user-settings-model')

exports.updateTaskCollection = async (req, res, next) => {
  const collectionId = req.body.collection
  if (!collectionId) return next()

  await req.task.validate()
  const userId = req.user._id
  const taskId = req.task._id

  const isCollectionExists = await UserSettings.exists({
    collections: { $elemMatch: { _id: collectionId } },
  })
  if (!isCollectionExists) {
    throw new ReqError(`Collection does not exists`, 404)
  }

  const filter = {
    user: userId,
    task: taskId,
  }

  await TaskCollection.deleteMany(filter)
  req.task_collection = await TaskCollection.create({
    ...filter,
    collectionId,
  })

  next()
}

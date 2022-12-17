const TaskCollection = require('../../model/task-collection-model')
const UserSettings = require('../../model/user-settings-model')

exports.updateTaskCollection = async (req, res, next) => {
  const collectionId = req.body.collection
  if (collectionId === undefined) return next()

  const filter = {
    user: req.user._id,
    task: req.task._id,
  }

  await TaskCollection.deleteOne(filter)
  if (!collectionId) return next()

  const isCollectionExists = await UserSettings.exists({
    collections: { $elemMatch: { _id: collectionId } },
  })
  if (!isCollectionExists) {
    throw new ReqError(`Collection does not exists`, 404)
  }
  req.task_collection = await TaskCollection.create({
    ...filter,
    collectionId,
  })

  next()
}

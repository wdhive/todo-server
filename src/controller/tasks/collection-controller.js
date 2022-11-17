const TaskCollection = require('../../model/task-collection-model')
const UserSettings = require('../../model/user-settings-model')

const isCollectionExists = (field) => async (req, res, next) => {
  const collection = req[field].collection

  if (
    await UserSettings.exists({
      collections: { $elemMatch: { _id: collection } },
    })
  ) {
    return next()
  }

  throw new ReqError(`Collection does not exists`, 404)
}

exports.isCollectionExists_body = isCollectionExists('body')
exports.isCollectionExists_params = isCollectionExists('params')

exports.addCollection = async (req, res) => {
  const collection = await TaskCollection.create({
    user: req.user._id,
    task: req.params.taskId,
    collectionId: req.body.collection,
  })

  res.success({ collection })
}

exports.removeCollection = async (req, res) => {
  await TaskCollection.deleteOne({
    user: req.user._id,
    task: req.params.taskId,
    collectionId: req.params.collection,
  })
  res.success(null, 204)
}

const TaskCollection = require('../../model/task-collection-model')
const UserSettings = require('../../model/user-settings-model')

exports.setSettings = async (req, res, next) => {
  let settings = await UserSettings.findById(req.user._id)
  req.user_settings = settings
  next()
}

exports.setTaskCollection = async (req, res, next) => {
  const collection = req.user_settings.collections.id(req.params.collection)
  if (!collection) {
    throw new ReqError('No Collection found with this id')
  }
  req.user_collection = collection
  next()
}

exports.createTaskCollection = async (req, res) => {
  const collection = req.user_settings.collections.create(req.body)
  req.user_settings.collections.push(collection)

  await req.user_settings.save()
  res.success({ collection })
}

exports.updateTaskCollection = async (req, res) => {
  const reqBody = req.getBody('name hue')
  const collection = req.user_collection
  collection.set(reqBody)

  await req.user_settings.save()
  res.success({ collection })
}

exports.deleteTaskCollection = async (req, res) => {
  req.user_collection.remove()
  await req.user_settings.save()
  await TaskCollection.deleteMany({
    collectionId: req.params.collection,
  })
  res.success(null, 204)
}

exports.updateSettings = async (req, res) => {
  const settingsBody = req.getBody('theme hue')
  const newSettings = await req.user_settings.set(settingsBody).save()
  res.success({
    settings: newSettings,
  })
}

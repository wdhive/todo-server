const UserSettings = require('../../model/user-settings-model')
// Must need refactor [DRY]

exports.getSettingsMiddleware = async (req, res, next) => {
  let settings = await UserSettings.findById(req.user._id)
  if (!settings) {
    settings = await UserSettings.create({ _id: req.user._id })
  }

  req.userSettings = settings
  next()
}

exports.addTaskCategory = async (req, res) => {
  const category = req.userSettings.taskCategories.create(req.body)
  req.userSettings.taskCategories.push(category)
  await req.userSettings.save()
  res.success({ category })
}

exports.updateTaskCategory = async (req, res) => {
  const category = req.userSettings.taskCategories.id(req.params.categoryId)
  delete req.body._id
  category.set(req.body)
  await req.userSettings.save()
  res.success({ category })
}

exports.removeTaskCategory = async (req, res) => {
  const category = req.userSettings.taskCategories.id(req.params.categoryId)
  if (!category) {
    throw new ReqError('No category found with this id')
  }
  category.remove()
  await req.userSettings.save()
  res.success(null, 204)
}

exports.changeTheme = async (req, res) => {
  req.userSettings.theme = req.body.theme
  const newSettings = await req.userSettings.save()
  res.success({ theme: newSettings.theme })
}

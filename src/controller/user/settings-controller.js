const TaskCategory = require('../../model/task-category-model')
const UserSettings = require('../../model/user-settings-model')

exports.setSettings = async (req, res, next) => {
  let settings = await UserSettings.findById(req.user._id)
  req.userSettings = settings
  next()
}

exports.setTaskCategory = async (req, res, next) => {
  const Categories = req.userSettings.taskCategories.id(req.params.categoryId)
  if (!category) {
    throw new ReqError('No category found with this id')
  }
  req.userSettingsCategories = Categories
  next()
}

exports.addTaskCategory = async (req, res) => {
  const category = req.userSettings.taskCategories.create(req.body)
  req.userSettings.taskCategories.push(category)
  await req.userSettings.save()
  res.success({ category })
}

exports.updateTaskCategory = async (req, res) => {
  const categories = req.userSettingsCategories
  delete req.body._id
  categories.set(req.body)
  await req.userSettings.save()
  res.success({ category: categories })
}

exports.deleteTaskCategory = async (req, res) => {
  req.userSettingsCategories.remove()
  await req.userSettings.save()
  await TaskCategory.deleteMany({ category: req.params.categoryId })
  res.success(null, 204)
}

exports.changeTheme = async (req, res) => {
  const themeBody = req.getBody('theme hue')
  const newSettings = await req.userSettings.set(themeBody).save()
  res.success({
    theme: newSettings.theme,
    hue: newSettings.hue,
  })
}

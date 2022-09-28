const TaskCategory = require('../../model/task-category-model')
const UserSettings = require('../../model/user-settings-model')

exports.getSettingsMiddleware = async (req, res, next) => {
  let settings = await UserSettings.findById(req.user._id)
  req.userSettings = settings
  next()
}

exports.findAndSetTaskCategoryMiddleware = async (req, res, next) => {
  const category = req.userSettings.taskCategories.id(req.params.categoryId)
  if (!category) {
    throw new ReqError('No category found with this id')
  }
  req.userSettingsCategory = category
  next()
}

exports.addTaskCategory = async (req, res) => {
  const category = req.userSettings.taskCategories.create(req.body)
  req.userSettings.taskCategories.push(category)
  await req.userSettings.save()
  res.success({ category })
}

exports.updateTaskCategory = async (req, res) => {
  const category = req.userSettingsCategory
  delete req.body._id
  category.set(req.body)
  await req.userSettings.save()
  res.success({ category })
}

exports.deleteTaskCategory = async (req, res) => {
  req.userSettingsCategory.remove()
  await req.userSettings.save()
  await TaskCategory.deleteMany({ category: req.params.categoryId })
  res.success(null, 204)
}

exports.changeTheme = async (req, res) => {
  const themeBody = req.getFields('theme hue')
  req.userSettings.set(themeBody)
  const newSettings = await req.userSettings.save()
  res.success({
    theme: newSettings.theme,
    hue: newSettings.hue,
  })
}

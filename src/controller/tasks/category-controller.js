const Task = require('../../model/task-model')
const TaskCategory = require('../../model/task-category-model')
const UserSettings = require('../../model/user-settings-model')
const { getUsersTaskFilter } = require('./utils')

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

  const category = await TaskCategory.create({
    user: req.user._id,
    task: req.params.taskId,
    category: req.body.category,
  })
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

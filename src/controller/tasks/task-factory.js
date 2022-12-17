const Task = require('../../model/task-model')
const { getUsersTaskFilter } = require('./utils')

exports.setTaskParticipants =
  ({ active }) =>
  async (req, res, next) => {
    const filter = getUsersTaskFilter(req.params.taskId, req.user._id, active)
    const task = await Task.findOne(filter)

    if (!task) throw new ReqError('No task found', 404)
    req.task = task
    next()
  }

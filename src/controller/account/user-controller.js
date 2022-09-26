const Task = require('../../model/task-model')
const socketStore = require('../../socket/socket-store')
const { getAllTaskCanDeleteScript } = require('../tasks/utils')

exports.getUser = async (req, res) => {
  res.success({ user: req.user.getSafeInfo() })
}

exports.updateUser = async (req, res) => {
  const body = req.getBody('name image')

  for (let key in body) {
    const value = body[key]
    if (value) {
      req.user[key] = value
    }
  }

  req.user = await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}

exports.deleteUser = async (req, res) => {
  await req.user.delete()
  socketStore.disconnect(req, {
    exclude: false,
    cause: 'Delete Account',
  })

  // TODO:BUG:HACK: Delete all task that are only assinged to this user
  const deleted = await Task.deleteMany().where(
    getAllTaskCanDeleteScript(req.user._id)
  )

  console.log({ deleted })

  res.success(null, 204)
}

const UserSettings = require('../../model/user-settings-model')
const file = require('../../file')

exports.getUser = async (req, res) => {
  const data = { user: req.user.getSafeInfo() }
  if (req.query.settings !== undefined) {
    data.settings = await UserSettings.findById(req.user._id)
  }
  res.success(data)
}

exports.updateUser = async (req, res) => {
  const body = req.getBody('name avatar')
  req.user.set(body)

  await req.user.validate()
  await file.updateFile(req, req.user)

  req.user = await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}

exports.deleteUser = async (req, res) => {
  await req.user.delete()
  res.success(null, 204)
}

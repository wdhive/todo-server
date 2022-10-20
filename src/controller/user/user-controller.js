const UserSettings = require('../../model/user-settings-model')

exports.getUser = async (req, res) => {
  const data = { user: req.user.getSafeInfo() }
  if (req.query.settings !== undefined) {
    data.settings = await UserSettings.findById(req.user._id)
  }
  res.success(data)
}

exports.updateUser = async (req, res) => {
  const body = req.getBody('name avatar')

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
  res.success(null, 204)
}

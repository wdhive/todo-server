exports.getUser = async (req, res) => {
  if (req.query.settings !== undefined) {
    req.user = await req.user.populate('settings')
  }

  res.success({
    user: req.user.getSafeInfo(),
  })
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
  res.success(null, 204)
}

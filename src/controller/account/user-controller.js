exports.getUser = async (req, res) => {
  res.success({ user: req.user.getSafeInfo() })
}

exports.updateUser = async (req, res) => {
  let modified = false
  const body = {
    name: req.body.name,
    image: req.body.image,
  }

  for (let key in body) {
    const value = body[key]
    if (value && value !== req.user[key]) {
      req.user[key] = value
      modified = true
    }
  }

  if (modified) req.user = await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}

exports.deleteUser = async (req, res) => {
  await req.user.delete()
  // TODO: Delete all task that are only assinged to this user

  res.success(null, 204)
}

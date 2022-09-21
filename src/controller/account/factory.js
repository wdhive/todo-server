exports.changeEmailAndUsername = path => async (req, res) => {
  const new_Details = req.body['new_' + path]
  if (req[path] !== new_Details) {
    req.user[path] = new_Details
    req.user = await req.user.save()
  } else throw new ReqError('You have entered the previous ' + path)
  res.success({ user: req.user.getSafeInfo() })
}

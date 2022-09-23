exports.changeEmailAndUsername = field => async (req, res) => {
  const new_Details = req.body['new_' + field]
  if (req[field] !== new_Details) {
    req.user[field] = new_Details
    req.user = await req.user.save()
  } else {
    const capitalizedField =
      field[0].toUpperCase() + field.split('').slice(1).join('')
    throw new ReqError(`${capitalizedField} can't be the same`)
  }
  res.success({ user: req.user.getSafeInfo() })
}

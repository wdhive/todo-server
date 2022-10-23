const User = require('../model/user-model')

exports.usersCount = async (req, res) => {
  const count = await User.estimatedDocumentCount()
  res.success({ count })
}

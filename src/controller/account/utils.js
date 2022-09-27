const mongoose = require('mongoose')
const jwtToken = require('../../utils/jwt-token')
const User = require('../../model/user-model')

exports.sendUserAndJWT = (res, user) => {
  const userMode =
    !(user instanceof mongoose.Types.ObjectId) && user instanceof Object

  const token = jwtToken.generate(userMode ? user._id : user)
  const data = { token }
  if (userMode) data.user = user.getSafeInfo()
  res.success(data)
}

exports.getFindUserQuery = login => {
  if (typeof login !== 'string') throw new ReqError('Login field is missing')
  return login.includes('@') ? { email: login } : { username: login }
}

exports.createOrUpdateCode = async (doc, model, data) => {
  if (doc) {
    for (let key in data) doc[key] = data[key]
    await doc.save()
  } else {
    await model.create(data)
  }
}

exports.usersExists = async userIds => {
  const uniqueUserIds = [...new Set(userIds)]
  const usersCount = await User.find({ _id: uniqueUserIds }).countDocuments()
  return uniqueUserIds.length === usersCount
}

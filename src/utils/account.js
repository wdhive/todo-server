const mongoose = require('mongoose')
const jwtToken = require('./jwt-token')
const errorMessages = require('./error-messages')

exports.sendUserAndJWT = (res, user) => {
  const userMode =
    !(user instanceof mongoose.Types.ObjectId) && user instanceof Object

  const token = jwtToken.generate(userMode ? user._id : user)
  const data = { token }
  if (userMode) data.user = user.getSafeInfo()
  res.success(data)
}

exports.getFindUserQuery = (email, username) => {
  if (email && username) {
    throw new ReqError(errorMessages.extra.findWithEmailAndPassword)
  }
  return email ? { email } : { username }
}

exports.createOrUpdateCode = async (doc, model, data) => {
  if (doc) {
    for (let key in data) doc[key] = data[key]
    await doc.save()
  } else {
    await model.create(data)
  }
}

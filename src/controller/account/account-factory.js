const socketStore = require('../../socket/socket-store')
const errorMessages = require('../../utils/error-messages')
const { sendUserAndJWT } = require('./utils')

exports.changeEmailAndUsername = field => async (req, res) => {
  const newDetails = req.body['new_' + field]
  if (req.user[field] === newDetails) {
    throw new ReqError(errorMessages.extra.enteredExistingInfo(field))
  }

  req.user[field] = newDetails
  req.user = await req.user.save()

  if (field === 'password') {
    socketStore.disconnect(req, {
      cause: 'Password change',
    })
    return sendUserAndJWT(res, req.user._id)
  }

  res.success({ user: req.user.getSafeInfo() })
}

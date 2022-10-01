const socketStore = require('../socket-store')
const errorMessages = require('../../utils/error-messages')
const { sendJWT } = require('../account/utils')

exports.changeUserInfo = field => async (req, res) => {
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
    sendJWT(res, req.user._id)

    return
  }

  res.success({ user: req.user.getSafeInfo() })
}

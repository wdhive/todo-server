const socketStore = require('../socket-store')
const errorMessages = require('../../utils/error-messages')

exports.changeUserInfo = (field) => async (req, res, next) => {
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

    return next()
  }

  res.success({ user: req.user.getSafeInfo() })
}

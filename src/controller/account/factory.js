const errorMessages = require('../../utils/error-messages')

exports.changeEmailAndUsername = field => async (req, res) => {
  const new_Details = req.body['new_' + field]
  if (req[field] !== new_Details) {
    req.user[field] = new_Details
    req.user = await req.user.save()
  } else {
    throw new ReqError(errorMessages.extra.enteredExistingInfo(field))
  }
  res.success({ user: req.user.getSafeInfo() })
}

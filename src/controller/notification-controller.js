const Notification = require('../model/notification-model')

exports.clearOne = async (req, res) => {
  await Notification.deleteOne({
    _id: req.params.notiId,
    user: req.user._id,
  })

  res.success(null, 204)
}

exports.clearAll = async (req, res) => {
  await Notification.deleteMany({
    _id: req.user._id,
  })

  res.success(null, 204)
}

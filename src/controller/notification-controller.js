const Notification = require('../model/notification-model')

exports.getAll = async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id,
  })

  res.success({ notifications }, 200)
}

exports.clearOne = async (req, res) => {
  await Notification.deleteOne({
    _id: req.params.id,
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

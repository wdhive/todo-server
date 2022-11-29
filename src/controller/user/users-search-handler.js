const User = require('../../model/user-model')

module.exports = async (req, res) => {
  if (!req.query.username) {
    throw new ReqError('Please provide a valid username')
  }

  const exactUser = await User.findOne({
    username: req.query.username,
  })
    .select('name username avatar createdAt')
    .lean()

  const matchedUsers = await User.find({
    username: {
      $regex: req.query.username,
      $options: 'i',
    },
  })
    .select('name username avatar createdAt')
    .limit(20)
    .lean()
    .sort({
      username: 1,
    })

  if (exactUser) {
    const ind = matchedUsers.findIndex(
      (user) => user._id.toString() === exactUser._id.toString()
    )

    if (ind >= 0) matchedUsers.splice(ind, 1)
    matchedUsers.unshift(exactUser)
  }

  res.success({ user: matchedUsers })
}

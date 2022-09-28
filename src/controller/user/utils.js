exports.usersExists = async userIds => {
  const uniqueUserIds = [...new Set(userIds)]
  const usersCount = await User.find({ _id: uniqueUserIds }).countDocuments()
  return uniqueUserIds.length === usersCount
}

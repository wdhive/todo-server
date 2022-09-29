const getParticipant = (req, userId, throwErrorAtNull = true) => {
  const participant = req.task.participants.find(({ user }) => {
    return user.toString() === userId.toString()
  })
  if (throwErrorAtNull && !participant) {
    throw new ReqError('Participant does not exists')
  }

  return participant
}

exports.inviteUser = async (req, res, next) => {
  const userBody = req.getBody('user role')
  if (req.task.isOwner(userBody.user)) {
    throw new ReqError('You can not invite the owner')
  }

  const participant = getParticipant(req, userBody.user, false)
  if (participant?.active) throw new ReqError('User already been added')
  if (participant) throw new ReqError('Invitation already sent')

  req.task.participants.push(userBody)
  next()
}

exports.removeUser = async (req, res, next) => {
  const participant = getParticipant(req, req.params.userId)
  participant.remove()
  next()
}

exports.changeRole = async (req, res, next) => {
  const roleBody = req.getBody('role')
  const participant = getParticipant(req, req.params.userId)
  participant.set(roleBody)
  next()
}

exports.acceptUser = async (req, res, next) => {
  const participant = getParticipant(req, req.user._id)
  if (participant.active) throw new ReqError('You are already in')
  participant.set({ active: true })
  next()
}

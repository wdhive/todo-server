exports.inviteUser = async (req, res) => {
  const userBody = req.getBody('user role')

  if (req.task.isOwner(userBody.user)) {
    throw new ReqError('You can not invite the owner')
  }

  const existingUser = req.task.participants.find(({ user }) => {
    return user.toString() === userBody.user
  })
  if (existingUser) {
    if (existingUser.active) {
      throw new ReqError('User already been added')
    }
    throw new ReqError('Invitation already sent')
  }

  req.task.participants.push(userBody)
  const { participants } = await req.task.save()
  res.json({ participants })
}

exports.removeUser = async (req, res) => {
  const participant = req.task.participants.find(({ user }) => {
    return user.toString() === req.params.userId
  })

  if (!participant) {
    throw new ReqError('Participant does not exists')
  }

  const { participants } = await req.task.save()
  res.json({ participants })
}

exports.changeRole = async (req, res) => {
  const roleBody = req.getBody('role')

  const participant = req.task.participants.find(participant => {
    if (participant.user.toString() === req.params.userId) {
      participant.set(roleBody)
      return true
    }
  })

  if (!participant) {
    throw new ReqError('Participant does not exists')
  }

  const { participants } = await req.task.save()
  res.json({ participants })
}

exports.acceptUser = async (req, res) => {}

const TaskSocketHandler = require('./task-socket-handler')
const User = require('../../model/user-model')
const jwtToken = require('../../utils/jwt-token')

module.exports = class TaskSocketListner extends TaskSocketHandler {
  static async checkAuth(socket) {
    const [token] = socket?.handshake?.auth?.authorization?.match(/\S*$/)
    const tokenInfo = jwtToken.verify(token)
    const user = await User.findById(tokenInfo.id)
    if (!user) throw new Error('Invalid User')
    return user
  }

  constructor(io, socket) {
    super(...arguments)

    socket.on(this.events.task.create, this.createTask)
  }
}

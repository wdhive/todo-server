const socketStore = require('../controller/socket-store')
const jwtToken = require('../utils/jwt-token')

module.exports = class TaskSocketClient {
  static async checkAuth(socket) {
    const user = await jwtToken.verifyUser(socket?.handshake?.auth?.token)
    return user
  }

  constructor(io, socket, user) {
    this.io = io
    this.socket = socket
    this.user = user
    this.roomId = user._id.toString()

    socket.leave(socket.rooms)
    socket.join(this.roomId)
    socket.on('disconnect', () => {
      socketStore.remove(this.roomId, socket.id)
    })

    socketStore.add(this)
  }
}

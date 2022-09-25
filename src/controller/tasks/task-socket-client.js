const errorHandler = require('../../core/error-handler')
const jSend = require('../../core/j-send')
const socketStore = require('../../core/socket-store')
const User = require('../../model/user-model')
const jwtToken = require('../../utils/jwt-token')

const events = {
  task: {
    read: 'task-read',
    create: 'task-create',
    delete: 'task-delete',
    update: 'task-update',
    complete: 'task-update-complete',
    unComplete: 'task-update-uncomplete',
  },
}

module.exports = class TaskSocketClient {
  static events = events
  events = events

  static async checkAuth(socket) {
    const [token] = socket?.handshake?.auth?.authorization?.match(/\S*$/)
    const tokenInfo = jwtToken.verify(token)
    const user = await User.findById(tokenInfo.id)
    if (!user) throw new Error('Invalid User')
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

    // Dev: console.log(`---> Connected with "${user.email}" in room "${user._id}"`)
    socketStore.add(this)
  }
}

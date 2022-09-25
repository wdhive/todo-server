const errorHandler = require('../../core/error-handler')
const jSend = require('../../core/j-send')
const socketStore = require('../../core/socket-store')

module.exports = class TaskSocketClient {
  events = {
    task: {
      read: 'task-read',
      create: 'task-create',
      delete: 'task-delete',
      update: 'task-update',
      complete: 'task-update-complete',
      unComplete: 'task-update-uncomplete',
    },
  }

  fail(err) {
    const [message, statusCode] = errorHandler(err)
    return {
      ...jSend.fail(statusCode < 500 ? 'fail' : 'error', message),
      statusCode,
    }
  }

  success(data) {
    return {
      ...jSend.success(data),
      statusCode,
    }
  }

  sendToRoom(event, data) {
    this.socket.to(this.roomId).emit(event, data)
  }

  constructor(chatIo, socket, user, roomId) {
    this.chatIo = chatIo
    this.socket = socket
    this.user = user
    this.roomId = roomId

    socket.leave(socket.rooms)
    socket.join(roomId)
    socket.on('disconnect', () => {
      socketStore.remove(roomId, socket.id)
    })

    console.log(
      `---> Connected with "${user.email}" from "${socket.handshake.address}"`
    )

    socketStore.add(this)
  }
}

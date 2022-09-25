const TaskSocketClient = require('./task-socket-client')

module.exports = class TaskSocketController extends TaskSocketClient {
  constructor() {
    super(...arguments)
  }

  createTask = async (task, respond) => {
    try {
      respond(this.success('Hello World'))
      this.socket.to(this.roomId).emit('event', { hello: 'world!' })
    } catch (err) {
      respond(this.fail(err))
    }
  }
}

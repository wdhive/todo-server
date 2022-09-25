const { Server } = require('socket.io')
const TaskSocketListner = require('./controller/tasks/task-socket-listner')

const io = new Server({
  cors: {
    origin: '*',
  },
})

io.on('connection', socket => socket.disconnect())

const chatIo = io.of('/v1/tasks-socket')
chatIo.on('connection', async socket => {
  try {
    const user = await TaskSocketListner.checkAuth(socket)
    new TaskSocketListner(chatIo, socket, user, user._id)
  } catch (err) {
    console.log(err)
    socket.disconnect(err)
  }
})

module.exports = io

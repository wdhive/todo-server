const { Server } = require('socket.io')
const TaskSocketClient = require('./controller/socket-client')
const socketStore = require('./controller/socket-store')

const io = new Server({
  cors: {
    origin: '*',
  },
})

io.on('connection', socket => socket.disconnect())

const taskIo = io.of('/v1/tasks-socket')
taskIo.on('connection', async socket => {
  try {
    const user = await TaskSocketClient.checkAuth(socket)
    new TaskSocketClient(taskIo, socket, user)
  } catch (err) {
    console.log(err)
    socket.disconnect(err)
  }
})

socketStore.initGlobalIo(io)
socketStore.initChatIo(taskIo)
module.exports = io

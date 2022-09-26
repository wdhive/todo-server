const { Server } = require('socket.io')
const TaskSocketClient = require('./controller/tasks/task-socket-client')
const socketStore = require('./socket/socket-store')

const io = new Server({
  cors: {
    origin: '*',
  },
})

io.on('connection', socket => socket.disconnect())

const chatIo = io.of('/v1/tasks-socket')
chatIo.on('connection', async socket => {
  try {
    const user = await TaskSocketClient.checkAuth(socket)
    new TaskSocketClient(chatIo, socket, user)
  } catch (err) {
    console.log(err)
    socket.disconnect(err)
  }
})

socketStore.initGlobalIo(io)
socketStore.initChatIo(chatIo)
module.exports = io

const { Server } = require('socket.io')
const TaskSocketClient = require('./controller/socket-client')
const socketStore = require('./controller/socket-store')

const io = new Server({
  cors: {
    origin: '*',
  },
})

io.on('connection', async (socket) => {
  try {
    const user = await TaskSocketClient.checkAuth(socket)
    new TaskSocketClient(io, socket, user)
  } catch (err) {
    socket.disconnect(err)
  }
})

socketStore.io = io
module.exports = io

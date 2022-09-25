const mongoose = require('mongoose')
const DevError = require('./dev-error')

class SocketStore {
  #chatIo
  #store = {}

  initChatIo(chatIo) {
    this.#chatIo = chatIo
  }

  add(client) {
    if (!this.#store[client.roomId]) this.#store[client.roomId] = {}
    this.#store[client.roomId][client.socket.id] = client

    // Dev: console.log(this.#store)
  }

  remove(roomId, socketId) {
    const room = this.#store[roomId]
    if (!room) return

    delete room[socketId]
    this.#cleanRoomIfEmpty(roomId)
  }

  disconnectExcept(roomId, exceptSocketId) {
    this.#exceptSocket(roomId, exceptSocketId, client => {
      client.socket.disconnect()
    })
  }

  disconnectExceptReq(req) {
    const userId = this.#idToString(req.user._id)
    const exceptSocketId = req.body.socketId
    this.disconnectExcept(userId, exceptSocketId)
  }

  disconnectReq(req) {
    const userId = this.#idToString(req.user._id)
    this.disconnectExcept(userId)
  }

  sendDataExceptReq(req, event, data) {
    const roomId = req.user._id
    const exceptSocketId = req.body.socketId
    this.sendDataExcept(roomId, exceptSocketId, event, data)
  }

  sendDataExcept(roomId, exceptSocketId, event, data) {
    if (!this.#chatIo) return
    roomId = this.#idToString(roomId)

    this.#exceptSocket(roomId, exceptSocketId, client => {
      client.socket.emit(event, data)
    })
  }

  sendDataToAll(roomId, event, data) {
    if (!this.#chatIo) return
    roomId = this.#idToString(roomId)

    this.#chatIo.to(roomId).emit(event, data)
  }

  #exceptSocket(roomId, exceptSocketId, cb) {
    const room = this.#store[roomId]
    if (!room) return
    for (let key in room) {
      if (key === exceptSocketId) continue
      cb(room[key])
    }
  }

  #idToString(id) {
    if (id instanceof Array) {
      return id.map(idUnit => this.#idToStringUnit(idUnit))
    }
    return this.#idToStringUnit(id)
  }

  #idToStringUnit(id) {
    if (id instanceof mongoose.Types.ObjectId) id = id.toString()
    if (typeof id !== 'string') {
      throw new DevError('Invalid id input at socket-store')
    }
    return id
  }

  #cleanRoomIfEmpty(roomId) {
    if (!this.#store[roomId]) return
    if (!Object.keys(this.#store[roomId]).length) {
      delete this.#store[roomId]
    }
  }
}

module.exports = new SocketStore()

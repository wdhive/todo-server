const mongoose = require('mongoose')
const DevError = require('../core/dev-error')

class SocketStore {
  #chatIo
  #globalIo
  #store = {}

  initGlobalIo(globalIo) {
    this.#globalIo = globalIo
  }
  initChatIo(chatIo) {
    this.#chatIo = chatIo
  }

  add(client) {
    if (!this.#store[client.roomId]) this.#store[client.roomId] = {}
    this.#store[client.roomId][client.socket.id] = client
  }

  remove(roomId, socketId) {
    const room = this.#store[roomId]
    if (!room) return

    delete room[socketId]
    this.#cleanRoomIfEmpty(roomId)
  }

  disconnect(roomOrReq, options = { rooms: [], exclude: '', cause: '' }) {
    const { rooms, excludeSocket } = this.#getRoomsAndExcludeSocket(
      roomOrReq,
      options
    )

    this.#exceptSocket(rooms, excludeSocket, client => {
      client.socket.disconnect(options.cause)
    })
  }

  send(roomOrReq, event, data, options = { rooms: [], exclude: '' }) {
    if (!(event && data)) {
      throw new DevError(
        "Must need 'room' & 'event' & 'data' to send data by socket"
      )
    }

    const { rooms, excludeSocket } = this.#getRoomsAndExcludeSocket(
      roomOrReq,
      options
    )
    this.#send(rooms, event, data, excludeSocket)
  }

  #cleanRoomIfEmpty(roomId) {
    if (!this.#store[roomId]) return
    if (!Object.keys(this.#store[roomId]).length) {
      delete this.#store[roomId]
    }
  }

  #send(rooms, event, data, excludeSocket) {
    this.#exceptSocket(rooms, excludeSocket, client => {
      client.socket.emit(event, data)
    })
  }

  #getRoomsAndExcludeSocket(roomOrReq, { exclude, rooms }) {
    const reqMode = roomOrReq?.constructor?.name === 'IncomingMessage'
    let newObj = {}

    if (rooms && !Array.isArray(rooms)) {
      throw new DevError('rooms inside option must be an array')
    }

    if (exclude != null && typeof exclude !== 'string') {
      throw new DevError('exclude inside option must be a string')
    }

    if (rooms) {
      newObj.rooms = rooms
    } else if (Array.isArray(roomOrReq)) {
      newObj.rooms = roomOrReq
    } else if (typeof roomOrReq === 'string') {
      newObj.rooms = [roomOrReq]
    } else if (reqMode) {
      newObj.rooms = [roomOrReq.user._id]
    }

    if (exclude != null) {
      newObj.excludeSocket = exclude
    } else if (reqMode) {
      newObj.excludeSocket = roomOrReq.headers['exclude-socket']
    }

    return {
      rooms: this.#generateRoomArray(newObj.rooms),
      excludeSocket: newObj.excludeSocket || false,
    }
  }

  #exceptSocket(rooms, excludeSocket, cb) {
    if (
      !(
        Array.isArray(rooms) &&
        (excludeSocket === false || typeof excludeSocket === 'string') &&
        cb instanceof Function
      )
    ) {
      throw new DevError('Invalid input in socket Store filter')
    }

    rooms.forEach(room => {
      const roomStore = this.#store[room]
      if (!roomStore) return

      for (let key in roomStore) {
        if (excludeSocket && excludeSocket === key) continue
        const socketClient = roomStore[key]
        cb(socketClient)
      }
    })
  }

  #generateRoomArray(rooms) {
    if (rooms instanceof Array) {
      return rooms.map(idUnit => this.#idToRoomStringElement(idUnit))
    }
    return [this.#idToRoomStringElement(rooms)]
  }

  #idToRoomStringElement(id) {
    if (id instanceof mongoose.Types.ObjectId) return id.toString()
    if (typeof id === 'string') return id
    throw new DevError('Invalid id input at socket-store')
  }
}

module.exports = new SocketStore()

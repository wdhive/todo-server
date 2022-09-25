class SocketStore {
  #store = {}

  add(client) {
    if (!this.#store[client.roomId]) this.#store[client.roomId] = {}
    this.#store[client.roomId][client.socket.id] = client

    console.log(this.#store)
  }

  remove(roomId, socketId) {
    const room = this.#store[roomId]
    if (!room) return

    delete room[socketId]
    this.#cleanRoomIfEmpty(roomId)
  }

  disconnectExcept(roomId, exceptSocketId) {
    const room = this.#store[roomId]
    if (!room) return

    for (let key in room) {
      if (key === exceptSocketId) continue

      const client = room[key]
      client.socket.disconnect()
    }
  }

  disconnectExceptFromReq(req) {
    const userId = req.user._id.toString()
    const exceptSocketId = req.body.socketid
    this.disconnectExcept(userId, exceptSocketId)
  }

  disconnectAllFromReq(req) {
    const userId = req.user._id.toString()
    this.disconnectExcept(userId)
  }

  #cleanRoomIfEmpty(roomId) {
    if (!this.#store[roomId]) return
    if (!Object.keys(this.#store[roomId]).length) {
      delete this.#store[roomId]
    }
  }
}

module.exports = new SocketStore()

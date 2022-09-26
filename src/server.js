const http = require('http')
const colors = require('colors/safe')
const app = require('./app')

const server = http.createServer(app)
server.listen(process.env.PORT, () => {
  const [connectedPort] = server._connectionKey.match(/\d+$/)
  console.log(
    colors.brightGreen('>>>', `App running on port "${connectedPort}"...`)
  )
})

module.exports = server

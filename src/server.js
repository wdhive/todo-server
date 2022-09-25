const http = require('http')
const mongoose = require('mongoose')
const colors = require('colors/safe')
const app = require('./app')

const server = http.createServer(app)
server.listen(process.env.PORT, () => {
  const [connectedPort] = server._connectionKey.match(/\d+$/)
  console.log(
    colors.brightGreen('>>>', `App running on port "${connectedPort}"...`)
  )
})

process.env.DB &&
  mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log(
        colors.brightGreen('>>>', 'MongoDB connected successfully...')
      )
    })
    .catch(() => {
      console.error(colors.brightRed('!!!', 'MongoDB connection failed...'))
    })

module.exports = server

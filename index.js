const colors = require('colors/safe')
console.log(
  colors.reset(
    '---',
    new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
      hour12: true,
    })
  )
)

if (process.argv.at(-1) === '--NODE_ENV=development') {
  console.clear()
  require('dotenv').config()
  process.env.NODE_ENV = 'development'
} else process.env.NODE_ENV ||= 'production'

process.env.PORT ||= 8000
require('./src/core')

const io = require('./src/socket')
const server = require('./src/server')
io.attach(server)

process.env.DB
  ? require('mongoose')
      .connect(process.env.DB)
      .then(() => {
        console.log(
          colors.brightGreen('>>>', 'MongoDB connected successfully...')
        )
      })
      .catch(() => {
        console.error(colors.brightRed('!!!', 'MongoDB connection failed...'))
      })
  : console.error(colors.brightRed('!!!', 'MongoDB env variable missing...'))

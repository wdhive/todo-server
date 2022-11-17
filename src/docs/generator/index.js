const block = require('./block')

module.exports = (title, method, endPoint, main = {}, note) => {
  const mainBlock = []

  if (!(title && method && endPoint && main)) {
    throw new Error('Invalid arguments :)')
  }

  if (main.headers) {
    mainBlock.push(block.headers(main.headers))
  }

  if (main.param) {
    mainBlock.push(block.param(main.param))
  }

  if (main.query) {
    mainBlock.push(block.query(main.query))
  }

  if (main.body) {
    mainBlock.push(block.body(main.body))
  }

  if (note) {
    mainBlock.push(block.note(note))
  }

  const endPointWithOrigin = endPoint.replace(
    '{{URL}}',
    'https://baby-todo.onrender.com/'
  )

  const markup = block.section(
    block.title(title),
    block.http(method.toUpperCase(), endPointWithOrigin),
    ...mainBlock
  )

  return markup
}

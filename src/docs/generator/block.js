const table = require('./table')

exports.category = title => {
  return `## ${title}`
}

exports.section = (...markup) => {
  return `\n${markup.join('\n\n')}\n\n`
}

exports.title = title => {
  return `### ${title}`
}

exports.http = (method, url) => {
  const prefix = '```http\n'
  const sufix = '\n```'
  return prefix + method + ' ' + url + sufix
}

const mainBodyFactory = name => data => {
  const header = table.header(name)
  const list = table.list(data)
  return header + list
}

exports.param = mainBodyFactory('Param')
exports.query = mainBodyFactory('Query')
exports.body = mainBodyFactory('Body')
exports.headers = mainBodyFactory('Headers')

exports.note = text => {
  return `📝***Note:*** ${text}`
}

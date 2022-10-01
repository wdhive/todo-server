exports.header = type => {
  return `|${type}|Type|Description|
| :-------- | :------- | :------- |\n`
}

exports.list = data => {
  const markup = []

  for (let key in data) {
    const input = data[key]
    const required = key.endsWith('$')
    if (required) key = key.slice(0, -1)

    let type = input
    let des

    if (Array.isArray(input)) {
      type = input[0]
      des = input[1]
    }

    if (type === String) type = 'string'
    else if (type === Number) type = 'number'
    else if (type === Boolean) type = 'boolean'
    else if (type === Array) type = 'array'
    else if (type === Date) type = 'date'

    const keyMd = `\`${key}\`${required ? '*' : ''}`.replaceAll('|', '\\|')
    const typeMd = `\`${type || 'unknown'}\``.replaceAll('|', '\\|')
    const desMd = (des || '...').replaceAll('|', '\\|')

    markup.push(`| ${keyMd} | ${typeMd} | ${desMd} |`)
  }

  return markup.join('\n')
}

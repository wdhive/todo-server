exports.header = type => {
  return `|${type}|Type|Description|
| :-------- | :------- | :------- |\n`
}

exports.list = data => {
  const markup = data.map(({ key, type, des, required }) => {
    if (type === String) type = 'string'
    else if (type === Number) type = 'number'
    else if (type === Boolean) type = 'boolean'
    else if (type === Array) type = 'array'
    else if (type === Object) type = 'object'

    const keyMd = `\`${key}\`${required ? '*' : ''}`
    const typeMd = `\`${type || 'unknown'}\``
    const desMd = `${des || '...'}`

    return `| ${keyMd} | ${typeMd} | ${desMd} |`
  })

  return markup.join('\n')
}

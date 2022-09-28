console.clear()
const fs = require('fs')
console.log('Compilation started...')

const rootDirPath = __dirname + '/src/docs/pages'
const outputDir = __dirname + '/docs'
const rootDir = fs.readdirSync(rootDirPath)
fs.existsSync(outputDir) && fs.rmSync(outputDir, { recursive: true })
fs.mkdirSync(outputDir)

rootDir.forEach(item => {
  const itemPath = rootDirPath + '/' + item
  if (!fs.lstatSync(itemPath).isFile()) return

  const { title, description, content } = require(itemPath)

  const metaContent = `# ${title}\n\n${description}`
  const apiContent = content.join('## \n')

  fs.writeFileSync(
    `${outputDir}/${item.replace('.js', '').toUpperCase()}.md`,
    metaContent + '\n\n# \n\n<br/>\n' + apiContent
  )
})

console.log('Compilation completed...')

console.clear()
const fs = require('fs')
const runCommand = command => {
  return new Promise(resolve => {
    require('child_process').exec(command, (err, stdout) => {
      resolve(stdout)
    })
  })
}

let fileCount = 0

;(async () => {
  const gitFiles = await runCommand('git ls-files')

  const files = gitFiles.split('\n').map(file => {
    return file.replace('\r', '')
  })

  const fileLineCount = files.map(file => {
    if (!file || file === 'yarn.lock') return 0
    fileCount++
    const filePath = __dirname + '/' + file
    const fileData = fs.readFileSync(filePath, 'utf-8')
    return fileData.split('\n').length
  })

  const lineCount = fileLineCount.reduce((acc, current) => {
    return acc + current
  }, 0)

  console.log('Total', lineCount, 'lines of code in', fileCount, 'files.')
})()

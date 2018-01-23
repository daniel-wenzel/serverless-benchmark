const { execSync } = require('child_process');
const fs = require('fs')

const filePath = 'pi.txt'
const pi = fs.readFileSync(filePath).toString()

const sizes = [25,50]

////////////////////// AWS //////////////////////////////

const options = { cwd: './aws'}
console.log('Create aws packages \n')

for (let i = 0; i < sizes.length; i++) {
  const size = sizes[i]
  console.log(`Creating ${size*2}mb pi file...`)
  let fileContent = ''
  for (let j = 0; j < size*2; j++) {
    fileContent += pi + '\n'
  }
  fs.writeFileSync(`files/pi${size*2}mb.txt`, fileContent)
}

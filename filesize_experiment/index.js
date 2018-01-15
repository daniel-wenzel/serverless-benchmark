const { execSync } = require('child_process');
const fs = require('fs')


// let stdout = execSync('dir');
// console.log(stdout.toString())

const filePath = 'pi.txt'
const pi = fs.readFileSync(filePath).toString()
 
const sizes = [1,5,10,25,50]

////////////////////// AWS //////////////////////////////

const options = { cwd: './aws'}
console.log('Create aws packages \n')

console.log('Making data directory')
fs.mkdirSync('./aws/data')
for (let i = 0; i < sizes.length; i++) {
  const size = sizes[i]
  console.log(`Creating ${size*2}mb pi file...`)
  let fileContent = ''
  for (let j = 0; j < size*2; j++) {
    fileContent += pi + '\n'
  }
  fs.writeFileSync(`./aws/data/pi${size*2}mb.txt`, fileContent)
  console.log('Starting serverless packaging...')
  execSync(`sls package --package ./packages/${size}mb`, options)
  console.log ('Cleaning data folder...')
  execSync('del data /s /q', options)
}

console.log('Delete data directory')
fs.rmdirSync('./aws/data')

console.log('Copying serverless.yml')
fs.copyFileSync('./aws/serverless.yml', './aws/packages/serverless.yml')

console.log('Done \n')

////////////////////// GCF //////////////////////////////

options.cwd = './gcf'
console.log('Create gcf packages \n')

console.log('Making data directory')
fs.mkdirSync('./gcf/data')

for (let i = 0; i < sizes.length; i++) {
  const size = sizes[i]
  console.log(`Creating ${size*2}mb pi file...`)
  let fileContent = ''
  for (let j = 0; j < size*2; j++) {
    fileContent += pi + '\n'
  }
  fs.writeFileSync(`./gcf/data/pi${size*2}mb.txt`, fileContent)
  console.log('Starting serverless packaging...')
  execSync(`sls package`, options)
  // console.log('Copy package to own directory')
  execSync(`xcopy .serverless packages\\${size}mb\\`, options)

  console.log ('Cleaning data folder...')
  execSync('del data /s /q', options)
}

console.log('Delete data directory')
fs.rmdirSync('./gcf/data')

console.log('Done \n')
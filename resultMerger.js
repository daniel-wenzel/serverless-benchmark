const fs = require("fs")
const dir = "logs/constant_load"

var wstream = fs.createWriteStream(dir+".csv");

let firstFile = true;
(async () =>  {
  const files = fs.readdirSync(dir)

  for (let i=0; i<files.length; i++) {
    console.log("parse", files[i])
    await parseFile(dir+"/"+files[i])
  }
})()

function parseFile(file, cb) {
  return new Promise((res, rej) => {
    fs.readFile(file, 'utf8', function(err, contents) {
      console.log(contents.indexOf('\n'));
      if (firstFile) {
        firstFile = false;
      }
      else {
        contents = contents.substring(contents.indexOf('\n'))
      }
      wstream.write(contents)
      res()
    });
  })

}

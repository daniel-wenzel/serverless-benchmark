const http = require('http');
const rp = require('request-promise');
const csv = require("fast-csv");
const fs = require("fs")
const csvStream = csv.createWriteStream({headers: true});
const writableStream = fs.createWriteStream(`logs/run_${new Date().getTime()}.csv`);

let server
csvStream.pipe(writableStream);

const NUM_PARALLEL_REQUESTS = 5
const TOTAL_NUM_OF_REQUESTS = 1
const endpoint = "https://xjz3j1h8gg.execute-api.us-east-1.amazonaws.com/dev/hello-world"

const experimentStartTime = new Date().getTime()
createServer()
runExperiment().then(_ => {
  server.close()
  writableStream.close()
})

async function runExperiment() {
  for (let i=0; i<TOTAL_NUM_OF_REQUESTS / NUM_PARALLEL_REQUESTS; i++) {
    let requests = []
    for (let j=0; j<NUM_PARALLEL_REQUESTS; j++) {
      requests.push(makeRequest())
    }
    await Promise.all(requests)
  }
}

async function makeRequest() {
  const sendTime = new Date().getTime()
  const answerString = await rp(endpoint)
  const returnTime = new Date().getTime()

  const answer = JSON.parse(answerString)

  answer.sendTime = sendTime
  answer.returnTime = returnTime

  answer.relativeSendTime = sendTime - experimentStartTime
  answer.responseLatency = returnTime - answer.executionEndTime
  answer.requestAndStartupLatency = answer.executionStartTime - sendTime
  answer.startupLatency = answer.requestAndStartupLatency - answer.responseLatency

  csvStream.write(answer);
}
function createServer() {
  //create a server object:
  server = http.createServer(function (req, res) {
    res.write(new Date().getTime() + ''); //write a response to the client
    res.end(); //end the response
  })
  server.listen(8080); //the server object listens on port 8080
}

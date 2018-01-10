const http = require('http');
const rp = require('request-promise');
const csv = require("fast-csv");
const fs = require("fs")
const csvStream = csv.createWriteStream({headers: true});

let server

let numOpenRequests = 0
let numDoneRequest = 0

const REQUESTS_PER_SECOND = 20
const EXPERIMENT_DURATION = 20 // in seconds
const COOLDOWN_TIME = 10000 //millis

const SYSTEMS = {
  "gcf" : "https://us-central1-serverless-benchmark.cloudfunctions.net/http",
  "lambda": "https://xmqh1pdak0.execute-api.us-east-1.amazonaws.com/dev/hello-world"
}

let systemUnderTest = "lambda";

const writableStream = fs.createWriteStream(`logs/combitest_${EXPERIMENT_DURATION}_${REQUESTS_PER_SECOND}_${new Date().getTime()}.csv`);
csvStream.pipe(writableStream);
const experimentStartTime = new Date().getTime()
console.log("starting experiment")

async function testAllSystems() {
  const systems = Object.keys(SYSTEMS)
  for (let i=0; i<systems.length; i++) {
    await benchmarkSystem(systems[i])
  }
  writableStream.close()
}
testAllSystems()

async function benchmarkSystem(system) {
  console.log("Testing system "+system)
  systemUnderTest = system
  interval = setInterval(logProgress, 1000)
  await runExperiment()
  clearInterval(interval)
  console.log("===== TEST_DONE =====")
  logProgress()
}


async function runExperiment() {
  const Planner = setInterval(planSecond, 1000, 0)
  return new Promise((res, rej) => {
    setTimeout(() => {
      clearInterval(Planner)
      console.log("==== COOLDOWN_TIME ====")
      setTimeout(res, COOLDOWN_TIME) //Delay for cooldown time in the end to make sure all requests finsihed
    }, (EXPERIMENT_DURATION-1)*1000)
  })
}
function planSecond() {
  for (let i=0; i<REQUESTS_PER_SECOND; i++) {

    let offset = Math.random() * 1000 //uniform distribution
    makeDelayedRequest(offset)
  }
}

function getEndpoint() {
  return SYSTEMS[systemUnderTest]
}

async function makeDelayedRequest(delay) {
  return new Promise((res, rej) => {

    setTimeout(async () => {
      await makeRequest()
      res()
    }, delay)
  })
}

async function makeRequest() {
  numOpenRequests ++
  const sendTime = new Date().getTime()
  const answerString = await rp(getEndpoint())
  const returnTime = new Date().getTime()
  numDoneRequest ++
  numOpenRequests --

  const answer = JSON.parse(answerString)

  answer.system = systemUnderTest
  answer["1_requestSent"] = sendTime
  answer["2_requestRead"] = answer.executionStartTime
  answer["3_responseSent"] = answer.executionEndTime
  answer["4_responseReceived"] = returnTime
  answer["RequestLatency_1-2"] = answer["2_requestRead"] - answer["1_requestSent"]
  answer["ProcessingLatency_2-3"] = answer["3_responseSent"] - answer["2_requestRead"]
  answer["ResponseLatency_3-4"] = answer["4_responseReceived"] - answer["3_responseSent"]
  answer["StartupLatency_clockDrifted"] = answer["RequestLatency_1-2"] - answer["ResponseLatency_3-4"]
  csvStream.write(answer);
}

function logProgress() {
  console.log(`${numDoneRequest} Requests Done, ${numOpenRequests} Requests Open`)
}

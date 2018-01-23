const http = require('http');
const rp = require('request-promise');
const csv = require("fast-csv");
const fs = require("fs")
const csvStream = csv.createWriteStream({headers: true});
const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'endpoint', alias: 'e', type: String },
  { name: 'system', alias: 's', type: String },
  { name: 'run_num', alias: 'n', type: Number },
  { name: 'workload', alias: 'w', type: String },
  { name: 'DRY_RUN', alias: 'd', type: Boolean },
  { name: 'PAYLOAD', alias: 'p', type: String},
  { name: 'log_path', alias: 'l', type: String}
]
var https = require('https');

const options = commandLineArgs(optionDefinitions)

if (!options.endpoint || !options.system|| !options.workload) {
  console.error("please provide an endpoint, a sut and a workload path")
  process.exit(1)
}
const DRY_RUN = options.DRY_RUN || false;
const REQUESTS_PER_SECOND = fs.readFileSync(options.workload).toString().split(/\s+/).map(c => +c)
const EXPERIMENT_DURATION = REQUESTS_PER_SECOND.length // in seconds
const COOLDOWN_TIME = 20000 //millis
const systemUnderTest = options.system;
let server

let numOpenRequests = 0
let numDoneRequest = 0

let experimentSecond = 0
let experimentStartTime = 0
let knownContainers = new Set()




const writableStream = fs.createWriteStream(generateName());
csvStream.pipe(writableStream);
console.log("starting experiment")

function generateName() {
  const workloadName = options.workload.split('/')[options.workload.split('/').length-1]
  const n = options.run_num? options.run_num+"_" : "";
  const p = options.PAYLOAD? options.PAYLOAD+"_" : "";
  const basePath = options.log_path? options.log_path : "logs"
  return `${basePath}/${workloadName}_${systemUnderTest}_${p}${n}${new Date().getTime()}.csv`
}
benchmarkSystem()
async function benchmarkSystem() {
  console.log("STARTING")
  interval = setInterval(logProgress, 1000)
  await runExperiment()
  clearInterval(interval)
  console.log("===== TEST_DONE =====")
  logProgress()


  writableStream.close()
}
writableStream.on('close', function () {
  console.log("stream closed!")
  process.exit()
 });

async function runExperiment() {
  experimentStartTime = Date.now()
  knownContainers = new Set()
  numOpenRequests = 0
  numDoneRequest = 0
  experimentSecond = 0
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
  const numRequests = REQUESTS_PER_SECOND[Math.min(experimentSecond, REQUESTS_PER_SECOND.length-1)]
  experimentSecond ++;
  for (let i=0; i<numRequests; i++) {

    let offset = Math.random() * 1000 //uniform distribution
    makeDelayedRequest(offset)
  }
}

function getEndpoint() {
  return options.endpoint
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
  if (DRY_RUN) {
    numOpenRequests ++
    numDoneRequest ++
    numOpenRequests --
    return
  }
  numOpenRequests ++
  const sendTime = new Date().getTime()
  const answerString = await rp(getEndpoint())
  const returnTime = new Date().getTime()
  numDoneRequest ++
  numOpenRequests --

  const answer = JSON.parse(answerString)

  answer.system = systemUnderTest
  answer["new_container"] = isNewContainer(answer.containerId)
  answer["n"] = options.run_num
  answer["payload"] = options.PAYLOAD
  answer["1_requeestSentExperimentTime"] = sendTime - experimentStartTime;
  answer["1_requestSent"] = sendTime
  answer["2_requestRead"] = answer.executionStartTime
  answer["3_responseSent"] = answer.executionEndTime
  answer["4_responseReceived"] = returnTime
  answer["RequestLatency_1-2"] = answer["2_requestRead"] - answer["1_requestSent"]
  answer["ProcessingLatency_2-3"] = answer["3_responseSent"] - answer["2_requestRead"]
  answer["ResponseLatency_3-4"] = answer["4_responseReceived"] - answer["3_responseSent"]
  answer["StartupLatency_clockDrifted"] = answer["RequestLatency_1-2"] - answer["ResponseLatency_3-4"]
  answer["RequestResponseLatency_1-4"] = answer["4_responseReceived"] - answer["1_requestSent"]
  csvStream.write(answer);
}

function logProgress() {
  console.log(`${experimentSecond}/${EXPERIMENT_DURATION}: ${numDoneRequest} Requests Done, ${numOpenRequests} Requests Open`)
}

function isNewContainer(containerId) {
  if (knownContainers.has(containerId)) {
    return false
  }
  else {
    knownContainers.add(containerId)
    return true;
  }
}

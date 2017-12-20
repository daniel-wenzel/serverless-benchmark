'use strict';
const timeServer = "http://ec2-34-248-76-50.eu-west-1.compute.amazonaws.com:8080/"
const http = require("http")
const containerId = Math.floor(Math.random() * 10000000)
let data = [];
module.exports.helloWorld = (event, context, callback) => {
  const executionStartTime = new Date().getTime()
  /*if (data.length == 0) {
    let l=10
    while(l--) {

     data.push(generate_random_data(1024*1024))
    }
  }*/
  getTimeOffsetFromTimeServer((err, offset, oneWayLatency) => {
    if (err) {
      callback(err, null)
    }
    else {
      const executionEndTime = new Date().getTime()
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify({
          executionStartTime,
          executionEndTime,
          containerId,
          oneWayLatency,
          offset
        }),
      };

      callback(null, response);
    }
  })



};

function getTimeOffsetFromTimeServer(cb) {
  const sendTime = new Date().getTime()
  http.get(timeServer, (res) => {
    res.setEncoding('utf8');
     let rawData = '';
     res.on('data', (chunk) => { rawData += chunk; });
     res.on('end', () => {
       const answerTime = new Date().getTime()
       const serverTime = +rawData.toString()
       const oneWayLatency = (answerTime - sendTime ) / 2
       const timeAfterOneMessageWasSent = sendTime + oneWayLatency
       const timeOffset = serverTime - timeAfterOneMessageWasSent
       cb(null, timeOffset, oneWayLatency)
     });
     res.on('error', (e) => {
       cb(e.message)
     })
  })
}
function generate_random_data(size){
    var chars = 'abcdefghijklmnopqrstuvwxyz'.split('');
    var len = chars.length;
    var random_data = [];

    while (size--) {
        random_data.push(chars[Math.random()*len | 0]);
    }

    return random_data.join('');
}

'use strict';
const http = require("http")
const containerId = Math.floor(Math.random() * 10000000)
let data = [];
module.exports.helloWorld = (event, context, callback) => {
  const executionStartTime = new Date().getTime()
  //Do stuff here
  setTimeout(() => {
    const executionEndTime = new Date().getTime()
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify({
        executionStartTime,
        executionEndTime,
        containerId
      }),
    };
    callback(null, response);
  }, 1000)
};

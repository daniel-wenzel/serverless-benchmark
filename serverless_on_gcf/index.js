'use strict';

const containerId = Math.floor(Math.random() * 10000000)
exports.http = (request, response) => {

  const executionStartTime = new Date().getTime()
  //Do stuff here
  setTimeout(() => {
    const executionEndTime = new Date().getTime()
    const responseMessage = JSON.stringify({
        executionStartTime: executionStartTime,
        executionEndTime: executionEndTime,
        containerId: containerId
      })
    response.status(200).send(responseMessage);
  }, 1000)

};

exports.event = (event, callback) => {
  callback();
};

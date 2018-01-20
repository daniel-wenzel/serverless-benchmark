const rnorm = require("randgen").rnorm

const LOAD_LENGTH = 60
const RAMPUP_LENGTH = 30
const MEAN_LOAD = 10
const STD_DEV_LOAD = 2

for (let i=0; i<RAMPUP_LENGTH; i++) {
  console.log(Math.floor(MEAN_LOAD * i / RAMPUP_LENGTH))
}
for (let i=0; i<LOAD_LENGTH; i++) {
  console.log(Math.floor(rnorm(MEAN_LOAD, STD_DEV_LOAD)))
}

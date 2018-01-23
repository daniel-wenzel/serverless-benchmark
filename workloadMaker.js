const rnorm = require("randgen").rnorm

function normalLoad() {
  const LOAD_LENGTH = 60
  const RAMPUP_LENGTH = 30
  const MEAN_LOAD = 10
  const STD_DEV_LOAD = 0

  for (let i=0; i<RAMPUP_LENGTH; i++) {
    console.log(Math.floor(MEAN_LOAD * i / RAMPUP_LENGTH))
  }
  for (let i=0; i<LOAD_LENGTH; i++) {
    console.log(Math.floor(rnorm(MEAN_LOAD, STD_DEV_LOAD)))
  }
}


normalLoad()
function makeSpikeLoad() {
  const RAMPUP_LENGTH = 30;
  const PRESPIKE_LENGTH = 30;
  const SPIKE_LENGTH = 15

  const PRESPIKE_LOAD = 10;
  const SPIKE_LOAD = 30;
  for (let i=0; i<RAMPUP_LENGTH; i++) {
    console.log(Math.floor(PRESPIKE_LOAD * i / RAMPUP_LENGTH))
  }
  for (let i=0; i<PRESPIKE_LENGTH; i++) {
    console.log(PRESPIKE_LOAD)
  }
  for (let i=0; i<SPIKE_LENGTH/2; i++) {
    console.log(PRESPIKE_LOAD + Math.floor((SPIKE_LOAD - PRESPIKE_LOAD)  * i / (SPIKE_LENGTH/2)))
  }
  for (let i=0; i<SPIKE_LENGTH/2; i++) {
    console.log(SPIKE_LOAD - Math.floor((SPIKE_LOAD - PRESPIKE_LOAD)  * i / (SPIKE_LENGTH/2)))
  }
  for (let i=0; i<PRESPIKE_LENGTH; i++) {
    console.log(PRESPIKE_LOAD)
  }

}

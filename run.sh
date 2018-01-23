
function deploy {
  cd $FOLDER
  rm pi*
  cp ../fileGenerator/files/$PAYLOAD_FILE .
  serverless deploy
  endpoint=$(serverless info | egrep -o "https://.*")
  cd ..
}

function remove {
  cd $FOLDER
  serverless remove
  cd ..
}
function run {
  cd benchmarkServer
  node index.js -e $endpoint -s $SYSTEM -w $WORKLOAD -n $n -p $PAYLOAD -l ../$LOGS_BASE_DIR/$EXPERIMENT_NAME
  cd ..
}

mkdir logs
mkdir fileGenerator/files
cd fileGenerator
node index.js
cd ..

LOGS_BASE_DIR=logs
EXPERIMENT_NAME=constant_load_final
WORKLOAD=../workloads/constant_10
SYSTEM=lambda
FOLDER=serverless_on_aws
PAYLOADS=( 50) #( 0, 50, 100)
NUM_RUNS=1
PAYLOAD_FILE=pi"$PAYLOAD"mb.txt

mkdir $LOGS_BASE_DIR/$EXPERIMENT_NAME
remove
for n in `seq 1 $NUM_RUNS`;
do
  for PAYLOAD in "${PAYLOADS[@]}"
  do
    echo "Running experiment $n $PAYLOAD"
    deploy
    run
    remove
  done
done

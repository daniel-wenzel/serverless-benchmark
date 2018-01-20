WORKLOAD=../workloads/normal_10
function deployAWS {
  cd serverless_on_aws
  serverless deploy
  endpoint=$(serverless info | egrep -o "https://.*")
  cd ..
}
function deployGCF {
  cd serverless_on_gcf
  serverless deploy
  endpoint=$(serverless info | egrep -o "https://.*")
  cd ..
}

function removeAll {
  cd serverless_on_aws
  serverless remove
  cd ..
  cd serverless_on_gcf
  serverless remove
  cd ..
}
removeAll
deployAWS
cd benchmarkServer
node index.js -e $endpoint -s lambda -w $WORKLOAD -n 1
cd ..
deployGCF
cd benchmarkServer
node index.js -e $endpoint -s gcf -w $WORKLOAD -n 1
cd ..
removeAll

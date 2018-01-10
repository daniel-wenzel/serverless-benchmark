# Serverless Benchmark

Starting a test:

1. Deploy serverless_on_aws and serverless_on_gcf. You will have to configure aws and gcf first (see for gcf: https://serverless.com/framework/docs/providers/google/guide/credentials/)
```
cd serverless_on_aws
sls deploy
cd ../serverless_on_gcf
sls deploy
```

2. Copy the endpoints and replace the default endpoints in benchmarkServer/index.js SYSTEMS
3. Adjust REQUESTS_PER_SECOND and EXPERIMENT_DURATION in index.js
3. Start a test
```
cd benchmarkServer
npm i
node index.js
```
4. Find your logs in benchmarkServer/logs

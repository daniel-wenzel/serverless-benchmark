# Serverless Benchmark

Starting a test:

1. Deploy serverless_on_aws and serverless_on_gcf, to see if they work on your system. You will have to configure aws and gcf first (see for gcf: https://serverless.com/framework/docs/providers/google/guide/credentials/)
```
cd serverless_on_aws
sls deploy
cd ../serverless_on_gcf
sls deploy
```

2. start `run.sh` to start an experiment, specify, a workload in the bashscript. A workload is a file that lists the number of requests per second in each line. An experiment is as long as the file has lines.
3. Find your logs in benchmarkServer/logs

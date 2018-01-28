# Serverless Benchmark

With this test framework, startup and deployment latency for the cloud providers Google Cloud Functions and AWS Lambda under usage of the Serverless framework can be tested.

Workload format: A workload file contains the number of requests to be send in second x in row x of the file. Sample files can be found in /workloads.

## Getting Started
0. Prerequists:
- Node
- NPM
- Serverless
1. Install dependencies:
``` bash
npm i -g serverless
cd benchmarkServer
npm i
cd ../fileGenerator
npm i 
cd ../serverless_on_gcf
npm i 
``` 
2. Adjust Google Cloud Functions configurations: Modify /serverless_on_gcf/serverless.yml:

``` yaml
provider:
  name: google
  runtime: nodejs
  project: { Name of your Project}
  # the path to the credentials file needs to be absolute
  credentials: { Path to your gcf credentials }
```

3. Test deploy GCF and AWS Lambda, to make sure they are correctly configured on your system.

```bash
cd ../serverless_on_gcf
sls deploy
sls remove
cd ../serverless_on_aws
sls deploy
sls remove
cd ..
```

## Starting a test:
1. Edit testing parameters in `run.sh`. A single run of run.sh only tests one cloud provider
``` 
LOGS_BASE_DIR={Path to logs}
EXPERIMENT_NAME={Name for log files}
WORKLOAD={Path to your workload file}
SYSTEM={gcf|aws}
FOLDER={serverless_on_gcf|serverless_on_aws}
PAYLOADS={Bash array of payloads to be tested, e.g. (0 50 100)}
NUM_RUNS={<int> number of repetitions for every payload}
```
2. Launch your test. We recommend running it on an instance in the same region as the system under test.
```
./run.sh
```

3. Find your logs in benchmarkServer/logs, for convenience compile them to a single file with the resultMerger script.

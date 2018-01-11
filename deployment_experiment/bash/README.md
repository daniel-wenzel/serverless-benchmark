The included scripts test and compare the deployment time of serverless powered 
endpoints on AWS and GCP.

To run this:
* make sure you have node, npm and serverless installed ([NodeJS](https://nodejs.org/en/), [NPM](https://www.npmjs.com/), ```npm install -g serverless```)
* make sure you have python >= 3.4 installed ([Python](https://www.python.org/))
* clone this project; in the cloned folder make sure you have read/write/create permissions; lets call this _PD_
* go to the ___PD_/deployment_experiment/bash/__ directory and install python requirements with ```pip install -r requirements.txt```
* create a google project and download the keyfile/credentials file (json format)
* create an AWS/login to your AWS account and create a access the access key and secret; save it to ___PD_/deployment_experiment/__. 
* Create a json file __aws_creds.json__ in the ___PD_/deployment_experiment/__ folder with the content:
```json
{
	"AWS_ACCESS_KEY_ID":"YOUR ACCESS KEY COMES HERE",
	"AWS_SECRET_ACCESS_KEY":"YOUR SECRET HERE"
}
```
* adjust the filenames in the ___PD_/deployment_experiment/bash/main.py__ file: lines 7 & 8.
* run the tests with ```python main.py```
* wait
* the results are stored in a CSV file in the corresponding results directory.

To plot the results:
 * coming soon
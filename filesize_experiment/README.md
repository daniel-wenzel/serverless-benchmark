## Different package size generator

Create packages:

```
node index.js (in filesize_experiment folder)
```

Deploy packages:

For AWS
1. Configure credentials
2. cd aws/packages
3. To deploy one of the packages run: sls deploy -p [package name]

For GCF
1. Configure credentials
2. Copy files from any of the folders in the packages folder to .serverless folder in gcf directory (example: copy files from 5mb folder to .serverless folder in gcf directory)
3. Run sls deploy in gcf directory
setwd("~/projects/github/serverlessbenchmark/benchmarkServer/analysis")
data <- read.csv2("../logs/combitest_120_1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20_1516039782943", sep=",")
options(scipen = 999) # don't print timestamps with exp function

# n = 2000

start <- data$executionStartTime
end <- data$executionEndTime
containers <- data$containerId
platform <- data$system
isNewCont <- data$new_container
# R doesn't like column headers starting with a number
names(data)[6] <- "requestSentExperimentTime"
time <- data$requestSentExperimentTime
names(data)[7] <- "requestSent"
reqSent <- data$requestSent
names(data)[8] <- "requestRead"
reqRead <- data$requestRead
names(data)[9] <- "responseSent"
respSent <- data$responseSent
names(data)[10] <- "responseReceived"
respReic <- data$responseReceived
reqLat <- data$RequestLatency_1.2
procLat <- data$ProcessingLatency_2.3
respLat <- data$ResponseLatency_3.4
startupLat <- data$StartupLatency_clockDrifted

sum(isNewCont == "true" & platform == "gcf")
# 75 new containers on gcf

sum(isNewCont == "false" & platform == "gcf")
# 925 reused containers on gcf

sum(isNewCont == "true" & platform == "lambda")
# 32 new containers on lambda

sum(isNewCont == "false" & platform == "lambda")
# 968 reused containers on lambda

# TODO: take 'time' as the main x axis measure, sort entire data set
print(time)
print(order(time)) # strange output

# starting new containers
# gcloud accross the entire test
# lambda only at the beginning

# TODO: time relative to experiment start)
plot(time, isNewCont, main = "Container Reuse", xlab = "unix time", ylab = "1=reuse, 2=new")

# Startup latency
plot(time, startupLat, main = "Startup Latency", xlab = "unix time", ylab = "elapsed time")

plot(time[platform == "gcf"], startupLat[platform == "gcf"],
     main = "Startup Latency GCF",
     xlab = "unix time",
     ylab = "elapsed time")

plot(start[platform == "lambda"], startupLat[platform == "lambda"],
     main = "Startup Latency Lambda",
     xlab = "unix time",
     ylab = "elapsed time") # nice

# Not very useful
plot(start[isNewCont == "false"], startupLat[isNewCont == "false"])
plot(start[isNewCont == "true"], startupLat[isNewCont == "true"])

# total execution time
plot(end - start, main = "Total Execution Time", xlab = "# requests sent", ylab = "elapsed time")

plot(end[platform == "gcf"] - start[platform == "gcf"],
     main = "Total Execution Time GCF",
     xlab = "# requests sent",
     ylab = "elapsed time")

plot(end[platform == "lambda"] - start[platform == "lambda"],
     main = "Total Execution Time Lambda",
     xlab = "# requests sent",
     ylab = "elapsed time")

# request latency
plot(reqLat, main = "Request Latency", xlab = "# requests sent", ylab = "elapsed time")
plot(reqLat[platform == "lambda"], main = "Request Latency Lambda", xlab = "# requests sent", ylab = "elapsed time")

# processing latency
plot(procLat,
     main = "Processing Latency",
     xlab = "# requests sent",
     ylab = "elapsed time") # outlier: processing took long

plot(procLat[platform == "lambda"],
     main = "Processing Latency Lambda",
     xlab = "# requests sent",
     ylab = "elapsed time") # boring

# response latency
plot(respLat, ylim=c(0, 250),
     main = "Response Latency",
     xlab = "# requests sent",
     ylab = "elapsed time") # nice, removed outliers















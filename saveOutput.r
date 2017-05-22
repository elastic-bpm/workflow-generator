library("rjson")
setwd("C:\\Users\\Johannes\\Projects\\elastic\\workflow-generator")

json_data <- fromJSON(file="output.json")

json_data[3][[1]]$delay

delays <- numeric()
for (i in json_data) {
  delays <- c(delays, i$delay / 1000)
}
print(delays)
stripchart(delays, xlab="Delay in seconds", pch="|")
abline(h=1)

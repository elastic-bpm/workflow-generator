library("rjson")
setwd("C:\\Users\\Johannes\\Projects\\elastic\\workflow-generator")

json_data <- fromJSON(file="50.json")
delays50 <- numeric()
for (i in json_data) {
  delays50 <- c(delays50, i$delay / 1000)
}

json_data <- fromJSON(file="100.json")
delays100 <- numeric()
for (i in json_data) {
  delays100 <- c(delays100, i$delay / 1000)
}

x <- list("50 wfs"=delays50, "100wfs"=delays100)
stripchart(x, xlab="Delay in seconds", pch="|", at=c(1.2,1.7))
abline(h=1.2)
abline(h=1.7)

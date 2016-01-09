# http://www.cmonetgallery.com/monet-paintings-list.aspx
# FOR MONET

setwd("~/projects/painterPalletes/")

library(jpeg)
library(jsonlite)
library(stringdist)

imageFiles <- list.files("images", full.names=TRUE)
dates <- read.csv("monetdates.csv")

getPalette <- function(painting, clusters) {

  img <- readJPEG(painting[["filename"]])
  
  imgRGB <- data.frame(
    R = as.vector(img[,,1]),
    G = as.vector(img[,,2]),
    B = as.vector(img[,,3])
  )
  
  palettes = list()
  
  for (cluster in clusters) {
    kMeans <- kmeans(imgRGB[, c("R", "G", "B")], centers = cluster)
    kTable <- rev(sort(table(kMeans$cluster)))
    kSorted <- kMeans$centers[names(kTable),]
    kColours <- rgb(kSorted) # sorted HEX colors
    
    kPercentages <- round(kTable/sum(kTable), 4) # sorted percent pixels in clusters
    
    # Use cumulative sum since
    kPerSum <- cumsum(c(0,kPercentages))
    kPerSum <- kPerSum[-length(kPerSum)]
    
    kdf <- data.frame(kColours, kPercentages, kPerSum)
    names(kdf) <- c("color", "percent", "percentSum")
    
    palettes[[paste0("k",cluster)]] <- kdf
  }

  palettes[["filename"]] <- painting[["filename"]]
  palettes[["name"]] <- painting[["name"]]
  palettes[["date"]] <- painting[["date"]]
  
  return(palettes)
  
}

nameMatchDF <- data.frame(imageFiles)

nameMathDF$name <- lapply(nameMatchDF$imageFiles, function(x) stringdist(x,dates$name))

bestStringFit <- function(filename) {
  
  filename2 <- gsub("images/", "", filename)
  filename2 <- gsub("-small.jpg", "", filename2)
  filename2 <- gsub("-", " ", filename2)
  
  dists <- stringdist(filename2,dates$name)
  name <- as.character(dates$name[which.min(dists)])
  date <- as.character(dates$year[which.min(dists)])
  
  return(data.frame(
    filename=filename,
    name=name,
    date=date,
    score=min(dists)/nchar(name)))
}

# Create a dataframe with best match file names and scores for those file names
nameMatchDF <- do.call(rbind,lapply(imageFiles, bestStringFit))

nameMatchDFFiltered <- nameMatchDF[nameMatchDF$score < 0.5,]


palette <- apply(nameMatchDFFiltered, 1, getPalette, c(6,9,12))
names(palette) <- NULL

endJSON <- toJSON(palette, auto_unbox=TRUE)

write(endJSON, file="app/monet.json")

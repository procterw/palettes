# http://www.cmonetgallery.com/monet-paintings-list.aspx

setwd("~/projects/painterPalletes/")

library(jpeg)
library(jsonlite)

imageFiles <- list.files("images", full.names=TRUE)

getPalette <- function(file, clusters) {

  img <- readJPEG(file)
  
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

  palettes[["filename"]] <- file
  
  return(palettes)
  
}

palette <- lapply(imageFiles, getPalette, c(6,9,12))
endJSON <- toJSON(palette, auto_unbox=TRUE)

write(endJSON, file="palettes.json")

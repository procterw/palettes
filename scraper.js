var Scraper = require("image-scraper");

// combine these with an index to get a valid url
var urlStart = "http://www.claudemonetgallery.org/home-";
var urlEnd = "-96-1-3.html";

var urlIsValid = true;
var index = 1;



while (urlIsValid) {
  
  // concat url
  var url = urlStart + index + urlEnd;
  
  var scraper = new Scraper(url);
  scraper.saveTo = "~/projects/painterPalettes/images";
  
  console.log("Scraping " + url);
  
  scraper.scrape(function(image) {
     image.save();
  });
  
  index = index + 1;
  
  if (index > 19) urlIsValid = false;
  
}
"use strict"; 

////////////////////
// MAIN MODULE
////////////////////
(function() {
  
  var cellWidth = 186;
  var rectHeight = 60;
  var rectWidth = function() {
    return cellWidth / settings.nColors.replace("k", " ");
  };
  
  // Settings object
  var settings = {};
  
  settings.nColors = "k9";
  settings.nColorOptions = [
    {name: "six", val: "k6"},
    {name: "nine", val: "k9"},
    {name: "twelve", val: "k12"}
  ];
 
 // How to size rectangles?
 settings.sizeBy = "percentage";
 settings.sizeByOptions = [
   {name: "percentage", val: "percentage"},
   {name: "equal", val: "equal"}
 ];
  
  // Selection class and id names
  settings.selections = {
    wrapperID: "#palette-wrapper",
    cellClass: "palette-cell",
  };
  
  
  // Load palette dataset for Monet
  d3.json("palettes.json", function(data) {
     settings.paletteData = data;
     buildPaletteGrid(settings.paletteData, settings.nColors, settings.selections);
  });
  
  // FORMS
  bindRadio("#size-by", "sizeBy", "sizeByOptions");
  
  
  // data: a palette data object generated by kmeansPalette.R
  // colors: the number of colors in the palette
  // selections: id and class names
  function buildPaletteGrid(data, nColors, selections) {
    
    // select the wrapper
    var wrapper = d3.select(selections.wrapperID)
      .selectAll("div")
      .data(data);
      
    // enter
    wrapper
      .enter()
      .append("div")
    
    wrapper
      .append("canvas")
      .attr("width", cellWidth) // always 3 across
      .attr("height", rectHeight)
      .each(function(d) {
        makePaletteRect(d3.select(this).node(), d, nColors);
      });
      
    wrapper
      .attr("class", selections.cellClass)
      .append("label")
      .html(function(d) {
        return formatTitle(d.filename) + "<br>" + "1887";
      });
      
      
  }
  
  // Canvas: selection of a canvas element
  // d: single element of palette data object
  // nColors: how many colors to select
  function makePaletteRect(canvas, d, nColors) {

    var ctx = canvas.getContext("2d");
    
    var palette = d[nColors];
    var col, position, percent, percentSum;
    
    for (var i=0; i<palette.length; i++) {
      
      // Color of index
      col = palette[i].color;
      // percentage sizes
      percent = palette[i].percent;
      // cumulative percentages
      percentSum = palette[i].percentSum;
      // Position of index
      position = getPalettePosition(i, nColors, percent, percentSum);
      
      ctx.fillStyle = col;
      ctx.fillRect(position[0],position[1],position[2],position[3]);
      
    }
    
  }
  
  function getPalettePosition(i, nColors, percent, percentSum) {
    // IF NOT PERCENT
    // var x = i * rectWidth();
    // var y = 0;
    // IF PERCENT
    var x,y,width,height;
    
     y = 0;
      height = rectHeight;
      
    if (settings.sizeBy === "percentage") {
      x = cellWidth * percentSum;
      width = cellWidth * percent + 1;
    } else {
      width = rectWidth();
      x = width * i;
    }

    return [x, y, width, height];
  }
  
  function formatTitle(str) {
    return str.replace("small.jpg","").replace("images/","").replace(/-/g," ");
  }
  
  function cumsum(arr) {
    return arr.reduce(function(r, a) {
      r.push((r.length && r[r.length - 1] || 0) + a);
      return r;
    }, []);
  }
  
  
  
  // function bindRadio(selection, modelName, optionsName){
    
  //   var radio = d3.select(selection);
    
  //   var options = settings[optionsName];
    
  //   // 
  //   for (var i=0; i<options.length; i++) {
  //     radio.append("input")
  //       .attr("type", "radio")
  //       .attr("name", modelName)
  //       .attr("val", )
  //   }
    
    
  // }
  
  
})();
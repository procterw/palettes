"use strict"; 

var App = React.createClass({displayName: "App",

  // Initial state; load monet
  getInitialState: function() {
    return {
      painter: 'Monet',      // name of current painter
      url: 'palettes.json',  // link to data file
      nColors: 'k9',         // how many colors in a palette
      sizeBy: 'equal'   // should each color be the same or based on percent
    };
  },

  handlePainterChange: function() {

  },

  render: function() {
    return (React.createElement(PaletteWrapper, {url: this.state.url, 
            nColors: this.state.nColors, 
            sizeBy: this.state.sizeBy}));
  }

});


// The palette wrapper contains every palettes and painting.
// Its state reflects the current choice of 
var PaletteWrapper = React.createClass({displayName: "PaletteWrapper",

  getInitialState: function() {
    return {
      dataset: []
    }
  },

  componentDidMount: function() {
    $.getJSON(this.props.url, function(result) {
      if (this.isMounted()) {
        this.setState({
          dataset: result
        });
      }
    }.bind(this));
  },

  // Render a wrapper and iterate through the dateset
  render: function() {
    var nColors = this.props.nColors;
    var sizeBy = this.props.sizeBy;

    return (React.createElement("ul", {className: "painting-list"}, 
      this.state.dataset.map(function(d, i) {
          return React.createElement("li", {key: i, className: "painting"}, 
            React.createElement(Palette, {sizeBy: sizeBy, nColors: nColors, data: d}), 
            React.createElement("label", {className: "title"}, d.name), 
            React.createElement("label", {className: "date"}, d.date)
          );
        })
      ));
  }

});

var Palette = React.createClass({displayName: "Palette",

  getInitialState: function() {
    return {
      width: 200,
      height: 50
    }
  },

  componentDidMount: function () {
    // parent properties
    var nColors = this.props.nColors;
    var sizeBy = this.props.sizeBy;
    var data = this.props.data[nColors];
    // div wrapper selection
    var node = ReactDOM.findDOMNode(this).firstChild;
    var ctx = node.getContext('2d');

    var height = this.state.height;
    var totalWidth = this.state.width;

    data.forEach(function(d, i) {
      var x,width,barWidth;
      var y = 0;

      if (sizeBy === "percentage") {
        x = d.percentSum * totalWidth;
        width = d.percent[0] * totalWidth;
      } else {
        barWidth = totalWidth / (+nColors.replace("k",""))
        x = i * barWidth;
        width = barWidth;
      }

      ctx.fillStyle = d.color;
      ctx.fillRect(x,y,width,height);

    });

  },

  render: function() {

    // Return an empty div; we'll add the canvas to it
    // when the component mounts
    return (React.createElement("div", {className: "palette"}, 
              React.createElement("canvas", {height: this.state.height, width: this.state.width}
              )
            ));

  }

});

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('app')
);
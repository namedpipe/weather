window.App = Ember.Application.create();

var margin = {top: 25, right: 10, bottom: 5, left: 30};
var width = 660 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

var x = d3.time.scale().range([0, width])
var y = d3.scale.linear().range([height, 0]);
var xAxis = d3.svg.axis().scale(x).orient("top").ticks(6);
var yAxis = d3.svg.axis().scale(y).orient("left");
// var line = d3.svg.line()
//   .x(function(d) { return x(d.date); })
//   .y(function(d) { return y(d.temperature); })
//   .interpolate("bundle")
//   .tension(0.9);



var svg = d3.select('weather-graph').append("svg")
  .attr("preserveAspectRatio", "xMidYMin")
  .attr("viewBox", "0 0 660 500")
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var arrData = [
    ["2012-10-02",200],
    ["2012-10-09", 300], 
    ["2012-10-12", 150]];
     

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data = arrData.map(function(d) {
      return {
         date: parseDate(d[0]),
         close: d[1]
      };
      
  });

  console.log(data);


  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
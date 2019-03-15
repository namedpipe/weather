import React, {Component} from 'react';
import * as d3 from "d3";
import * as moment from "moment";

class WeatherGraph extends Component {
  componentDidMount() {
    this.drawWeatherGraph();
  }

  render(){
      return <div id={"#" + this.props.id}></div>
  }

  drawWeatherGraph() {
    var margin = {top: 25, right: 10, bottom: 5, left: 30};
    var width = 660 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    var parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S");
    var rawData = this.props.data;

    var x = d3.scaleTime().range([0, width])
    var y = d3.scaleLinear().range([height, 0]);
    var xAxis = d3.axisTop(x).ticks(6);
    var yAxis = d3.axisLeft(y);
    var line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.temperature); })
      .curve(d3.curveCardinal.tension(0.5));

    var svg = d3.select(".hero-unit").append("svg")
      .attr("preserveAspectRatio", "xMidYMin")
      .attr("viewBox", "0 0 660 500")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;
    var data = rawData.map(function(d) {
      return {
        date: parseDate(d[0]),
        temperature: d[1]
      };
    });
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.temperature; }));

    svg.append("g")
      .attr("class", "x grid")
      .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x).ticks(6).tickSize(-height));

    svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 7)
        .attr("dy", "0.71em")
        .attr("x", -30)
        .style("text-anchor", "end")
        .text("Temperature (F)");

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);


    var focus = svg.append("g")
          .attr("class", "focus")
          .style("display", "none");

    focus.append("circle")
        .attr("r", 4.5);

    focus.append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", 660)
        .attr("height", 500)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.date) + "," + y(d.temperature) + ")");
      focus.select("text").html(d.temperature + " - " + moment(d.date).calendar());
    }
  }
}

export default WeatherGraph;

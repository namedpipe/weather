'use strict';

var directivesModule = angular.module('weatherApp.directives', []);
var data;

directivesModule.directive('city', ['city', function(city) {
    return function(scope, elm, attrs) {
      elm.text(city);
    };
}]);

directivesModule.directive('weatherGraph', function () {
  var margin = {top: 25, right: 10, bottom: 5, left: 30};
  var width = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

  return {
    restrict: 'E',
    scope: {
      val: '='
    },
    link: function (scope, element, attrs) {
      var x = d3.time.scale().range([0, width])
      var y = d3.scale.linear().range([height, 0]);
      var xAxis = d3.svg.axis().scale(x).orient("top").ticks(6);
      var yAxis = d3.svg.axis().scale(y).orient("left");
      var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.temperature); })
        .interpolate("bundle")
        .tension(0.9);

      var svg = d3.select(element[0]).append("svg")
        .attr("preserveAspectRatio", "xMidYMin")
        .attr("viewBox", "0 0 660 500")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      scope.$watch('gotdata', function (newVal, oldVal) {
        if (!newVal) {
          return;
        }
        if (newVal == "false") {
          svg.attr("viewBox", "0 0 60 50");
        }
      });

      scope.$watch('val', function (newVal, oldVal) {
        svg.selectAll('*').remove();
        if (!newVal) {
          return;
        }
        var data = newVal.map(function(d) {
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
         .call(d3.svg.axis().scale(x).ticks(6).tickSize(-height));

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
      });
    }
  }
});
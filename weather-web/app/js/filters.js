'use strict';

/* Filters */

angular.module('weatherApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);

angular.module('weatherApp.filters').filter('fromNow', function() {
  return function(date) {
    return moment(date).fromNow();
  }
});
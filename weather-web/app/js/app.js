'use strict';


// Declare app level module which depends on filters, and services
var weatherApp = angular.module('weatherApp', ['ngRoute', 'weatherApp.filters', 'weatherApp.services', 'weatherApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: HomeController});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);


weatherApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('loadingInterceptor');

  var spinnerFunction = function spinnerFunction(data, headersGetter) {
    //$('#set-location').toggleClass('active');
    return data;
  };

  var sliderFunction = function sliderFunction(data, headersGetter) {
    $('#ex1').slider({
      formatter: function(value) {
        return 'Current value: ' + value;
      }
    });
    return data;
  };

  $httpProvider.defaults.transformRequest.push(spinnerFunction);
});

weatherApp.factory('loadingInterceptor', function ($q, $window) {
  return function (promise) {
    return promise.then(function (response) {
      //$('#set-location').toggleClass('active');
      return response;
    }, function (response) {
      //$('#set-location').toggleClass('active');
      return $q.reject(response);
    });
  };
});
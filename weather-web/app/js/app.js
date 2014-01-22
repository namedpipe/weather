'use strict';


// Declare app level module which depends on filters, and services
angular.module('weatherApp', ['weatherApp.filters', 'weatherApp.services', 'weatherApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: HomeController});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);

'use strict';

/* Controllers */


function MyCtrl1($scope, $http){
  var lat = '41.58';
  var lon = '-93.62';
	$http(
    {method: 'GET', 
    url: 'http://localhost:4567/' + lat + '/' + lon + '/forecast.json'}).
  success(function(data, status, headers, config) {
  	$scope.weatherData = data;
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
}
MyCtrl1.$inject = ['$scope', '$http'];


function MyCtrl2() {
}
MyCtrl2.$inject = [];

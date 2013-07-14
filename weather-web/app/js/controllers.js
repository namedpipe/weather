'use strict';

/* Controllers */


function MyCtrl1($scope, $http){
  var lat = '41.58';
  var lon = '-93.62';
	$http(
    {method: 'GET', 
    url: 'http://weather.namedpipe.net/' + lat + '/' + lon + '/forecast.json'}).
  success(function(data, status, headers, config) {
  	$scope.weatherData = data;
    var d = new Date();
    $scope.dataStatus = "Refreshed " + moment(d).fromNow();
    $scope.gotdata = "true";
  }).
  error(function(data, status, headers, config) {
    $scope.dataStatus = "Problem accessing the weather data";
    $scope.gotdata = "false";
  });
}
MyCtrl1.$inject = ['$scope', '$http'];

function MyCtrl2() {
}
MyCtrl2.$inject = [];

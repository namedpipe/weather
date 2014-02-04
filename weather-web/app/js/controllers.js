'use strict';

/* Controllers */

function HomeController($scope, $http, city, lat, lon, server){
	$http(
    {method: 'GET',
    url: server + '/' + lat + '/' + lon + '/forecast.json'}).
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

  $scope.formData = {};
  $scope.zip = /^\d\d\d\d\d$/;

  $scope.processForm = function() {
  $http({
        method  : 'GET',
        url     : server + '/' + $scope.formData.zip + '/city.json'
    })
        .error(function(data) {
        })
        .success(function(data) {
            console.log(data);
            city =  data.city;
            lat =  data.lat;
            lon = data.longitude;
        });
  };
};
HomeController.$inject = ['$scope', '$http', 'city', 'lat', 'lon', 'server'];


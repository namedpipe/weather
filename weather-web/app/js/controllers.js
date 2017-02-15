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

  // $scope.dataStatusFunction = function($scope, $interval) {
  //   var c=0;
  //   $scope.dataStatus="This DIV is refreshed "+c+" time.";
  //   $interval(function(){
  //     $scope.dataStatus="This DIV is refreshed "+c+" time.";
  //     c++;
  //   },1000);
  // };

  $scope.formData = {};
  $scope.zip = /^\d\d\d\d\d$/;
  $scope.cityName = city;

  $scope.processForm = function() {
  $http({
        method  : 'GET',
        url     : server + '/' + $scope.formData.zip + '/city.json'
    })
        .error(function(data) {
          $scope.dataStatus = "Problem accessing the weather data";
          $scope.gotdata = "false";
        })
        .success(function(data) {
          $("#selectcity").modal("hide");
          $scope.gotdata = "true";
            lat =  data.latitude;
            lon = data.longitude;
            var forecastURL = server + '/' + lat + '/' + lon + '/forecast.json';
            $scope.cityName = data.city;
              $http(
              {method: 'GET',
                url: forecastURL}).
                  success(function(data, status, headers, config) {
                    $scope.weatherData = data;
                    var d = new Date();
                    $scope.dataStatus = "Refreshed " + d;
                    $scope.gotdata = "true";
                  }).
                  error(function(data, status, headers, config) {
                    $scope.dataStatus = "Problem accessing the weather data";
                    $scope.gotdata = "false";
                  });

        });
  };
};
HomeController.$inject = ['$scope', '$http', 'city', 'lat', 'lon', 'server'];


'use strict';

/* Controllers */

function HomeController($scope, $http, $interval, city, lat, lon, server){
  var refreshDate = new Date();
	$http(
    {method: 'GET',
    url: server + '/' + lat + '/' + lon + '/forecast.json'}).
    then(
      function(data, status, headers, config) {
      	$scope.weatherData = data.data;
        $scope.dataStatus = "Refreshed " + moment(refreshDate).fromNow();
        $scope.gotdata = "true";
      }, 
      function(data, status, headers, config) {
        $scope.dataStatus = "Problem accessing the weather data";
        $scope.gotdata = "false";
      });

  $scope.dataStatusFunction = function() {
    var c=0;
    $scope.dataStatus = "Refreshed " + moment(refreshDate).fromNow();
    $interval(function(){
      $scope.dataStatus = "Refreshed " + moment(refreshDate).fromNow();
      c++;
    }, 10000);
  };

  $scope.dataStatusFunction();

  $scope.formData = {};
  $scope.zip = /^\d\d\d\d\d$/;
  $scope.cityName = city;

  $scope.processForm = function() {
  $http({
        method  : 'GET',
        url     : server + '/' + $scope.formData.zip + '/city.json'
    }).then(
        function(data) {
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

        },
        function(data) {
          $scope.dataStatus = "Problem accessing the weather data";
          $scope.gotdata = "false";
        }
      );
  };
};
HomeController.$inject = ['$scope', '$http', '$interval', 'city', 'lat', 'lon', 'server'];


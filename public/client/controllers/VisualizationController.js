/**
 * Created by win on 09.9.2017.
 */

var app = angular.module('app');
app.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/visualization', {
        controller: 'VisualizationController',
        templateUrl: '../views/statistics.html'
    });
}]);

app.controller('VisualizationController', ['$scope', '$http', function($scope, $http){

    $scope.visible = false;
    $scope.scrollToDiv = function(){
        $scope.visible = true;
        $('html, body').animate({
            scrollTop: $('#skopje').offset().top - 20
        }, 'fast');
        $scope.getStatistics();
    }

    $scope.getStatistics = function(){

        $http.get('/allMaps').then(function(response){
            var red = 0;
            var orange = 0;
            var green = 0;
            var brown = 0;
            var humidity = 0;
            var temp = 0;
            var noise = 0;
            var pm10 = 0;
            var pm25 = 0;
            var counter = 0;
            for(var i=0; i<response.data.length; i++){
                var map = response.data[i];
                if(map.humidity != null){
                    red += map.red;
                    orange += map.orange;
                    green += map.green;
                    brown += map.brown;
                    temp += map.temperature;
                    humidity += map.humidity;
                    noise += map.noise;
                    pm10 += map.pm10;
                    pm25 += map.pm25;
                    counter++;
                }
            }
            $scope.labels = ["Red", "Green", "orange", "brown"];
            $scope.data = [red/counter, green/counter, orange/counter, brown/counter];
            $scope.colors = ["#FF0000", "#00B420", "#FF9F00", "#C00000"];

            $scope.labelsSensor = ["Temperature", "Humidity", "Noise", "PM10", "PM25"];
            $scope.dataSensor = [temp/counter, humidity/counter, noise/counter, pm10/counter, pm25/counter];
            var lat = 41.99646;
            var meters = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, 15);
            var area = (red/counter)*meters;
            var car = 5.25;
            $scope.numberOfCars = parseInt(area/car);
        }, function(error){
            console.log(error);
        });
    }
}]);

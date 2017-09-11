var app = angular.module('app');
app.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/', {
        controller: 'HomeController',
        templateUrl: '../views/homeView.html'
    });
}])

app.controller('HomeController', ['$scope', 'mapService', '$http', '$q', '$timeout', function($scope, mapService, $http, $q, $timeout){
    //$scope.getTrafficLayer = mapService.getTrafficLayer("map");
    $scope.visible = false;
    $scope.statisticActive = false;
    $scope.numberOfCars = 0;
    $scope.showData = false;
    $scope.showGraphs = false;
    $scope.cities = [];
    $scope.city1  = null;
    $scope.city2  = null;
    $scope.searchText1= null;
    $scope.searchText2= null;
    $scope.showProgress = false;
    $scope.showProgressActive = false;
    $scope.map = {
        center: [34.04924594193164, -118.24104309082031]
    };

    $scope.getTrafficLayer = function(){
        console.log("Mapa");
        var lat = 34.2343;
        var lng = 21.2324;
        var selector = "mapa";
        mapService.getTrafficLayer(selector, lat, lng);
    }

    $scope.$watch('city1', function (newVal, oldVal) {
       if(newVal !== null && newVal !== undefined) {
           $scope.lat = newVal.lat;
           $scope.lng = newVal.lon;
           mapService.getTrafficLayer("map1", $scope.lat, $scope.lng);
       }
       if($scope.city1 !== null && $scope.city2 !== null)
           $scope.showData = true;
    });

    $scope.$watch('city2', function (newVal, oldVal) {
        if(newVal !== null && newVal !== undefined) {
            $scope.lat = newVal.lat;
            $scope.lng = newVal.lon;
            mapService.getTrafficLayer("map2", $scope.lat, $scope.lng);
        }
        if($scope.city1 !== null && $scope.city2 !== null)
            $scope.showData = true;
    });

    $scope.querySearch = function(query) {
        if(query.length >3){
            var deferred = $q.defer();
            $http.get('/cities', {params: {name: query}}).then(function(response){
                $timeout(function () { deferred.resolve( response.data ); }, Math.random() * 1000, false);
            },function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        }
        else return [];
    }

    $scope.getData = function(){
        $scope.showProgress = true;
      $http.get('/sensors').then(function(response){
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
          var promises = [];
          $scope.positions = [];
         for(var i=0; i<response.data.length; i++){
             var sensor = response.data[i];
             console.log("FOR");
             if(sensor.position != null && sensor.status == 'ACTIVE'){
                 var coors = sensor.position.split(',');
                 var lat = parseFloat(coors[0]);
                 var lng = parseFloat(coors[1]);
                 $scope.positions.push({
                    lat:lat,
                     lng:lng
                 });

                 var selector = "mapa";
                 $scope.map = {
                     center: [lat, lng]
                 };
                 var promise = $http.get('/sensorData', {params: {lat: lat, lng: lng, id: sensor.sensorId, i:i}}).then(function(response){

                     if(response.data.pm10 != null){
                         red += response.data.red;
                         orange += response.data.orange;
                         green += response.data.green;
                         brown += response.data.brown;
                         temp += response.data.temperature;
                         humidity += response.data.humidity;
                         noise += response.data.noise;
                         pm10 += response.data.pm10;
                         pm25 += response.data.pm25;
                         counter+= red;
                         counter+= orange;
                         counter+= green;
                         counter+= brown;

                     }


                 },function(error){
                    console.log(error);
                 });
                 promises.push(promise);
             }

         }
       $q.all(promises).then(function(){
           $scope.showData = true;
           $scope.showProgress = false;
           console.log(counter);
           red = red/counter * 100;
           green = green/counter * 100;
           orange = orange/counter * 100;
           brown = brown/counter * 100;
           red = Math.round( red * 10 ) / 10;
           orange = Math.round( orange * 10 ) / 10;
           green = Math.round( green * 10 ) / 10;
           brown = Math.round( brown * 10 ) / 10;
           counter = Math.round( counter * 10 ) / 10;

           $scope.labels = ["Red", "Green", "Orange", "Brown"];
           $scope.data = [red, green, orange, brown];
           $scope.colors = ["#FF0000", "#00B420", "#FF9F00", "#C00000"];

           $scope.labelsSensor = ["Temperature", "Humidity", "Noise", "PM10", "PM25"];
           $scope.dataSensor = [temp/counter, humidity/counter, noise/counter, pm10/counter, pm25/counter];
       })

      }, function(error){
          console.log(error);
      })
    };


    $scope.loadAll = function(city) {
        var deferred = $q.defer();

        return deferred.promise;
    }

    $scope.createFilterFor = function(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        };

    }
    $scope.scrollToDiv = function(){
        $('html, body').animate({
            scrollTop: $('#showData').offset().top - 20
        }, 'fast');
    }

    $scope.compareCities = function(){
        $scope.showProgress = true;
        $http.get('/citiesData', {params: {name1: $scope.city1.name, name2: $scope.city2.name}}).then(function(response){
            $scope.airCity1 = response.data.city1.data;
            $scope.airCity2 = response.data.city2.data;
            $http.get('/citiesMap', {params: {lat1: $scope.city1.lat, lng1: $scope.city1.lon, lat2: $scope.city2.lat, lng2: $scope.city2.lon}}).then(function(response){
                $scope.co2_1 = response.data.city1.cars * 0.120;
                $scope.co2_1 = Math.round( $scope.co2_1 * 10 ) / 10;
                $scope.co2_2 = response.data.city2.cars * 0.120;
                $scope.co2_2 = Math.round( $scope.co2_2 * 10 ) / 10;
                $scope.aqi1 = $scope.airCity1.aqi;
                $scope.aqi2 = $scope.airCity2.aqi;
                var aqi1Color;
                var aqi1 = $scope.aqi1;
                if(aqi1<51)
                    aqi1Color = '#00FF00';
                if(aqi1>50 && aqi1<101)
                    aqi1Color = '#ffff00';
                if(aqi1>100 && aqi1<151)
                    aqi1Color = '#ff7e00';
                if(aqi1>150 && aqi1<201)
                    aqi1Color = '#ff0000';
                if(aqi1>200 && aqi1<301)
                    aqi1Color = '#8f3f97';
                if(aqi1>300 && aqi1<501)
                    aqi1Color = '#7e0023';
                $scope.aqi1Color = aqi1Color;

                var aqi2Color;
                var aqi2 = $scope.aqi2;
                if(aqi2<51)
                    aqi2Color = '#00FF00';
                if(aqi2>50 && aqi2<101)
                    aqi2Color = '#ffff00';
                if(aqi2>100 && aqi2<151)
                    aqi2Color = '#ff7e00';
                if(aqi2>150 && aqi2<201)
                    aqi2Color = '#ff0000';
                if(aqi2>200 && aqi2<301)
                    aqi2Color = '#8f3f97';
                if(aqi2>300 && aqi2<501)
                    aqi2Color = '#7e0023';
                $scope.aqi2Color = aqi2Color;
                $scope.showGraphs = true;
                $scope.showProgress = false;
            },function(error){
                console.log(error);
            });

        },function(error){
            console.log(error);
        });
    }
    $scope.getStatistics = function(){
        $scope.showProgressActive = true;
        $http.get('/allMaps').then(function(response){
            $scope.showProgressActive = false;

            $scope.statisticActive = true;
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

            $scope.labels = ["Red", "Green", "Orange", "Brown"];
            $scope.dataStat = [red/counter, green/counter, orange/counter, brown/counter];
            $scope.colors = ["#FF0000", "#00B420", "#FF9F00", "#C00000"];

            $scope.labelsSensorStat = ["Temperature", "Humidity", "Noise", "PM10", "PM25"];
            $scope.dataSensorStat = [temp/counter, humidity/counter, noise/counter, pm10/counter, pm25/counter];
            var lat = 41.99646;
            var meters = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, 15);
            var area = (red/counter)*meters;
            var car = 5.25;
            $scope.numberOfCars = parseInt(area/car);
            $scope.CO2 = $scope.numberOfCars * 0.120;
            $scope.CO2 = Math.round( $scope.CO2 * 10 ) / 10;

            $scope.scrollToDiv();
        }, function(error){
            console.log(error);
        });
    }

}]);

var app = angular.module('app');
app.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/', {
        controller: 'HomeController',
        templateUrl: '../views/homeView.html'
    });
}])

app.controller('HomeController', ['$scope', 'mapService', '$http', '$q', '$timeout', function($scope, mapService, $http, $q, $timeout){
    //$scope.getTrafficLayer = mapService.getTrafficLayer("map");
    $scope.selectedTab =0;
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

    $scope.hiddenBrown = $scope.hiddenRed = $scope.hiddenOrange = $scope.hiddenGreen = false;
    $scope.isOpenBrown = $scope.isOpenRed = $scope.isOpenOrange = $scope.isOpenGreen = $scope.isOpenGreenGraph = $scope.isOpenRedGraph= false;
    $scope.hoverBrown = $scope.hoverRed = $scope.hoverOrange = $scope.hoverGreen = $scope.hoverRedGraph = $scope.hoverGreenGraph = false;

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
    $scope.$watch('isOpenBrown', function(isOpenBrown) {
        if (isOpenBrown) {
            $timeout(function() {
                $scope.tooltipVisible = $scope.isOpenBrown;
            }, 600);
        } else {
            $scope.tooltipVisible = $scope.isOpenBrown;
        }
    });
    $scope.$watch('isOpenRed', function(isOpenRed) {
        if (isOpenRed) {
            $timeout(function() {
                $scope.tooltipVisible = $scope.isOpenRed;
            }, 600);
        } else {
            $scope.tooltipVisible = $scope.isOpenRed;
        }
    });
    $scope.$watch('isOpenOrange', function(isOpenOrange) {
        if (isOpenOrange) {
            $timeout(function() {
                $scope.tooltipVisible = $scope.isOpenOrange;
            }, 600);
        } else {
            $scope.tooltipVisible = $scope.isOpenOrange;
        }
    });
    $scope.$watch('isOpenGreen', function(isOpenGreen) {
        if (isOpenGreen) {
            $timeout(function() {
                $scope.tooltipVisible = $scope.isOpenGreen;
            }, 600);
        } else {
            $scope.tooltipVisible = $scope.isOpenGreen;
        }
    });
    $scope.$watch('isOpenGreenGraph', function(isOpenGreenGraph) {
        if (isOpenGreenGraph) {
            $timeout(function() {
                $scope.tooltipVisible = $scope.isOpenGreenGraph;
            }, 600);
        } else {
            $scope.tooltipVisible = $scope.isOpenGreenGraph;
        }
    });
    $scope.$watch('isOpenRedGraph', function(isOpenRedGraph) {
        if (isOpenRedGraph) {
            $timeout(function() {
                $scope.tooltipVisible = $scope.isOpenRedGraph;
            }, 600);
        } else {
            $scope.tooltipVisible = $scope.isOpenRedGraph;
        }
    });
    $scope.$watch('city1', function (newVal, oldVal) {
       if(newVal !== null && newVal !== undefined) {
           $scope.lat = newVal.lat;
           $scope.lng = newVal.lon;
           mapService.getTrafficLayer("map1", $scope.lat, $scope.lng);
       }
       if($scope.city1 !== null && $scope.city2 !== null)
           $scope.showData = true;
    });
    $scope.$watch('selectedTab', function (newVal, oldVal) {
        if(newVal === 2){
            $scope.getStatistics();
        }
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
          var pixels = 0;
          var promises = [];
          $scope.positions = [];
          $scope.sensors = response.data;
         for(var i=0; i<response.data.length; i++){
             var sensor = response.data[i];
             if(sensor.position != null && sensor.status == 'ACTIVE'){
                 var coors = sensor.position.split(',');
                 var lat = parseFloat(coors[0]);
                 var lng = parseFloat(coors[1]);
                 $scope.positions.push({
                    lat:lat,
                     lng:lng,
                     sensorId: sensor.sensorId
                 });

                 var selector = "mapa";
                 $scope.map = {
                     center: [lat, lng]
                 };
                 var promise = $http.get('/sensorData', {params: {lat: lat, lng: lng, id: sensor.sensorId, i:i}}).then(function(response){

                     if(response.data.pm10 != null && response.data.pm25){
                         red += response.data.red;
                         orange += response.data.orange;
                         green += response.data.green;
                         brown += response.data.brown;
                         temp += response.data.temperature;
                         humidity += response.data.humidity;
                         noise += response.data.noise;
                         pm10 += response.data.pm10;
                         pm25 += response.data.pm25;
                         counter++;
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
           pixels = red + green + orange + brown;
           red = red/pixels * 100;
           green = green/pixels * 100;
           orange = orange/pixels * 100;
           brown = brown/pixels * 100;
           red = Math.round( red * 10 ) / 10;
           orange = Math.round( orange * 10 ) / 10;
           green = Math.round( green * 10 ) / 10;
           brown = Math.round( brown * 10 ) / 10;


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
    $scope.showStatistics = function(){
        if( $scope.selectedTab === 2)
            $scope.scrollToDiv();
        else
            $scope.selectedTab = 2;
    }
    $scope.getStatistics = function(){
        $scope.showProgressActive = true;
        $http.get('/allMaps').then(function(response){
            $scope.showProgressActive = false;
            var redPm10 = 0;
            var orangePm10 = 0;
            var greenPm10 = 0;
            var brownPm10 = 0;

            var redPm25 = 0;
            var orangePm25 = 0;
            var greenPm25 = 0;
            var brownPm25 = 0;

            var counterPm10 = 0;
            var dataPixelsPm10 = [];
            var dataPm10 = [];

            var counterPm25 = 0;
            var dataPixelsPm25 = [];
            var dataPm25 = [];

            var labelsPm10 = [];
            var labelsPm25 = [];

            var carsRed = 0;
            var carCounter = 0;
            for(var i=0; i<response.data.pm10.length; i++){
                var data = response.data.pm10[i];
                if(data._id !== null){
                    var sum = data.red + data.orange + data.brown + data.green;
                    var red = Math.round( (data.red / sum) * 10 ) / 10 *100;
                    labelsPm10.push(data._id);
                    dataPixelsPm10.push(red);
                    dataPm10.push(data._id);
                    redPm10 += data.red;
                    orangePm10 += data.orange;
                    greenPm10 += data.green;
                    brownPm10 += data.brown;
                    counterPm10 += sum;
                }
            }

            for(var i=0; i<response.data.pm25.length; i++){
                var data = response.data.pm25[i];
                if(data._id !== null){
                    var sum = data.red + data.orange + data.brown + data.green;
                    var red = Math.round( (data.red / sum) * 10 ) / 10 *100;
                    labelsPm25.push(data._id);
                    dataPixelsPm25.push(red);
                    dataPm25.push(data._id);
                    redPm25 += data.red;
                    orangePm25 += data.orange;
                    greenPm25 += data.green;
                    brownPm25 += data.brown;
                    counterPm25 += sum;
                }
            }

            for(var i = 0; i<response.data.cars.length; i++){
                var data = response.data.cars[i];

                carsRed += data.avgRed;
                carCounter ++;
            }

            redPm10 = Math.round( (redPm10 / counterPm10) * 10 ) / 10 *100;
            orangePm10 = Math.round( (orangePm10 / counterPm10) * 10 ) / 10 *100;
            greenPm10 = Math.round( (greenPm10 / counterPm10) * 10 ) / 10 *100;
            brownPm10 = Math.round( (brownPm10 / counterPm10) * 10 ) / 10 *100;

            redPm25 = Math.round( (redPm25 / counterPm25) * 10 ) / 10 *100;
            orangePm25 = Math.round( (orangePm25 / counterPm25) * 10 ) / 10 *100;
            greenPm25 = Math.round( (greenPm25 / counterPm25) * 10 ) / 10 *100;
            brownPm25 = Math.round( (brownPm25 / counterPm25) * 10 ) / 10 *100;

            $scope.dataStat = [brownPm10, redPm10, orangePm10, greenPm10];
            $scope.labelsData = ["Brown(%)", "Red(%)", "Orange(%)", "Green(%)"];
            $scope.dataSensorPm10 = dataPm10;
            $scope.dataSensorPm25 = dataPm25;
            $scope.dataPm10 = [ dataPm10, dataPixelsPm10];
            $scope.dataPm25 = [ dataPm25, dataPixelsPm25];
            $scope.labelsPm10 = labelsPm10;
            $scope.labelsPm25 = labelsPm25;
            $scope.colors = ["#C00000","#FF0000","#FF9F00","#00B420",];
            $scope.colorsStat = ["#00B420", "#FF0000"];
            //$scope.labelsSensorStat = ["Temperature", "Humidity", "Noise", "PM10", "PM25"];
            //$scope.dataSensorStat = [[red/counter/100, green/counter/100, orange/counter/100, brown/counter/100],[temp/counter, humidity/counter, noise/counter, pm10/counter, pm25/counter]];
            var lat = 41.99646;
            var meters = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, 15);
            var area = (carsRed/carCounter)*meters;
            var car = 5.25;
            $scope.numberOfCars = parseInt(area/car);
            $scope.CO2 = $scope.numberOfCars * 0.120;
            $scope.CO2 = Math.round( $scope.CO2 * 10 ) / 10;

            $scope.scrollToDiv();
            $scope.showAqiMap();
        }, function(error){
            console.log(error);
        });
    }
    $scope.datasetOverridePm10 = [
        {
            label: "pm10 patricles",
            borderWidth: 1,
            type: 'bar'
        },
        {
            label: "High traffic density",
            borderWidth: 3,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            type: 'line'
        }
    ];
    $scope.datasetOverridePm25 = [
        {
            label: "pm2.5 patricles",
            borderWidth: 1,
            type: 'bar'
        },
        {
            label: "High traffic density",
            borderWidth: 3,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            type: 'line'
        }
    ];

    $scope.showAqiMap = function(){
        var  map  =  new  google.maps.Map(document.getElementById('AQIMap'),  {
            center:  new  google.maps.LatLng(51.505,  -0.09),
            mapTypeId:  google.maps.MapTypeId.ROADMAP,
            zoom:  11
        });

        var  t  =  new  Date().getTime();
        var  waqiMapOverlay  =  new  google.maps.ImageMapType({
            getTileUrl:  function(coord,  zoom)  {
                return  'https://tiles.waqi.info/tiles/usepa-aqi/'  +  zoom  +  "/"  +  coord.x  +  "/"  +  coord.y  +  ".png?token=_TOKEN_ID_";
            },
            name:  "Air  Quality",
        });

        map.overlayMapTypes.insertAt(0,waqiMapOverlay);
    }
}]);

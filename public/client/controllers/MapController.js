var app = angular.module('app');
app.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/', {
        controller: 'HomeController',
        templateUrl: '../views/homeView.html'
    });
}])

app.controller('HomeController', ['$scope', 'mapService', '$http', '$q', '$timeout', function($scope, mapService, $http, $q, $timeout){
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
    $scope.citiesZoom = 13;
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
           $scope.getFirstMap("map1", $scope.lat, $scope.lng, 13);
           $scope.scrollToMaps();
       }
       if($scope.city1 !== null && $scope.city2 !== null)
           $scope.showData = true;
    });


    $scope.$watch('selectedTab', function (newVal, oldVal) {
        if(newVal === 1){
            $scope.getStatistics();
        }
    });

    $scope.$watch('city2', function (newVal, oldVal) {
        if(newVal !== null && newVal !== undefined) {
            $scope.lat = newVal.lat;
            $scope.lng = newVal.lon;
            $scope.getSecondMap("map2", $scope.lat, $scope.lng, 13);
            $scope.getFirstMap("map1", 41.99646, 21.43141, 13);
            $scope.scrollToMaps();
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


    $scope.showSensors = function(){
        $http.get('sensors').then(function(response){
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

                }

            }

        }, function(error){
           console.log(error);
        });
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


           $scope.labels = ["Red(%)", "Green(%)", "Orange(%)", "Brown(%)"];
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
        });

    }
    $scope.scrollToMaps = function(){
        window.scrollTo(0,$('#showData').offset().top - 20);
    }

    $scope.compareCities = function(){
        $scope.showProgress = true;
        $scope.city1Name = "Skopje";
        $http.get('/citiesData', {params: {name1: $scope.city1Name, name2: $scope.city2.name.replace(/\s/g,'')}}).then(function(response){
            $scope.airCity1 = response.data.city1.data;
            $scope.airCity2 = response.data.city2.data;
            var co2City1;
            var co2City2;
            $http.get('/citiesMap', {params: {lat1:  41.99646, lng1: 21.43141, lat2: $scope.city2.lat, lng2: $scope.city2.lon, zoom: $scope.citiesZoom}}).then(function(response){
                $http.get('../resources/data/country-co2.json').then(function(success){
                    success.data.forEach(function (country) {
                        if(country.countryCode === "MK")
                            co2City1 = country.co2;
                        if(country.countryCode === $scope.city2.country)
                            co2City2 = country.co2;
                    })
                    if(co2City1 === undefined)
                        co2City1 = 0.133;
                    if(co2City2 === undefined)
                        co2City2 = 0.133
                    $scope.co2_1 = response.data.city1.cars * (co2City1/1000);
                    $scope.co2_1 = Math.round( $scope.co2_1 * 10 ) / 10;
                    $scope.co2_2 = response.data.city2.cars * (co2City2/1000);
                    $scope.co2_2 = Math.round( $scope.co2_2 * 10 ) / 10;
                    $scope.aqi1 = $scope.airCity1.aqi;
                    $scope.aqi2 = $scope.airCity2.aqi;

                    var brownCity1 = response.data.city1.brown;
                    var redCity1 = response.data.city1.red;
                    var orangeCity1 = response.data.city1.orange;
                    var greenCity1 = response.data.city1.green;
                    var counterCity1 = brownCity1+redCity1+orangeCity1+greenCity1;

                    redCity1 = Math.round( (brownCity1 / counterCity1) * 1000 ) / 10;
                    orangeCity1 = Math.round( (orangeCity1 / counterCity1) * 1000 ) / 10;
                    greenCity1 = Math.round( (greenCity1 / counterCity1) * 1000 ) / 10;
                    brownCity1 = Math.round( (brownCity1 / counterCity1) * 1000 ) / 10;

                    $scope.city1Colors = [brownCity1, redCity1, orangeCity1, greenCity1];
                    $scope.city1Labels = ["Brown(%)", "Red(%)", "Orange(%)", "Green(%)"];

                    var brownCity2 = response.data.city2.brown;
                    var redCity2 = response.data.city2.red;
                    var orangeCity2 = response.data.city2.orange;
                    var greenCity2 = response.data.city2.green;
                    var counterCity2 = brownCity2+redCity2+orangeCity2+greenCity2;

                    redCity2 = Math.round( (brownCity2 / counterCity2) * 1000 ) / 10;
                    orangeCity2 = Math.round( (orangeCity2 / counterCity2) * 1000 ) / 10;
                    greenCity2 = Math.round( (greenCity2 / counterCity2) * 1000 ) / 10;
                    brownCity2 = Math.round( (brownCity2 / counterCity2) * 1000 ) / 10;


                    $scope.city2Colors = [brownCity2, redCity2, orangeCity2, greenCity2];
                    $scope.city2Labels = ["Brown(%)", "Red(%)", "Orange(%)", "Green(%)"];

                    var metersCity1 = 156543.03392 * Math.cos(41.99646 * Math.PI / 180) / Math.pow(2, $scope.citiesZoom);
                    var metersCity2 = 156543.03392 * Math.cos($scope.city2.lat * Math.PI / 180) / Math.pow(2, $scope.citiesZoom);

                    //number of cars for each color: city1
                    $scope.orangeCarsCity1 = Math.floor((metersCity1*response.data.city1.orange)/15);
                    $scope.redCarsCity1 = Math.floor((metersCity1*response.data.city1.red)/10);
                    $scope.brownCarsCity1 = Math.floor((metersCity1*response.data.city1.brown)/5);



                    //number of cars for each color: city2
                    $scope.orangeCarsCity2 = Math.floor((metersCity2*response.data.city2.orange)/15);
                    $scope.redCarsCity2 = Math.floor((metersCity2*response.data.city2.red)/10);
                    $scope.brownCarsCity2 = Math.floor((metersCity2*response.data.city2.brown)/5);

                    $scope.cityCarsLabels = ['Cars orange', 'Cars red', 'Cars brown'];
                    $scope.city1CarsData = [$scope.orangeCarsCity1, $scope.redCarsCity1, $scope.brownCarsCity1];
                    $scope.city2CarsData = [$scope.orangeCarsCity2, $scope.redCarsCity2, $scope.brownCarsCity2];
                    $scope.carColors = ["#FF9F00","#FF0000","#C00000"];

                    $scope.colors = ["#C00000","#FF0000","#FF9F00","#00B420",];
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

                });
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

            $scope.showSensors();
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
            var listPM10 = [];
            var listRed = [];
            var listBrown = [];

            var listPM25 = [];
            var sumPm25 = 0;

            var sumPm10 = 0;
            var sumRed = 0;
            var sumBrown = 0;
            for(var i=0; i<response.data.pm10.length; i++){
                var data = response.data.pm10[i];
                listPM10.push(data._id);
                listRed.push(data.red);
                listBrown.push(data.brown);
                sumPm10+=data._id;
                sumRed+=data.red;
                sumBrown+=data.brown;

            }
            var minPm10 = Math.min.apply(Math, listPM10);
            var maxPm10 = Math.max.apply(Math, listPM10);


            var avgPm10 = sumPm10 / response.data.pm10.length;

            var minRed = Math.min.apply(Math, listRed);
            var maxRed = Math.max.apply(Math, listRed);
            var avgRed = sumRed / response.data.pm10.length;

            var minBrown = Math.min.apply(Math, listBrown);
            var maxBrown = Math.max.apply(Math, listBrown);

            var avgBrown = sumBrown / response.data.pm10.length;

            for(var i=0; i<response.data.pm10.length; i++){
                var data = response.data.pm10[i];
                if(data._id !== null){
                    var sum = data.red + data.orange + data.brown + data.green;
                    var red = Math.round( (data.red / sum) * 10 ) / 10 *100;
                    var brown = Math.round( (data.brown / sum) * 10 ) / 10 *100;
                    var normalizedPm10 = (data._id - minPm10) / (maxPm10 - minPm10);
                    var normalizedRed = (data.red - minRed) / (maxRed - minRed);
                    var normalizedBrown = (data.brown - minBrown) / (maxBrown - minBrown);
                    labelsPm10.push(data._id);
                    //dataPixelsPm10.push(red);
                    //dataPm10.push(data._id);

                    dataPixelsPm10.push(normalizedRed);
                    dataPm10.push(normalizedPm10);
                    redPm10 += data.red;
                    orangePm10 += data.orange;
                    greenPm10 += data.green;
                    brownPm10 += data.brown;
                    counterPm10 += sum;
                }
            }
            console.log("BROWN: "+brownPm10);


            for(var i=0; i<response.data.pm25.length; i++){
                var data = response.data.pm25[i];
                listPM25.push(data._id);
                listRed.push(data.red);
                listBrown.push(data.brown);
                sumPm25+=data._id;
                sumRed+=data.red;
                sumBrown+=data.brown;

            }
            var minPm25 = Math.min.apply(Math, listPM25);
            var maxPm25 = Math.max.apply(Math, listPM25);


            var avgPm25 = sumPm25 / response.data.pm25.length;

            var minRed = Math.min.apply(Math, listRed);
            var maxRed = Math.max.apply(Math, listRed);
            var avgRed = sumRed / response.data.pm25.length;

            var minBrown = Math.min.apply(Math, listBrown);
            var maxBrown = Math.max.apply(Math, listBrown);

            var avgBrown = sumBrown / response.data.pm10.length;
            for(var i=0; i<response.data.pm25.length; i++){
                var data = response.data.pm25[i];
                if(data._id !== null){
                    var sum = data.red + data.orange + data.brown + data.green;
                    var red = Math.round( (data.red / sum) * 10 ) / 10 *100;
                    var brown = Math.round( (data.brown / sum) * 10 ) / 10 *100;
                    var normalizedPm25 = (data._id - minPm25) / (maxPm25 - minPm25);
                    var normalizedRed = (data.red - minRed) / (maxRed - minRed);
                    var normalizedBrown = (data.brown - minBrown) / (maxBrown - minBrown);
                    labelsPm25.push(data._id);
                    //dataPixelsPm25.push(red);
                    //dataPm25.push(data._id);
                    dataPixelsPm25.push(normalizedRed);
                    dataPm25.push(normalizedPm25)
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

            redPm10 = Math.round( (redPm10 / counterPm10) * 1000 ) / 10;
            orangePm10 = Math.round( (orangePm10 / counterPm10) * 1000 ) / 10;
            greenPm10 = Math.round( (greenPm10 / counterPm10) * 1000 ) / 10;
            brownPm10 = Math.round( (brownPm10 / counterPm10) * 1000 ) / 10;

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
            var lat = 41.99646;
            var meters = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, 15);
            var area = (carsRed/carCounter)*meters;
            var car = 5.25;
            $scope.numberOfCars = parseInt(area/car);
            $scope.CO2 = $scope.numberOfCars * 0.133;
            $scope.CO2 = Math.round( $scope.CO2 * 10 ) / 10;

            $scope.mat = response.data.cor;
            for(var i = 0; i<$scope.mat.length; i++){
                for(var j = 0; j<$scope.mat[i].length; j++){

                    var elem = Math.round($scope.mat[i][j] * 100)/100;
                    $scope.mat[i][j] = {e: elem};

                }
            }
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
            center:  new  google.maps.LatLng(41.9973,  21.4280),
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

    $scope.getFirstMap = function(selector, lat, lng, zoom){
        $scope.city1Lat = lat;
        $scope.city1Lng = lng;
        if($scope.map2 != undefined){
            zoom = $scope.map2.getZoom();
        }
        var map = new google.maps.Map(document.getElementById(selector), {
            zoom: zoom,
            center: {lat: lat ? lat : 34.2343, lng: lng ? lng: 21.2324}
        });

        $scope.map1 = map;
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);

        google.maps.event.addListener($scope.map1, 'zoom_changed', function(){
            console.log("ZOOM CHANGED 1");
            var z = map.getZoom();
            $scope.citiesZoom = z;
            if($scope.map2 != undefined){
               // $scope.map2.setZoom(z);
                $scope.getSecondMap('map2', $scope.city2Lat, $scope.city2Lng, z);
            }

        });
    };

    $scope.getSecondMap = function(selector, lat, lng, zoom){
        $scope.city2Lat = lat;
        $scope.city2Lng = lng;
        if($scope.map1 != undefined){
            zoom = $scope.map1.getZoom();
        }
        var map = new google.maps.Map(document.getElementById(selector), {
            zoom: zoom,
            center: {lat: lat ? lat : 34.2343, lng: lng ? lng: 21.2324}
        });

        $scope.map2 = map;
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);

        google.maps.event.addListener($scope.map2, 'zoom_changed', function(){
            var z = map.getZoom();
            $scope.citiesZoom = z;
            if($scope.map1 != undefined){
                //$scope.map1.setZoom(z);
                $scope.getFirstMap('map1', $scope.city1Lat, $scope.city1Lng, z);
            }

        });
    };

}]);

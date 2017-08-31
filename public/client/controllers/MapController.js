var app = angular.module('app');
app.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/', {
        controller: 'HomeController',
        templateUrl: '../views/homeView.html'
    });
}])

app.controller('HomeController', ['$scope', 'mapService', '$http', '$q', '$timeout', function($scope, mapService, $http, $q, $timeout){
    //$scope.getTrafficLayer = mapService.getTrafficLayer("map");
    $scope.showData = false;
    $scope.showGraphs = false;
    $scope.cities = [];
    $scope.city1  = null;
    $scope.city2  = null;
    $scope.searchText1= null;
    $scope.searchText2= null;
    $scope.showProgress = false;

    $scope.getTrafficLayer = function(){
        mapService.getTrafficLayer("map");
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


}]);
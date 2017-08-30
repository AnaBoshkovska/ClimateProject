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
    $scope.cities = [];
    $scope.city1  = null;
    $scope.city2  = null;
    $scope.searchText1= null;
    $scope.searchText2= null;
    $scope.showProgress = false;

    $scope.getTrafficLayer = function(){
        mapService.getTrafficLayer("map1");
    }

    $scope.$watch('city1', function (newVal, oldVal) {
       if(newVal !== null && newVal !== undefined) {
           $scope.lat = newVal.lat;
           $scope.lng = newVal.lon;
           mapService.getTrafficLayer("map1", $scope.lat, $scope.lng);
       }
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


}]);
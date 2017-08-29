var app = angular.module('app');
app.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/', {
        controller: 'HomeController',
        templateUrl: '../views/homeView.html'
    });
}])

app.controller('HomeController', ['$scope', 'mapService', function($scope, mapService){
    $scope.getTrafficLayer = mapService.getTrafficLayer("map");
    $scope.showData = false;
    $scope.showProgress = false;
    $scope.getTrafficLayer = function(){
        trafficLayerService.getTrafficLayer("map");
    }

    $scope.scrollToDiv = function(){
        $('html, body').animate({
            scrollTop: $('#showData').offset().top - 20
        }, 'fast');
    }
}]);
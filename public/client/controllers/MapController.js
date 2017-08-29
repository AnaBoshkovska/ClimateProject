app.config(['$routeProvider',function($routeprovider){
    $routeprovider.when('/about', {
        controller: 'AboutController',
        templateUrl: 'components/views/aboutView.html'
    });
}]);

app.controller('homeController', ['$scope', 'mapService', function($scope, mapService){
    $scope.getTrafficLayer = mapService.getTrafficLayer("map");
}]);
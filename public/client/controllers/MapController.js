
app.controller('homeController', ['$scope', 'mapService', function($scope, mapService){
    $scope.getTrafficLayer = mapService.getTrafficLayer("map");
}]);
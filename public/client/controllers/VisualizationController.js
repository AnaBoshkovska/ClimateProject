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
    $scope.numberOfCars = 0;
    $scope.scrollToDiv = function(){
        $scope.visible = true;
        $('html, body').animate({
            scrollTop: $('#skopje').offset().top - 20
        }, 'fast');

    };




}]);

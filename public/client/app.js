var app = angular.module('app', ['ngRoute','ngMaterial','angular-svg-round-progressbar', 'chart.js', 'ngMap']);

app.config(function($routeProvider, $mdIconProvider) {

    // Declaration of the default route if neither of the controllers
    // is supporting the request path
    $routeProvider.when('/visualization', {
        controller: 'VisualizationController',
        templateUrl: '../views/statistics.html'
    }).
    otherwise({ redirectTo: '/'});
    $mdIconProvider.fontSet('md', 'material-icons');
});


var app = angular.module('app', ['ngRoute','ngMaterial','angular-svg-round-progressbar', 'chart.js', 'ngMap', 'ngCountup']);

app.config(function($routeProvider, $mdIconProvider) {

    // Declaration of the default route if neither of the controllers
    // is supporting the request path
    $routeProvider.when('/', {
        controller: 'HomeController',
        templateUrl: '../views/homeView.html'
    }).
    otherwise({ redirectTo: '/'});
    $mdIconProvider.fontSet('md', 'material-icons');
});


var app = angular.module('app', ['ngRoute','ngMaterial','angular-svg-round-progressbar', 'chart.js']);

app.config(function($routeProvider, $mdIconProvider) {

    // Declaration of the default route if neither of the controllers
    // is supporting the request path
    $routeProvider.otherwise({ redirectTo: '/'});
    $mdIconProvider.fontSet('md', 'material-icons');
});


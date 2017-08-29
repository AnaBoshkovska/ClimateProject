/**
 * Created by Ljubica on 29.8.2017.
 */
var express = require('express')();
var cities = require("all-the-cities");
var http = require('http');

exports.getCities = function(){
    return JSON.parse(cities);
}

exports.getCity = function(name){
    return cities.filter(city=> {
        return city.name.match(name);
    })
}
exports.getCityAir = function(name){
    return new Promise(function(success, error){
        var options = {
            host: 'api.waqi.info',
            path : '/feed/' + name + '/?token=7e83e3074271538088636df7d52a08181fe5351c',
            jar: false,
            method: 'GET',
        };
        var req = http.request(options, function(res) {

            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                success(JSON.parse(chunk));
            });
        });

        req.on('error', function(e) {
            error(e);
        });

        req.end();
    });
}
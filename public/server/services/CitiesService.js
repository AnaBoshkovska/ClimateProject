/**
 * Created by Ljubica on 29.8.2017.
 */
var express = require('express')();
var cities = require("all-the-cities");
var http = require('http');

exports.getCities = function(){
    return JSON.parse(cities);
};

exports.getCity = function(name){
    var regex="^" + name + "[A-Za-z]*";
    regex = new RegExp(regex);
    return cities.filter(city=> {
        return city.name.match(regex);
    })
};
exports.getCityAir = function(name1, name2){
    return new Promise(function(success, error){
        var options1 = {
            host: 'api.waqi.info',
            path : '/feed/' + name1 + '/?token=7e83e3074271538088636df7d52a08181fe5351c',
            jar: false,
            method: 'GET',
        };
        var options2 = {
            host: 'api.waqi.info',
            path : '/feed/' + name2 + '/?token=7e83e3074271538088636df7d52a08181fe5351c',
            jar: false,
            method: 'GET',
        };
        console.log(options2.path);
        var req = http.request(options1, function(res) {

            res.setEncoding('utf8');
            res.on('data', function (chunk1) {
                var req2 = http.request(options2, function(res2) {
                    res2.setEncoding('utf8');
                    res2.on('data', function (chunk2) {
                        var c1 = JSON.parse(chunk1);
                        var c2 = JSON.parse(chunk2);
                        success({"city1": c1, "city2": c2});
                    });
                });
                req2.on('error', function(e) {
                    error(e);
                });

                req2.end();
            });
        });

        req.on('error', function(e) {
            error(e);
        });

        req.end();
    });
};
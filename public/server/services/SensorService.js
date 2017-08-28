//var https = require('https');
var express = require('express')();
var https = require('follow-redirects').https;

exports.getSensors = function(){
    return new Promise(function(success, error){
        var options = {
            host: 'skopjepulse.mk',
            path : '/rest/sensor',
            jar: false,
            method: 'GET',
            headers:{
                'Authorization': 'Basic ' + new Buffer("Ana" + ':' + "climatechange").toString('base64')
            }
        };
        var req = https.request(options, function(res) {

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

};

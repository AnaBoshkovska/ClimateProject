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

exports.getSensorData = function(sensorId){
    return new Promise(function (success, error) {
        var now = new Date();
        now.setHours(now.getHours() - 1);
        var options = {
            host: 'skopjepulse.mk',
            path : '/rest/dataRaw?sensorId='+ sensorId + '&from=' + now.toISOString() + '&to=' + new Date().toISOString(),
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
    })

};
function airQuality(data) {
    var aq = {};
    data.forEach(function(record){
        if(aq[record.type] === undefined){
            aq[record.type] = {};
            aq[record.type].value = 0;
            aq[record.type].count = 0;
        }
        aq[record.type].value += parseInt(record.value);
        aq[record.type].count ++;
    });
    for(key in aq){
        aq[key].avg = aq[key].value / aq[key].count;
    }
    return aq;
}
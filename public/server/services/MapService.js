/**
 * Created by Ljubica on 28.8.2017.
 */

var express = require('express')();
var webshot = require('webshot');
var Jimp = require("jimp");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/climate');
var mapModel = require('../models/Map');
var Map = mapModel.Map;
var sensorService = require('./SensorService');


exports.getMap = function (lat, lng, sensorId, i) {
    return new Promise(function (success, error) {
        var options = {};
        var url = 'https://www.google.com/maps/@' + lat + ',' + lng + ',15z/data=!5m1!1e1?hl=en'
        console.log(url);
        var temperature = '';
        var humidity = '';
        var noise = '';
        var pm10 = '';
        var pm25 = '';
        sensorService.getSensorData(sensorId).then(function(res){

            for(var x=0; x<res.length; x++){
                var typeObj = res[x];
                var type = typeObj.type;
                var value = typeObj.value;
                if(type == 'temperature'){
                    temperature = value;
                }
                else if(type == 'humidity'){
                    humidity = value;
                }
                else if(type == 'noise'){
                    noise = value;
                }
                else if(type == 'pm10'){
                    pm10 = value;
                }
                else if(type == 'pm25'){
                    pm25 = value;
                }
            }

        }),function (error) {
            console.log(error);
        };
        webshot(url, 'google' + i + '.png', options, (err) => {
            if(err){
                console.log(err);
                return;
            }
            //console.log('BEFORE JIMP');
            Jimp.read('google' + i + '.png').then(function (image) {
                var green = 0;
                var red = 0;
                var orange = 0;
                var brown = 0;

                for (var i = 0; i < image.bitmap.width; i++) {
                    for (var j = 0; j < image.bitmap.height; j++) {
                        var hex = image.getPixelColor(i, j);
                        var rgba = Jimp.intToRGBA(hex);
                        if (rgba.r === 132 && rgba.g === 202 && rgba.b === 80)
                            green++;
                        if (rgba.r === 241 && rgba.g === 124 && rgba.b === 0)
                            orange++;
                        if (rgba.r === 230 && rgba.g === 0 && rgba.b === 0)
                            red++;
                        if (rgba.r === 158 && rgba.g === 19 && rgba.b === 19)
                            brown++;
                    }
                }
                var map = new Map({
                    red: red,
                    green: green,
                    orange: orange,
                    brown: brown,
                    sensor_id: sensorId,
                    temperature: temperature,
                    humidity: humidity,
                    noise: noise,
                    pm10: pm10,
                    pm25: pm25
                });
                map.save(function (err) {

                    if (err) error(err);
                    success("Map saves");

                });

            }).catch(function (err) {
                error(err);
            });
        });
    });

};

exports.calculatePixelToMeter = function(lat, zoom){
    return 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
}
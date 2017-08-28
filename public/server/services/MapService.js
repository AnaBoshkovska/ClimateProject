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


exports.getMap = function (lat, lng, sensorId) {
    return new Promise(function (success, error) {
        var options = {};
        var url = 'https://www.google.mk/maps/@' + lat + ',' + lng + ',15z/data=!5m1!1e1?hl=en';
        webshot(url, 'google.png', options, (err) => {
            console.log('BEFORE JIMP');
            Jimp.read("images/google.png").then(function (image) {
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
                    sensor_id: sensorId
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
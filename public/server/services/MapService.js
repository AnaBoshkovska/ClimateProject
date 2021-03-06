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
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var findRemove = require('find-remove');
var pcorr = require( 'compute-pcorr' );

exports.getMap = function (lat, lng, sensorId, i) {

    return new Promise(function (success, error) {
        var options = {};
        var url = 'https://www.google.com/maps/@' + lat + ',' + lng + ',15z/data=!5m1!1e1?hl=en';
        console.log(url);
        var temperature = '';
        var humidity = '';
        var noise = '';
        var pm10 = '';
        var pm25 = '';
        var counter = i;
        var uploadsDir  = __dirname+'/../../../images';
        fs.readdir(uploadsDir, function(err, files) {
            if(files !== undefined) {
                files.forEach(function (file, index) {
                    fs.stat(path.join(uploadsDir, file), function (err, stat) {
                        var endTime, now;
                        if (err) {
                            return console.error(err);
                        }
                        now = new Date().getTime();
                        endTime = new Date(stat.ctime).getTime() + 86400000;
                        if (now > endTime) {
                            return rimraf(path.join(uploadsDir, file), function (err) {
                                if (err) {
                                    return console.error(err);
                                }
                               // console.log('successfully deleted');
                            });
                        }
                    });
                });
            }
        });
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
        var hour = new Date().getHours();
        var minute = new Date().getMinutes();
        var time = hour;
        webshot(url, 'images/'+i+'google' + hour+'-'+minute+ '.png', options,function(err){
            if(err){
                console.log(err);
                return;
            }
                //console.log('BEFORE JIMP');
                var meters = exports.calculatePixelToMeter(lat, 15);
                Jimp.read('images/'+i+'google' + hour+'-'+minute+ '.png').then(function (image) {
                        var green = 0;
                        var red = 0;
                        var orange = 0;
                        var brown = 0;
                        for (var i = 0; i < image.bitmap.width; i++) {
                            for (var j = 0; j < image.bitmap.height; j++) {
                                var hex = image.getPixelColor(i, j);
                                var rgba = Jimp.intToRGBA(hex);
                                var dif = 0;
                                dif = Math.abs(rgba.r - 140) + Math.abs(rgba.g - 210) + Math.abs(rgba.b - 90);
                                if(dif<50){
                                    green ++;
                                   // console.log('Green');
                                    //console.log(rgba);
                                }
                                dif = Math.abs(rgba.r - 240) + Math.abs(rgba.g - 140) + Math.abs(rgba.b - 30);
                                if(dif<50){
                                    orange ++;
                                    //console.log('Orange');
                                    //console.log(rgba);
                                }
                                dif = Math.abs(rgba.r - 240) + Math.abs(rgba.g - 15) + Math.abs(rgba.b - 15);
                                if(dif<50){
                                    red ++;
                                   // console.log('Red');
                                    //console.log(rgba);
                                }
                                dif = Math.abs(rgba.r - 158) + Math.abs(rgba.g - 25) + Math.abs(rgba.b - 25);
                                if(dif<50){
                                    brown ++;
                                    //console.log('Brown');
                                    //console.log(rgba);
                                }

                            }
                        }
                        var area = red*meters;
                        var car = 5.25;
                        var numberOfCars = area/car;
                        // console.log("Number of cars: "+i+":"+numberOfCars);
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
                            pm25: pm25,
                            created_at: new Date()
                        });
                        //console.log("COUNTER: "+counter+": "+map);

                            success(map);

                }).catch(function (err) {
                    error(err);
                });
        });
    });

};
exports.calculatePixelToMeter = function(lat, zoom){
    return 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
};
exports.getPixels = function (lat, lng, zoom) {
    return new Promise(function (success, error) {
        var options = {};
        //var url = 'https://www.google.com/maps/@' + lat + ',' + lng + ',15z/data=!5m1!1e1?hl=en';
        var url = 'https://www.google.com/maps/@' + lat + ',' + lng + ','+zoom+'z/data=!5m1!1e1?hl=en';
        console.log(url);


        webshot(url, 'city.png', options, function(err) {
            if(err){
                reject(err);
            }
            var meters = exports.calculatePixelToMeter(lat, 15);
            Jimp.read('city.png').then(function (image) {
                var green = 0;
                var red = 0;
                var orange = 0;
                var brown = 0;

                for (var i = 0; i < image.bitmap.width; i++) {
                    for (var j = 0; j < image.bitmap.height; j++) {
                        var hex = image.getPixelColor(i, j);
                        var rgba = Jimp.intToRGBA(hex);
                        var r = rgba.r;
                        var g = rgba.g;
                        var b = rgba.b;

                        r /= 255;
                        g /= 255;
                        b /= 255;
                        var max = Math.max(r, g, b);
                        var min = Math.min(r, g, b);
                        var h = (max + min) / 2;
                        var s = (max + min) / 2;
                        var l = (max + min) / 2;

                        if(max == min){
                            h = s = 0; // achromatic
                        }else{
                            var d = max - min;
                            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                            switch(max){
                                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                                case g: h = (b - r) / d + 2; break;
                                case b: h = (r - g) / d + 4; break;
                            }
                            h /= 6;
                        }
                        h=Math.round(h*100);
                        s=Math.round(s*100);
                        l=Math.round(l*100);
                        if(h==0 && s>0){
                            var dif = Math.abs(rgba.r - 158) + Math.abs(rgba.g - 25) + Math.abs(rgba.b - 25);
                            if(dif<50){
                                brown ++;
                            }else{
                                red++;
                            }
                        }
                        else if(h==26){
                            green++;
                        }
                        else if(h==9){
                            orange++;
                        }

                    }
                }
                var area = red*meters;
                var car = 5.25;
                var numberOfCars = area/car;
                console.log("Number of cars: "+i+":"+numberOfCars);
                var map = new Map({
                    red: red,
                    green: green,
                    orange: orange,
                    brown: brown,
                    cars: numberOfCars
                });
                success(map);

            }).catch(function (err) {
                error(err);
            });
        });
    });

};

exports.getAllMaps = function(){
    return new Promise(function(success, error){
        Map.aggregate([
            {
                "$match": {
                    "created_at": { "$exists": true, "$ne": null }
                }
            },
            {
                $group: {
                    _id: '$pm10',
                    red: {$sum: '$red'},
                    green: {$sum: '$green'},
                    orange:{$sum: '$orange'},
                    brown:{$sum: '$brown'},
                    count:{$sum:1}
                }
            }
        ], function (err, result) {
            if (err) {
                console.log(err);
                error(err);
            } else {
                Map.aggregate([
                    {
                        "$match": {
                            "created_at": { "$exists": true, "$ne": null }
                        }
                    },
                    {
                        $group: {
                            _id: '$pm25',
                            red: {$sum: '$red'},
                            green: {$sum: '$green'},
                            orange: {$sum: '$orange'},
                            brown: {$sum: '$brown'},
                            count: {$sum: 1}
                        }
                    }
                ], function (err, result2) {
                    if (err) {
                        console.log(err);
                        error(err);
                    } else {
                        Map.aggregate([
                            {
                                "$match": {
                                    "created_at": { "$exists": true, "$ne": null }
                                }
                            },
                            {
                                $group: {
                                    _id: '$pm10',
                                    red: {$sum: '$red'},
                                    green: {$sum: '$green'},
                                    orange:{$sum: '$orange'},
                                    brown:{$sum: '$brown'},
                                    count:{$sum:1}
                                }
                            }
                        ], function (err, result) {
                            if (err) {
                                console.log(err);
                                error(err);
                            } else {
                                Map.aggregate([
                                    {
                                        "$match": {
                                            "created_at": { "$exists": true, "$ne": null }
                                        }
                                    },
                                    {
                                        $group: { _id: {year : { $year : "$created_at" },
                                            month : { $month : "$created_at" },
                                            day : { $dayOfMonth : "$created_at" },},
                                            avgRed: {'$avg': '$brown'} }
                                    }

                                ], function (err, result3) {
                                    if (err) {
                                        console.log(err);
                                        error(err);
                                    } else {
                                        Map.find({'created_at': {$not : { $type : 10 }, $exists : true}, 'pm10': {$not : { $type : 10 }, $exists : true}, 'pm25': {$not : { $type : 10 }, $exists : true}}).select('pm10 pm25 red brown').exec(function (err, result4) {
                                            if(err) error(err);
                                            var pm10 = [];
                                            var pm25 = [];
                                            var red = [];
                                            var brown = [];
                                            result4.forEach(function (item) {
                                                pm10.push(item.pm10);
                                                pm25.push(item.pm25);
                                                red.push(item.red);
                                                brown.push(item.brown);
                                            });

                                           // var mat = pcorr( pm10, pm10, red, pm25 );
                                            var mat = pcorr(pm10, pm25, red, brown);
                                            success({"pm10": result, "pm25": result2, 'cars': result3, 'cor': mat});
                                        });
                                    }
                                });
                            }
                        });

                    }
                });
            }

        });

    });
}
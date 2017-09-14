var express = require('express');
var app = express();
var sensorService = require('./public/server/services/SensorService');
var mapService = require('./public/server/services/MapService');
var citiesService = require('./public/server/services/CitiesService');
var dataService = require('./public/server/services/DataService');
var cron = require('cron');



app.use(express.static(__dirname + "/public/client"));

app.listen(3000);
console.log('Server started on port 3000');


// var sensors = sensor.getSensors();
// console.log(sensors);

var r = citiesService.getCity('a');
//console.log(r);


app.get('/cities', function(req, res, next){
    var city = req.query.name;
    console.log(city);
    var r = citiesService.getCity(city);
    res.json(r);
});
app.get('/citiesData', function(req, res, next){
    var city1 = req.query.name1;
    var city2 = req.query.name2;
    citiesService.getCityAir(city1, city2).then(function (success) {
        console.log(success);
        res.json(success);
    }, function(error){

    });
});
app.get('/citiesMap', function(req, res, next){
    var lat1 = req.query.lat1;
    var lng1 = req.query.lng1;
    var lat2 = req.query.lat2;
    var lng2 = req.query.lng2;
    var zoom = req.query.zoom;

    mapService.getPixels(lat1,lng1,zoom, 1).then(function(success1){
       mapService.getPixels(lat2, lng2,zoom, 2).then(function(success2){
           console.log(success2);
           res.json({city1: success1, city2: success2});
       }, function (error) {
           res.status(500);
           res.render('error', { error: error });
       });
    }, function(error){
        res.status(500);
        res.render('error', { error: error });
    }).catch(function(err){
        res.status(500);
        res.json({error: err });
    });
});

app.get('/sensors', function(req, res, next){
    sensorService.getSensors().then(function(success){
        res.json(success);
    }, function(error){
       res.render('error', {error: error});
    });
});

app.get('/sensorData', function(req, res, next){
    var lat = req.query.lat;
    var lng = req.query.lng;
    var id = req.query.id;
    var i = req.query.i;
    console.log(id);
    mapService.getMap(lat, lng, id, i).then(function (success) {
        //console.log(success);
        res.json(success);
    }, function (err) {
        res.render('error', {error: error});
    });
});

app.get('/allMaps', function(req, res, next){
    console.log("MAPS");
    mapService.getAllMaps().then(function(success){
        res.json(success)
    }, function(error){
       res.render('error', {error: error});
    });
});


/*

sensorService.getSensors().then(function (mes) {
    for(var i = 0; i<mes.length; i++){
        var sensor = mes[i];
        //console.log(sensor);
        if(sensor.position !== null && sensor.status == 'ACTIVE'){
            var coors = sensor.position.split(',');
            var lat = parseFloat(coors[0]).toFixed(4);
            var lng = parseFloat(coors[1]).toFixed(4);
            // console.log(lat + "," + lng);
            mapService.getMap(lat, lng, sensor.sensorId, i).then(function (success) {
                 //console.log(success);
            }, function (err) {
                console.log(err);
            });
        }
    }
}, function (error) {
    console.log(error);
});
*/





//dataService.getMapData();
/*
var cronJob = cron.job('0,15,30,45 * * * *', function(){
    console.log("Cron job completed");
    sensorService.getSensors().then(function (mes) {
        for(var i = 0; i<mes.length; i++){
            var sensor = mes[i];
            //console.log(sensor);
            if(sensor.position !== null && sensor.status == 'ACTIVE'){
                var coors = sensor.position.split(',');
                var lat = parseFloat(coors[0]).toFixed(4);
                var lng = parseFloat(coors[1]).toFixed(4);
                // console.log(lat + "," + lng);
                mapService.getMap(lat, lng, sensor.sensorId, i).then(function (success) {
                    //console.log(success);
                }, function (err) {
                    console.log(err);
                });
            }
        }
    }, function (error) {
        console.log(error);
    });

});
cronJob.start();*/

var express = require('express');
var app = express();
var sensorService = require('./public/server/services/SensorService');
var mapService = require('./public/server/services/MapService');

app.use(express.static(__dirname + "/public/client"));

app.listen(3000);
console.log('Server started on port 3000');


// var sensors = sensor.getSensors();
// console.log(sensors);









sensorService.getSensors().then(function (mes) {
    for(var i = 0; i<mes.length; i++){
        var sensor = mes[i];
        console.log(sensor);
        if(sensor.position !== null){
            var coors = sensor.position.split(',');
            mapService.getMap(coors[0], coors[1], sensor.sensorId).then(function (success) {
                console.log(success);
            }, function (err) {
                console.log(error);
            });
        }
    }
}, function (error) {
    console.log(error);
});


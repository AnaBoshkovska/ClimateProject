var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public/client"));
app.listen(3000);
console.log('Server started on port 3000');

var options = {

};

var webshot = require('webshot');
webshot('google.com', 'google.png', options, (err) => {
    // screenshot now saved to google.pnghttps://www.google.mk/maps/@42.0144456,21.3966958,13z/data=!5m1!1e1?hl=en
});


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/climate');


var mapModel = require('./public/server/models/Map');
var Map = mapModel.Map;


var map = new Map({
    red: 3,
    green: 2,
    orange: 18,
    brown: 30,
    sensor_id: 2
});

map.save(function(err){
   if(err) throw err;

    console.log("Map saved");
});

Map.find({}, function(err, maps){
    if(err) throw err;

    console.log(maps);
});


var sensorService = require('./public/server/services/SensorService');

sensorService.getSensors();

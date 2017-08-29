var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mapSchema = new Schema({
    red: Number,
    green: Number,
    orange: Number,
    brown: Number,
    sensor_id: String,
    temperature: Number,
    humidity: Number,
    noise: Number,
    pm10: Number,
    pm25: Number,
    created_at: Date
});

var Map = mongoose.model('Map', mapSchema);
exports.Map = Map;
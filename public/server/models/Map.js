var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mapSchema = new Schema({
    red: Number,
    green: Number,
    orange: Number,
    brown: Number,
    sensor_id: String,
    created_at: Date
});

var Map = mongoose.model('Map', mapSchema);
exports.Map = Map;
//var https = require('https');
var https = require('follow-redirects').https;


exports.getSensors = function(){
    var options = {
        host: 'skopjepulse.mk',
        path : '/rest/sensor',
        jar: false,
        headers:{
            'Authorization': 'Basic' + new Buffer("Ana" + ':' + "climatechange").toString('base64')
        }
    };
    var req = https.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();

};

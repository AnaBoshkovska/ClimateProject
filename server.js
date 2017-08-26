var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public"));
app.listen(3000);
console.log('Server started on port 3000');

var options = {
    phantomPath: "C:\\PhantomJs\\bin\\phantomjs\\bin\\phantomjs.exe",
    siteType: 'html'
};

var webshot = require('webshot');
webshot('google.com', 'google.png', options, (err) => {
    // screenshot now saved to google.png
});
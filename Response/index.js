var hostInfo = require('./InfoHost.js');

var express = require('express');
var app = express();

hostInfo(app);
app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.listen(3000, function() {
    console.log('Listen to port 3000!');
});

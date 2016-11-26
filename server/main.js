var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');

var app = express();

app.set('view engine', 'ejs');
var port = 3000;
app.use(bodyparser.json());
app.listen(port);
app.locals.baseurl = "http://localhost:" + port;
console.log('server is now running on port: ' + port);

app.use('/scripts', express.static(path.join(__dirname, '/../scripts')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,'../index.html'));
});
var express = require('express');
var bodyparser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');
var port = 3000;
app.use(bodyparser.json());
app.listen(port);
app.locals.baseurl = "http://localhost:" + port;
console.log('server is now running on port: ' + port);

app.get('/', function(req, res) {
    res.render('index');
});
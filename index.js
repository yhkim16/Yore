var express = require('express');
var nunjucks = require('nunjucks');
var app = express();

var port = 3000;
nunjucks.configure('.', {
    autoescape: true,
    express: app
});

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// node bootstrap 경로 지정 

app.use('/', express.static(__dirname + '/www')); // redirect root 
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS 
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery 
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap


app.get('/', function (req, res) {
    res.render('main.html');
});
app.get('/menu', function (req, res) {
    var menu = true;
    res.render('main.html',{menu});
});
app.get('/info', function (req, res) {
    var info = true;
    res.render('main.html',{info});
});

app.listen(port);



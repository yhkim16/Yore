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

app.listen(port);



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
app.use('/js', express.static(__dirname + '/node_modules/select2/dist/js')); // redirect select2 JS
app.use('/css', express.static(__dirname + '/node_modules/select2/dist/css')); // redirect select2 css

app.get('/', function (req, res) {
    res.render('main.html');
});
app.get('/menu', function (req, res) {// 메뉴 추천 
    var menu = true;
    res.render('main.html',{menu});
});
app.get('/info', function (req, res) { // 팀원 목록
    var info = true;
    res.render('main.html',{info});
});
const ingredients_list = require('./ingredients.json');

app.post('/ingredients', function(req,res) {//재료 목록 
    //console.log(ingredients_list);
    var results = {
        "results":[
            {
                "id":"",
                "text":""
            }
        ],
        "pagination":{
            "more":false
        }
    };
    ingredients_list.forEach(Element => results['results'].push({id: Element, text: Element}));
    //console.log(results);
    res.json(results);
});

app.post('/search', function(req,res) {//메뉴 검색 요청 응답 
    console.log(req.body);
    res.json('sucess!');
});


app.listen(port);



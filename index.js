var express = require('express');
var nunjucks = require('nunjucks');
var app = express();

const mysql = require('mysql');
const dbconfig = require('./database.js');
const connection = mysql.createConnection(dbconfig);

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
app.get('/add_menu', function(req, res) {// 메뉴 추가
    var add_menu = true;
    res.render('main.html',{add_menu});

});

const ingredients_list = require('./ingredients.json');
const foods_list = require('./foods.json');

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
    ingredients_list.forEach(Element => results['results'].push({id: Element, text: Element}));//재료 목록에 하나씩 추가
    //console.log(results);
    res.json(results);
});

app.post('/search', function(req,res) {//메뉴 검색 요청 응답 
    console.log(req.body);
    console.log('다른것도');
    
    var sql = 'SELECT * from menu WHERE difficulty<=?'
    var params = [Number(req.body['difficulty'])];

    connection.query(sql, params,(err,rows) => {
        var foo;
        if(err) console.log('select fail... ' + err);
        foo = rows;
         //console.log(foo);

        res.json(foo);
    });
 
    //res.json(foods_list);
 
});

app.post('/search_only', function(req,res) {//메뉴 검색 요청 응답 
    console.log(req.body);
    console.log('이것만');
    connection.query('SELECT * from menu ',(err,rows) => {
        var foo;
        if(err) console.log('select fail... ' + err);
        foo = rows;
         //console.log(foo);

        res.json(foo);
    });
 
    //res.json(foods_list);
 
});
app.post('/add_menu', function(req,res){// 메뉴 추가 요청 처리 
    console.log(req.body);

    var sql = 'INSERT INTO menu (name, tools, difficulty, youtube, recipe, ingredients) VALUES (?,?,?,?,?,?)';
    foods_list.forEach(Element => {
        var data = JSON.stringify(Element.ingredients);
        var params = [Element.name, Element.tools, Element.difficulty, Element.youtube, Element.recipe, data];
        //console.log(params);
        connection.query(sql,params,function(err){
            if(err) console.log('query fail.... '+ err);
        });
    }); 
    var add_menu = true;
    res.render('main.html',{add_menu});
});
app.listen(port);
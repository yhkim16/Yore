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

app.post('/all', function(req,res) {//메뉴 검색 요청 응답 
    console.log('전체');
    connection.query('SELECT * from menu ',(err,rows) => {
        var foo;
        if(err) console.log('select fail... ' + err);
        foo = rows;
         //console.log(foo);

        res.json(foo);
    });   
});

app.post('/search', function(req,res) {//메뉴 검색 요청 응답 
    console.log(req.body);
    console.log('다른것도');
    
    var sql = 'SELECT * from menu WHERE difficulty<=?';//난이도에 따른 쿼리
    var params = [Number(req.body['difficulty'])];//난이도
    var tools = 0;//조리도구 초기값
    var ingredients = req.body['ingredients'];//입력된 재료

    if(Array.isArray(req.body['tools'])) {//조리도구 여러개 받았을때
    
        [].forEach.call(req.body['tools'], Element => {
            tools += Number(Element);
        });
    }
    else if(req.body['tools'] == undefined){//조리도구가 입력되지 않았을 때
        tools = 0;
    }
    else {//조리도구가 하나만 입력 되었을때
        tools = req.body['tools'];
    }
    console.log(tools);
    connection.query(sql, params,(err,rows) => {//SELECT 실행 콜백
        var foo = [];

        if(err) {
            console.log('select fail... ' + err);
            return;
        }
 
         //console.log(rows);

        foo = rows.filter(Element => ((Element['tools']|tools) === 255)); //조리도구 조건 필터링
        foo = foo.filter(Element => {//재료조건 필터링
            var score = 0;
            [].forEach.call(JSON.parse(Element['ingredients']), element =>{
                //console.log(element);
                if(ingredients instanceof Array){                
                    [].forEach.call(ingredients, Element =>{                               
                        //console.log(Element);                
                        if(Element == element['ingredient']){                
                            score += element['weight'];                
                        }               
                    })            
                }
                else {
                    //console.log(ingredients);                
                    if(ingredients == element['ingredient']){   
                        score += element['weight'];                
                    } 
                }
            });
            if(score >= 80){//재료들 점수가 80점 이상이면 출력 
                return true;
            }
            else{
                return false;
            }
            
        })
        //console.log(foo);
        res.json(foo);
    });
 
    //res.json(foods_list);
 
});

app.post('/search_only', function(req,res) {//메뉴 검색 요청 응답 
    console.log(req.body);
    console.log('이것만');
    
    var sql = 'SELECT * from menu WHERE difficulty<=?';
    var params = [Number(req.body['difficulty'])];
    var tools = 0;
    var ingredients = req.body['ingredients'];

    if(Array.isArray(req.body['tools'])) {
    
        [].forEach.call(req.body['tools'], Element => {
            tools += Number(Element);
        });
    }
    else if(req.body['tools'] == undefined){
        tools = 0;
    }
    else {
        tools = req.body['tools'];
    }
    console.log(tools);
    connection.query(sql, params,(err,rows) => {
        var foo = [];

        if(err) {
            console.log('select fail... ' + err);
            return;
        }
 
         //console.log(rows);

        foo = rows.filter(Element => ((Element['tools']|tools) === 255)); 
        foo = foo.filter(Element => {
            var result = false;
            [].forEach.call(JSON.parse(Element['ingredients']), element =>{
                //console.log(element);
                if(ingredients instanceof Array){                
                    [].forEach.call(ingredients, Element =>{                               
                        //console.log(Element);      
                        //console.log(Element == element['ingredient']);
                        if(Element == element['ingredient']){                
                            result = true;
                            return;
                            
                        }
                        else if((Element != element['ingredient']) && element['weight'] != 0) {
                            result = false;
                        }
                    })            
                }
                else if((ingredients == element['ingredient']) && element['ingredient'].length == 1){  
                    //console.log(ingredients);
                    result = true;    
                    return;    
                }
            });
            return result;
        })
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
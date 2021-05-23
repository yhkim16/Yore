'use strict';

var path = require("path");
var fs = require("fs");
var csv = require("csv");

var foods = new Array();
readcsv();

function readcsv(filePath) {
    var data = fs.readFileSync('./foods.csv','utf8');
    
    csv.parse(data.toString(), function(err,data) {

        
        console.log(err);
        //console.log(data);

        //console.log(Array.isArray(data));
        data.forEach(function(Element){
            var food = {
                "name": { "type": "string" },
                "tools": { "type": "number" },
                "difficulty": { "type": "number" },
                "youtube": { "type": "string" },
                "recipe": { "type": "string" },
                "ingredients" : [/*{
                    "ingredient" : { "type": "string" },
                    "weight": { "type": "number" },
                }*/]
            };
            for(let i=0;Element[i]!="!EOL" && Element[i] != null;i++){
                switch(i){
                    case 0:
                        food.name = Element[i];
                        break;
                    case 1:
                        food.tools = Number(Element[i]);
                        break;
                    case 2:
                        food.difficulty = Number(Element[i]);
                        break;
                    case 3:
                        food.youtube = Element[i];
                        break;
                    case 4:
                        food.recipe = Element[i];
                        break;           
                    default:     
                    food.ingredients.push({ingredient : Element[i], weight : Number(Element[i+1])});
                    i++;
                    break;
                }
                
            }
            //console.log(food);
            foods.push(food);
            
        });
         
        //console.log(foods);
        //console.log(foods[0]);
        foods = JSON.stringify(foods);
        fs.writeFileSync('foods.json',foods);
    });

     

}

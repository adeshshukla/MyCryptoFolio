//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
const https = require("https");

// Body Parser Middleware
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

//CORS Middleware
app.use(function (req, res, next) {
	//Enabling CORS 
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
	next();
});

xlsx = require('xlsx');
var file = xlsx.readFile('./uploads/TradeHistory.xlsx');
//console.log(file);

function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
        var roa = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if(roa.length > 0){
            result[sheetName] = roa;
        }
    });
    //return result;
	console.log('// Json result')
	console.log(result);
}

to_json(file);
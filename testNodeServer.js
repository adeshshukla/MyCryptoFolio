//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");

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


const https = require("https");

const binanceApiUrl = 'https://api.binance.com';

	var url = binanceApiUrl + "/api/v3/ticker/price";

	console.log('----------------inside /api/binance/getCurrentPriceAllSymbols')
	https.get(url, response => {
		console.log('--------response----------')
		console.log( '  ' + response.statusCode)
		// response.on("error", err1=>{
		// 	console.log('--------network error-------')
		// 	console.log(err1);
		// });

		response.setEncoding("utf8");
		let body = "";
		response.on("data", data => {
			body += data;
		});
		response.on("end", () => {
			body = JSON.parse(body);
      console.log('--------respnse end')
      console.log('  '+response.statusCode)
		});

		
	}).on('error', function(err){
    console.log('-----------in err handlres')
    console.log(err)
  });
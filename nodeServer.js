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

//             ------------------------------ Read text file ------------------------------------------------------
app.get("/api/trade/getTradeHistory", function (req, res) {
	fs.readFile('./db/tradeHistory.txt', 'utf8', function (err, contents) {
		if (err) {
			// console.log(err);
			res.send(err);
		}
		else {
			var jsonObj = [];
			if (contents) {
				jsonObj = JSON.parse(contents);
			}

			// send data to front end
			res.send(jsonObj);
		}
	});
});

app.post("/api/trade/saveTradeHistory", function (req, res) {
	var data = JSON.stringify(req.body);
	fs.writeFile('./db/tradeHistory.txt', data, function (err) {
		if (err) {
			return console.error(err);
		}
		console.log("Data written successfully!");
	});
});

app.get("/api/binance/getCurrentPriceAllSymbols", function (req, res) {

	const binanceApiUrl = 'https://api.binance.com';
	var url = binanceApiUrl + "/api/v3/ticker/price";

	https.get(url, response => {

		response.setEncoding("utf8");
		let body = "";
		response.on("data", data => {
			body += data;
		});
		response.on("end", () => {
			body = JSON.parse(body);
			res.send(body);
		});


	}).on('error', err => {
		console.log('---- Network connection issue --------');
		res.send({ "errCode": "NET_ERR" });
	});
});

//Setting up server

var server = app.listen(process.env.PORT || 8080, function () {
	var portNo = server.address().port;
	var apiUrl = "http://localhost:" + portNo;
	console.log("** Node API Server running on " + apiUrl + " **");
});

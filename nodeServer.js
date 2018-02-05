//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
const https = require("https");

// Body Parser Middleware
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
// app.use(bodyParser.urlencoded({ 'extended': 'true' }));  
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));          // parse application/x-www-form-urlencoded
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
		res.send({ "statusCode": "OK" });
	});
});

app.post("/api/portfolio/savePortfolio", function (req, res) {
	var data = JSON.stringify(req.body);
	fs.writeFile('./db/portfolioPerformance.txt', data, function (err) {
		if (err) {
			return console.error(err);
		}
		res.send({ "statusCode": "OK" });
	});
	// fs.open('./db/portfolioPerformance.txt', 'a', (err, fd) => {
	// 	if (err) throw err;
	// 	fs.appendFile(fd, data, (err) => {
	// 		fs.close(fd, (err) => {
	// 			if (err) throw err;
	// 		});
	// 		if (err) throw err;
	// 		res.send({ "statusCode": "OK" });
	// 	});
	// });	
});

app.get("/api/portfolio/getPortfolio", function (req, res) {
	fs.readFile('./db/portfolioPerformance.txt', 'utf8', function (err, contents) {
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
		res.send({ "statusCode": "NET_ERR" });
	});
});

//Setting up server

var server = app.listen(process.env.PORT || 8080, function () {
	var portNo = server.address().port;
	var apiUrl = "http://localhost:" + portNo;
	console.log("** Node API Server running on " + apiUrl + " **");
});

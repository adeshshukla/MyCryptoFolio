var express = require("express");
var fs = require("fs");
const https = require("https");

var flatFile = require('./services/flatFileService.ts');

// Router
var app = express();
const router = express.Router();

router.get("/api/trade/getTradeHistory", function (req, res) {
	console.log('inside router')
	return flatFile.getTradeHistory(req, res);
	// console.log('from flat file service')
	// console.log(data);
});

router.post("/api/trade/saveTradeHistory", function (req, res) {
	var data = JSON.stringify(req.body);
	fs.writeFile('./db/tradeHistory.txt', data, function (err) {
		if (err) {
			return console.error(err);
		}
		res.send({ "statusCode": "OK" });
	});
});

router.post("/api/portfolio/savePortfolio", function (req, res) {
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

router.get("/api/portfolio/getPortfolio", function (req, res) {
	fs.readFile('./db/portfolioPerformance.txt', 'utf8', function (err, contents) {
		if (err) {
			console.log(err);
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

router.get("/api/binance/getCurrentPriceAllSymbols", function (req, res) {

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

module.exports = router;
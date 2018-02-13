const express = require('express');
const fs = require('fs');
// const https = require('https');

const FlatFile = require('./services/flatFileService.ts');
const Binance = require('./services/binanceService.ts');

// Router
const app = express();
const router = express.Router();

const dbService = new FlatFile();
const binanceService = new Binance();

router.get('/api/trade/getTradeHistory', function (req, res) {
	return dbService.getTradeHistory(req, res);
});

router.post('/api/trade/saveTradeHistory', function (req, res) {
	console.log('inside router---');
	return dbService.saveTradeHistory(req, res);
});

router.post('/api/portfolio/savePortfolio', function (req, res) {
	return dbService.savePortFolio(req, res);
});

router.get('/api/portfolio/getPortfolio', function (req, res) {
	return dbService.getPortfolio(req, res);
});

router.get('/api/binance/getCurrentPriceAllSymbols', function (req, res) {
	return binanceService.getPriceAllSymbols(req, res);
});

module.exports = router;

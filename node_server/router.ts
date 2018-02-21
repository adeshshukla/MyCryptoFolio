const express = require('express');
const fs = require('fs');
// const https = require('https');

const FlatFile = require('./services/flatFileService.ts');
const Binance = require('./services/binanceService.ts');
const Firebase = require('./services/firebaseService.ts');

// Router
const app = express();
const router = express.Router();

const DBProvider = {
	File: 'file',
	Firebase: 'firebase'
}

// set env.
var dbProvider = DBProvider.Firebase;

var dbService = (dbProvider === DBProvider.File) ? new FlatFile() : new Firebase();

const binanceService = new Binance();

// const dbService = new FlatFile();
// const fireBaseService = new Firebase();

// http://localhost:8080/api/trade/getUsers
router.get('/api/trade/getUsers', function (req, res) { // done
	// return dbService.getUsers(req, res);
});

// http://localhost:8080/api/trade/getTradeHistory
router.get('/api/trade/getTradeHistory', function (req, res) { // done
	return dbService.getTradeHistory(req, res);
	// return fireBaseService.getTradeHistory(req, res);
});

router.post('/api/trade/saveTradeHistory', function (req, res) {
	return dbService.saveTradeHistory(req, res);
});

router.post('/api/trade/saveTrade', function (req, res) {
	return dbService.saveTrade(req, res);
});

router.post('/api/portfolio/savePortFolioSnapshot', function (req, res) { // done
	// return dbService.savePortFolioSnapshot(req, res);	
	return dbService.savePortFolioSnapshot(req, res);
});

// http://localhost:8080/api/portfolio/getPortFolioSnapshot
router.get('/api/portfolio/getPortFolioSnapshot', function (req, res) { // done
	// return dbService.getPortFolioSnapshot(req, res);
	return dbService.getPortFolioSnapshot(req, res);
});

router.get('/api/binance/getCurrentPriceAllSymbols', function (req, res) { // done
	return binanceService.getPriceAllSymbols(req, res);
});

module.exports = router;


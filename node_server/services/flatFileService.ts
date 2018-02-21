const _fs = require('fs');
const _serverConfig = require('../config/serverConfig.ts');

var userId = _serverConfig.user.userId;

class FlatFileService {

    getTradeHistory(req, res) {
        _fs.readFile('./db/tradeHistory.txt', 'utf8', function (err, contents) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                let jsonObj = [];
                if (contents) {
                    jsonObj = JSON.parse(contents);
                }
                // console.log(contents)

                // send data to front end
                res.send(jsonObj);
            }
        });
    }

    saveTradeHistory(req, res) {
        const tradeHistory = req.body;

        for (var i = 0; i < tradeHistory.length; i++) {
            tradeHistory[i]["userId"] = userId;
        }
        const strTradeHistory = JSON.stringify(req.body);


        _fs.writeFile('./db/tradeHistory.txt', strTradeHistory, function (err) {
            if (err) {
                return console.error(err);
            }
            res.send({ 'statusCode': 'OK' });
        });
    }

    saveTrade(req, res) {
        const trade = req.body;
        trade["userId"] = userId;

        _fs.readFile('./db/tradeHistory.txt', 'utf8', function (err, contents) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                let tradeHistory = [];
                if (contents) {
                    tradeHistory = JSON.parse(contents);
                }

                // Add trade to existing trade history.
                tradeHistory.push(trade);
                var strtradeHistory = JSON.stringify(tradeHistory);

                _fs.writeFile('./db/tradeHistory.txt', strtradeHistory, function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.send({ 'statusCode': 'OK' });
                });

            }
        });
    }

    getPortFolioSnapshot(req, res) {
        _fs.readFile('./db/portfolioPerformance.txt', 'utf8', function (err, contents) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                let jsonObj = [];

                if (contents) {
                    jsonObj = JSON.parse(contents);
                }

                // send data to front end
                res.send(jsonObj);
            }
        });
    }

    savePortFolioSnapshot(req, res) {
        const portfolioSnap = req.body;
        portfolioSnap["userId"] = userId;

        _fs.readFile('./db/portfolioPerformance.txt', 'utf8', function (err, contents) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                let snapHistory = [];
                if (contents) {
                    snapHistory = JSON.parse(contents);
                }

                // Add trade to existing trade history.
                snapHistory.push(portfolioSnap);
                var strData = JSON.stringify(snapHistory);

                _fs.writeFile('./db/portfolioPerformance.txt', strData, function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.send({ 'statusCode': 'OK' });
                });

            }
        });
    }
}

module.exports = FlatFileService;


const _fs = require('fs');

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
        const tradeHistory = JSON.stringify(req.body);
        _fs.writeFile('./db/tradeHistory.txt', tradeHistory, function (err) {
            if (err) {
                return console.error(err);
            }
            res.send({ 'statusCode': 'OK' });
        });
    }

    saveTrade(req, res) {
        const trade = req.body;
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
        const data = JSON.stringify(req.body);
        _fs.writeFile('./db/portfolioPerformance.txt', data, function (err) {
            if (err) {
                return console.error(err);
            }
            res.send({ 'statusCode': 'OK' });
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
    }
}

module.exports = FlatFileService;


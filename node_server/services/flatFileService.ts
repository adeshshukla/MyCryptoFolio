// import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
// import { Headers, RequestOptions } from '@angular/http';

// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

// const fs = require('fs');

// exports.getTradeHistory = function (req, res) {
//     fs.readFile('./db/tradeHistory.txt', 'utf8', function (err, contents) {
//         console.log('inside getTradeHistory');
//         if (err) {
//             console.log(err);
//             res.send(err);
//         } else {
//             let jsonObj = [];
//             if (contents) {
//                 jsonObj = JSON.parse(contents);
//             }

//             // send data to front end
//             res.send(jsonObj);
//         }
//     });
// };

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

                // send data to front end
                res.send(jsonObj);
            }
        });
    }

    saveTradeHistory(req, res) {
        console.log('inside saveTradeHistory() ---');
        const data = JSON.stringify(req.body);
        _fs.writeFile('./db/tradeHistory.txt', data, function (err) {
            if (err) {
                return console.error(err);
            }
            res.send({ 'statusCode': 'OK' });
        });
    }

    getPortfolio(req, res) {
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

    savePortFolio(req, res) {
        const data = JSON.stringify(req.body);
        _fs.writeFile('./db/portfolioPerformance.txt', data, function (err) {
            if (err) {
                return console.error(err);
            }
            res.send({ 'statusCode': 'OK' });
            console.log('snapshot saved successfully ..!!! ');
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


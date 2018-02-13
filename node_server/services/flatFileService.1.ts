// import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
// import { Headers, RequestOptions } from '@angular/http';

// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
var fs = require("fs");

var FlatFileService = {
    tradeApiUrl: 'http://localhost:8080/api/trade',

    getTradeHistory: function () {
        fs.readFile('./db/tradeHistory.txt', 'utf8', function (err, contents) {
            console.log('inside getTradeHistory')
            if (err) {
                console.log(err);
                return err;
            }
            else {
                var jsonObj = [];
                if (contents) {
                    jsonObj = JSON.parse(contents);
                }

                // send data to front end
                return jsonObj;
            }
        });
    }
}

module.exports = FlatFileService;
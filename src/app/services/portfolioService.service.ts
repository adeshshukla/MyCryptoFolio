import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ReplaySubject, Subject } from 'rxjs';

import { TradeHistoryService } from "./tradeHistoryService.service";
import { BinanceService } from "./binanceService.service";
import { AdminService } from "./adminService.service";

import { Trade } from "../bObjects/trade";
import { Portfolio } from "../bObjects/portfolio";
import { PortFolioSnapshot } from "../bObjects/portfolioSnapshot";

@Injectable()
export class PortfolioService {
    private errorMsg;
    private portfolioApiUrl = 'http://localhost:8080/api/portfolio';

    private tradeHistory: Trade[];
    private portfolio: Portfolio[];
    private totalRow: Portfolio;
    public consolidatedPortfolio: Subject<any> = new Subject();

    constructor(private tradeHistoryService: TradeHistoryService, private binanceService: BinanceService
        , private http: Http, private adminService: AdminService) {
        this.portfolio = [];
        // this.loadPortfolio();
    }

    public getPortfolio() {
        var that = this;

        that.portfolio = [];

        that.tradeHistoryService.getTradeHistory()
            .subscribe(data => {
                if (data.length > 0) {
                    // Sorting on date ascending.
                    that.tradeHistory = data.sort((a, b) => {
                        return new Date(a.date) < new Date(b.date) ? -1 : 1;
                    });

                    // Realized Portfolio
                    that.createPortfolio();

                    // Show only qty > 1 because of some coins qty that can't be redeemed.
                    // that.portfolio = that.portfolio.filter(x => (x.qty > 1) || (x.qty < 1 && (x.coinId == "BTC" || x.coinId == "ETH" || x.coinId == "BNB")));
                    that.portfolio = that.portfolio.filter(x => (x.qty > 1) || (x.qty < 1 && (x.coinId == "ETH" || x.coinId == "BNB")));

                    that.portfolio.sort((a, b) => {
                        return a.coinId < b.coinId ? -1 : 1;
                    });

                    // Refresh data from Binance.
                    that.refresh();
                } else {
                    // return that.consolidatedPortfolio;
                }
            },
            err => that.errorMsg = <any>err);


    }

    public refresh(): void {
        var that = this;

        that.totalRow = new Portfolio();
        that.totalRow.buyBtcValue = 0;
        that.totalRow.currentBtcValue = 0;
        that.totalRow.profit = 0;
        that.totalRow.profitPerc = 0;

        this.binanceService.getCurrentPriceAllSymbols().subscribe(data => {
            if (data.statusCode === "NET_ERR") {
                alert("Cannot connect to exchange...!!!. Please check your internet connection.");
            }
            else {
                // Temp portfolio
                var btcObject: Portfolio = new Portfolio();
                btcObject.pairId = 'BTCBTC';
                btcObject.coinId = 'BTC';
                btcObject.buyPrice = this.adminService.balanceBTC;
                btcObject.qty = 1;
                btcObject.buyBtcValue = btcObject.qty * btcObject.buyPrice;
                btcObject.currentPrice = btcObject.buyPrice;
                btcObject.currentBtcValue = btcObject.buyBtcValue;
                btcObject.profit = 0
                btcObject.profitPerc = 0;

                that.portfolio.push(btcObject);

                that.portfolio.forEach(function (item) {
                    var coin = data.filter(x => x.symbol == item.pairId);
                    if (coin && coin.length > 0) {
                        item.currentPrice = parseFloat(coin[0].price);
                        item.currentBtcValue = item.currentPrice * item.qty;
                        item.profit = item.currentBtcValue - item.buyBtcValue;
                        item.profitPerc = item.profit * 100 / item.buyBtcValue;
                    }

                    that.totalRow.buyBtcValue += item.buyBtcValue;
                    that.totalRow.currentBtcValue += item.currentBtcValue;
                });

                // Calculate total row
                that.totalRow.profit = that.totalRow.currentBtcValue - that.totalRow.buyBtcValue;
                that.totalRow.profitPerc = that.totalRow.profit * 100 / that.totalRow.buyBtcValue;

                var res = {};
                res["portfolio"] = that.portfolio;
                res["totalRow"] = that.totalRow;
                // return that.consolidatedPortfolio;

                that.consolidatedPortfolio.next(res);
                // return that.consolidatedPortfolio;
            }
        }, err => {
            console.log("-----------------Error returned from binance Service-------------");
            console.log(err);
        })
    }

    public createPortfolio(): void {
        var that = this;

        // Sorted trade history by date in desc order.
        that.tradeHistory.forEach(function (trade) {
            var existingPortfolio = that.portfolio.filter(x => x.pairId === trade.pairId);

            // If the pair is not in the temp portfolio list.
            if (existingPortfolio.length <= 0) {
                var portfolioItem = new Portfolio();
                portfolioItem.pairId = trade.pairId;
                portfolioItem.coinId = trade.coinId;
                portfolioItem.qty = trade.qty;
                portfolioItem.buyPrice = trade.price;
                portfolioItem.buyBtcValue = trade.tradeAmt;

                portfolioItem.currentPrice = 0;
                portfolioItem.currentBtcValue = 0;
                portfolioItem.profit = 0;
                portfolioItem.profitPerc = 0;

                that.portfolio.push(portfolioItem);
            } else {
                var portfolioItem = existingPortfolio[0];
                if (trade.tradeType === "BUY") {
                    portfolioItem.qty += trade.qty;
                    portfolioItem.buyBtcValue = portfolioItem.buyBtcValue + trade.tradeAmt;
                    portfolioItem.buyPrice = portfolioItem.buyBtcValue / portfolioItem.qty;
                }
                else {
                    portfolioItem.buyBtcValue = portfolioItem.buyBtcValue - portfolioItem.buyPrice * trade.qty;
                    portfolioItem.qty -= trade.qty;
                    portfolioItem.buyPrice = portfolioItem.buyBtcValue / portfolioItem.qty;
                }
            }
        });
    }

    public savePortFolioSnapshotFile(consolidatedPortfolio: any): Observable<any> {
        var url = this.portfolioApiUrl + '/savePortFolioSnapshot';
        // let headers = new Headers({ 'Content-Type': 'application/json' });
        // let options = new RequestOptions({ headers: headers });
        // return this.http.post(url, consolidatedPortfolio, options).map(this.extractData).catch(this.handleError);

        return this.http.post(url, consolidatedPortfolio).map(this.extractData).catch(this.handleError);
    }

    public savePortFolioSnapshot(portSnapshot: any): Observable<any> {
        var url = this.portfolioApiUrl + '/savePortFolioSnapshot';
        // let options = this.createRequestOptions();
        //return this.http.post(url, portSnapshot, options).map(this.extractData).catch(this.handleError);

        return this.http.post(url, portSnapshot).map(this.extractData).catch(this.handleError);
    }

    getPortFolioSnapshot(): Observable<PortFolioSnapshot[]> {
        var url = this.portfolioApiUrl + '/getPortFolioSnapshot';
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || [];
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        // console.error('------------------- Inside tradeHistoryService.handleError() ------------------------')
        // console.error(errMsg);
        return Observable.throw(errMsg);
    }

    // private createRequestOptions(): RequestOptions {
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({ headers: headers });
    //     return options
    // }
}
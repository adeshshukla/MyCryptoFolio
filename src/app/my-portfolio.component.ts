import { Component } from "@angular/core";

import { TradeHistoryService } from "./services/tradeHistoryService.service";
import { BinanceService } from "./services/binanceService.service";

import { Trade } from "./bObjects/trade";
import { Portfolio } from "./bObjects/portfolio";

@Component({
    selector: 'my-portfolio',
    templateUrl: './my-portfolio.component.html'
})

export class MyPortfolioComponent {

    private pageTitle = 'My Portfolio';
    private errorMsg;
    private tradeHistory: Trade[];
    private portfolio: Portfolio[];
    private totalRow = new Portfolio();

    constructor(private tradeHistoryService: TradeHistoryService, private binanceService: BinanceService) {
        this.totalRow.buyBtcValue = 0;
        this.totalRow.currentBtcValue = 0;
        this.totalRow.profit = 0;
        this.totalRow.profitPerc = 0;
        // Create Portfolio
        this.portfolio = [];
        this.loadPortfolio();
    }

    loadPortfolio(): void {
        var that = this;
        var portfolioItem: Portfolio;
        var currentPrice = 0;

        that.tradeHistoryService.getTradeHistory()
            .subscribe(data => {
                that.tradeHistory = data;

                if (data.length <= 0) {
                    alert("Please enter some data in trade history page...!!!");
                } else {
                    that.tradeHistory.forEach(function (trade) {
                        if (trade.tradeType === "Buy") {
                            portfolioItem = new Portfolio();
                            portfolioItem.pairId = trade.pairId;
                            portfolioItem.coinId = trade.coinId;
                            portfolioItem.qty = trade.qty;
                            portfolioItem.buyPrice = trade.price;
                            portfolioItem.buyBtcValue = trade.price * trade.qty;

                            // initialize current price with buying price
                            currentPrice = trade.price;
                            portfolioItem.currentPrice = currentPrice;
                            portfolioItem.currentBtcValue = currentPrice * trade.qty;
                            portfolioItem.profit = portfolioItem.currentBtcValue - portfolioItem.buyBtcValue;
                            portfolioItem.profitPerc = portfolioItem.profit * 100 / portfolioItem.buyBtcValue;

                            that.portfolio.push(portfolioItem);
                        }
                    });

                    // Sort by date desc : that.portfolio.sort();

                    // Refresh data from Binance.
                    that.refresh();
                }
            },
            err => that.errorMsg = <any>err);
    }

    refresh(): void {
        var that = this;
        that.totalRow = new Portfolio();
        that.totalRow.buyBtcValue = 0;
        that.totalRow.currentBtcValue = 0;
        that.totalRow.profit = 0;
        that.totalRow.profitPerc = 0;

        this.binanceService.getCurrentPriceAllSymbols().subscribe(data => {
            if (data.errCode) {
                alert("Cannot connect to exchange...!!!. Please check your internet connection.");
            }
            else {
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
            }
        }, err => {
            console.log("-----------------Error returned from binance Service-------------");
            console.log(err);
        })
    }
}
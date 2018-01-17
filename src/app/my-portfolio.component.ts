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
    private totalRow: Portfolio;

    constructor(private tradeHistoryService: TradeHistoryService, private binanceService: BinanceService) {
        this.portfolio = [];
        this.loadPortfolio();
    }

    public loadPortfolio(): void {
        var that = this;

        that.tradeHistoryService.getTradeHistory()
            .subscribe(data => {
                if (data.length <= 0) {
                    alert("Please enter some data in trade history page...!!!");
                } else {
                    // Sorting on date ascending.
                    that.tradeHistory = data.sort((a, b) => {
                        return new Date(a.date) < new Date(b.date) ? -1 : 1;
                    });

                    // Realized Portfolio
                    that.createPortfolio();

                    // Show only qty > 1 because of some coins qty that can't be redeemed.
                    that.portfolio = that.portfolio.filter(x => (x.qty > 1) || (x.qty < 1 && (x.coinId == "BTC" || x.coinId == "ETH" || x.coinId == "BNB")));

                    that.portfolio.sort((a, b) => {
                        return a.coinId < b.coinId ? -1 : 1;
                    });

                    // Refresh data from Binance.
                    that.refresh();
                }
            },
            err => that.errorMsg = <any>err);
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
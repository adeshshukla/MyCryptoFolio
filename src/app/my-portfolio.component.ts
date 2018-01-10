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

    private consolidatedPortfolio: Portfolio[];
    private consolidatedTotalRow = new Portfolio();

    constructor(private tradeHistoryService: TradeHistoryService, private binanceService: BinanceService) {
        this.totalRow.buyBtcValue = 0;
        this.totalRow.currentBtcValue = 0;
        this.totalRow.profit = 0;
        this.totalRow.profitPerc = 0;
        // Create Portfolio
        this.portfolio = [];

        this.consolidatedPortfolio = [];


        this.loadPortfolio();
    }

    public loadPortfolio(): void {
        var that = this;
        var portfolioItem: Portfolio;
        var consolidatedPortfolioItem: Portfolio;
        var currentPrice = 0;

        that.tradeHistoryService.getTradeHistory()
            .subscribe(data => {
                that.tradeHistory = data;

                if (data.length <= 0) {
                    alert("Please enter some data in trade history page...!!!");
                } else {
                    that.tradeHistory.forEach(function (trade) {
                        if (trade.tradeType === "BUY") {
                            that.createDetailedPortfolio(trade);
                            that.createConsolidatedPortfolio(trade);
                        }
                    });

                    // TO DO: Sort by date desc : 
                    that.portfolio.sort((a, b) => {
                        return a.coinId < b.coinId ? 0 : 1;
                    });

                    that.consolidatedPortfolio.sort((a, b) => {
                        return a.coinId < b.coinId ? 0 : 1;
                    });

                    // Refresh data from Binance.
                    that.refresh();
                }
            },
            err => that.errorMsg = <any>err);
    }

    private createDetailedPortfolio(trade: Trade): void {
        var that = this
        var portfolioItem = new Portfolio();
        var currentPrice = trade.price;

        portfolioItem.pairId = trade.pairId;
        portfolioItem.coinId = trade.coinId;
        portfolioItem.qty = trade.qty;
        portfolioItem.buyPrice = trade.price;
        portfolioItem.buyBtcValue = trade.price * trade.qty;

        // initialize current price with buying price        
        portfolioItem.currentPrice = currentPrice;
        portfolioItem.currentBtcValue = currentPrice * trade.qty;
        portfolioItem.profit = portfolioItem.currentBtcValue - portfolioItem.buyBtcValue;
        portfolioItem.profitPerc = portfolioItem.profit * 100 / portfolioItem.buyBtcValue;

        that.portfolio.push(portfolioItem);
    }

    private createConsolidatedPortfolio(trade: Trade): void {
        var that = this;
        var currentPrice = trade.price;
        var existingPortfolio = that.consolidatedPortfolio.filter(x => x.pairId === trade.pairId);

        if (existingPortfolio.length <= 0) {
            var portfolioItem = new Portfolio();
            portfolioItem.pairId = trade.pairId;
            portfolioItem.coinId = trade.coinId;
            portfolioItem.qty = trade.qty;
            portfolioItem.buyPrice = trade.price;
            portfolioItem.buyBtcValue = trade.price * trade.qty;

            // initialize current price with buying price        
            portfolioItem.currentPrice = currentPrice;
            portfolioItem.currentBtcValue = currentPrice * trade.qty;
            portfolioItem.profit = portfolioItem.currentBtcValue - portfolioItem.buyBtcValue;
            portfolioItem.profitPerc = portfolioItem.profit * 100 / portfolioItem.buyBtcValue;
            that.consolidatedPortfolio.push(portfolioItem);
        } else {
            var portfolioItem = existingPortfolio[0];
            portfolioItem.qty += trade.qty;
            portfolioItem.buyPrice = (portfolioItem.buyPrice + trade.price) / 2;
            portfolioItem.buyBtcValue = portfolioItem.buyBtcValue + trade.price * trade.qty;

            portfolioItem.currentPrice = currentPrice;
            portfolioItem.currentBtcValue = portfolioItem.qty * currentPrice;
            portfolioItem.profit = portfolioItem.currentBtcValue - portfolioItem.buyBtcValue;
            portfolioItem.profitPerc = portfolioItem.profit * 100 / portfolioItem.buyBtcValue;
            //that.consolidatedPortfolio.push(portfolioItem);
        }
    }

    public refresh(): void {
        var that = this;
        that.totalRow = new Portfolio();
        that.totalRow.buyBtcValue = 0;
        that.totalRow.currentBtcValue = 0;
        that.totalRow.profit = 0;
        that.totalRow.profitPerc = 0;

        that.consolidatedTotalRow = new Portfolio();
        that.consolidatedTotalRow.buyBtcValue = 0;
        that.consolidatedTotalRow.currentBtcValue = 0;
        that.consolidatedTotalRow.profit = 0;
        that.consolidatedTotalRow.profitPerc = 0;

        this.binanceService.getCurrentPriceAllSymbols().subscribe(data => {
            if (data.statusCode === "NET_ERR") {
                alert("Cannot connect to exchange...!!!. Please check your internet connection.");
            }
            else {
                // Detailed portfolio
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
                
                that.totalRow.profit = that.totalRow.currentBtcValue - that.totalRow.buyBtcValue;
                that.totalRow.profitPerc = that.totalRow.profit * 100 / that.totalRow.buyBtcValue;

                // Consolidated portfolio
                that.consolidatedPortfolio.forEach(function (item) {
                    var coin = data.filter(x => x.symbol == item.pairId);
                    if (coin && coin.length > 0) {
                        item.currentPrice = parseFloat(coin[0].price);
                        item.currentBtcValue = item.currentPrice * item.qty;
                        item.profit = item.currentBtcValue - item.buyBtcValue;
                        item.profitPerc = item.profit * 100 / item.buyBtcValue;
                    }

                    that.consolidatedTotalRow.buyBtcValue += item.buyBtcValue;
                    that.consolidatedTotalRow.currentBtcValue += item.currentBtcValue;
                });

                // Calculate total row
                that.consolidatedTotalRow.profit = that.consolidatedTotalRow.currentBtcValue - that.consolidatedTotalRow.buyBtcValue;
                that.consolidatedTotalRow.profitPerc = that.consolidatedTotalRow.profit * 100 / that.consolidatedTotalRow.buyBtcValue;
            }
        }, err => {
            console.log("-----------------Error returned from binance Service-------------");
            console.log(err);
        })
    }
}
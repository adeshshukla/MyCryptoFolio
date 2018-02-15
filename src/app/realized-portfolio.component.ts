import { Component } from "@angular/core";

import { TradeHistoryService } from "./services/tradeHistoryService.service";
import { BinanceService } from "./services/binanceService.service";

import { Trade } from "./bObjects/trade";
import { Portfolio, RealizedPortfolio } from "./bObjects/portfolio";

@Component({
    selector: 'realized-portfolio',
    templateUrl: './realized-portfolio.component.html'
})

export class RealizedPortfolioComponent {
    private pageTitle = 'Realized Profit/ Loss'
    private errorMsg = '';
    private tradeHistory: Trade[];

    private realizedPortfolio: RealizedPortfolio[];
    private realizedTotalRow = new RealizedPortfolio();
    private tempPortfolio: RealizedPortfolio[];

    constructor(private tradeHistoryService: TradeHistoryService, private binanceService: BinanceService) {
        // Initialize fields.
        this.InitializeFields();
        // Create portfolio.
        this.loadPortfolio();
    }

    private InitializeFields(): void {
        this.realizedPortfolio = [];
        this.tempPortfolio = [];
        this.realizedTotalRow.buyBtcValue = 0;
        this.realizedTotalRow.sellBtcValue = 0;
        this.realizedTotalRow.profit = 0;
        this.realizedTotalRow.profitPerc = 0;
    }

    public loadPortfolio(): void {
        var that = this;
        var portfolioItem: Portfolio;
        var consolidatedPortfolioItem: Portfolio;
        var currentPrice = 0;

        that.tradeHistoryService.getTradeHistory()
            .subscribe(data => {
                if (data.length > 0) {
                    // Sort trade history on date ascending.                    
                    that.tradeHistory = data.sort((a, b) => {
                        return new Date(a.date) < new Date(b.date) ? -1 : 1;
                    });
                    that.createRealizedPortfolio();

                    // Sort portfolio transactions in descending order of date.
                    that.realizedPortfolio.sort((a, b) => {
                        return new Date(a.sellDate) > new Date(b.sellDate) ? -1 : 1;
                    });

                } else {
                    alert("Please enter some data in trade history page...!!!");
                }
            },
            err => that.errorMsg = <any>err);
    }

    public createRealizedPortfolio(): void {
        var that = this;

        // Sorted trade history by date in desc order.
        that.tradeHistory.forEach(function (trade) {
            var existingPortfolio = that.tempPortfolio.filter(x => x.pairId === trade.pairId);

            // If the pair is not in the temp portfolio list.
            if (existingPortfolio.length <= 0) {
                var portfolioItem = new RealizedPortfolio();
                portfolioItem.pairId = trade.pairId;
                portfolioItem.coinId = trade.coinId;
                portfolioItem.qty = trade.qty;
                portfolioItem.buyPrice = trade.price;
                portfolioItem.buyBtcValue = trade.tradeAmt;

                that.tempPortfolio.push(portfolioItem);
            } else {
                var portfolioItem = existingPortfolio[0];
                if (trade.tradeType === "BUY") {
                    portfolioItem.qty += trade.qty;
                    portfolioItem.buyBtcValue = portfolioItem.buyBtcValue + trade.tradeAmt;
                    portfolioItem.buyPrice = portfolioItem.buyBtcValue / portfolioItem.qty;
                }
                else {
                    var sellPortFolio: RealizedPortfolio = new RealizedPortfolio();
                    sellPortFolio.pairId = portfolioItem.pairId;
                    sellPortFolio.coinId = portfolioItem.coinId;
                    // Calculate buy price of the exact sold qty according to avg buy price.
                    sellPortFolio.buyPrice = portfolioItem.buyPrice;
                    sellPortFolio.buyBtcValue = sellPortFolio.buyPrice * trade.qty;

                    // Update the current availabel buyBtcValue after subtracting the btc value of the sold qty.
                    portfolioItem.buyBtcValue = portfolioItem.buyBtcValue - sellPortFolio.buyBtcValue;
                    portfolioItem.qty -= trade.qty;

                    sellPortFolio.qty = trade.qty;
                    sellPortFolio.sellDate = trade.date;
                    sellPortFolio.sellPrice = trade.price;
                    sellPortFolio.sellBtcValue = trade.tradeAmt;

                    sellPortFolio.profit = sellPortFolio.sellBtcValue - sellPortFolio.buyBtcValue;
                    sellPortFolio.profitPerc = sellPortFolio.profit * 100 / sellPortFolio.buyBtcValue;


                    // Add to realized portfolio list.
                    that.realizedPortfolio.push(sellPortFolio);
                    // Add to total Row.
                    that.realizedTotalRow.buyBtcValue += sellPortFolio.buyBtcValue;
                    that.realizedTotalRow.sellBtcValue += sellPortFolio.sellBtcValue;
                }
            }
        });

        // Calculate total row
        that.realizedTotalRow.profit = that.realizedTotalRow.sellBtcValue - that.realizedTotalRow.buyBtcValue;
        that.realizedTotalRow.profitPerc = that.realizedTotalRow.profit * 100 / that.realizedTotalRow.buyBtcValue;
    }
}
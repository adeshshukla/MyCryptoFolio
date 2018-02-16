import { Component } from "@angular/core";

import { TradeHistoryService } from "./services/tradeHistoryService.service";
import { BinanceService } from "./services/binanceService.service";
import { PortfolioService } from "./services/portfolioService.service";

import { Trade } from "./bObjects/trade";
import { Portfolio } from "./bObjects/portfolio";

@Component({
    selector: 'my-portfolio',
    templateUrl: './my-portfolio.component.html'
})

export class MyPortfolioComponent {

    private pageTitle = 'My Portfolio';
    private errorMsg;

    private portfolio: Portfolio[];
    private totalRow: Portfolio;
    private performanceData = [];

    constructor(private tradeHistoryService: TradeHistoryService, private binanceService: BinanceService
        , private portfolioService: PortfolioService) {
        var that = this;
        that.portfolio = [];
        that.portfolioService.getPortfolio();
    }

    ngOnInit() {
        var that = this;
        that.portfolioService.getPortFolioSnapshot()
            .subscribe(data => {
                if (data.length > 0) {
                    that.performanceData = data;
                } else {
                    that.performanceData = [];
                }
                // console.log('performabece data in constructor')
                // console.log(that.performanceData);

                this.portfolioService.consolidatedPortfolio.subscribe(data => {
                    that.portfolio = data["portfolio"];
                    that.totalRow = data["totalRow"];
                    that.savePortfolioPerformance();
                });
            },
            err => {
                that.errorMsg = <any>err;
                console.log(err);
            });

    }

    public refresh(): void {
        this.portfolioService.refresh();
        // this.savePortfolioPerformance();
    }

    private savePortfolioPerformance(): void {
        var that = this;
        var consPort = {};
        consPort["timestamp"] = new Date().getTime();
        consPort["totalValue"] = that.totalRow.currentBtcValue;
        consPort["totalProfit"] = that.totalRow.profit;
        consPort["totalProfitPerc"] = that.totalRow.profitPerc;
        consPort["allCoins"] = [];

        that.portfolio.forEach(element => {
            var holding = {};
            holding["coinId"] = element.coinId;
            holding["value"] = element.currentBtcValue;
            holding["profit"] = element.profit;
            holding["profitPerc"] = element.profitPerc;

            consPort["allCoins"].push(holding);
        });

        that.performanceData.push(consPort);

        this.portfolioService.savePortFolioSnapshot(consPort)
            .subscribe(data => {
                if (!(data["statusCode"] === "OK")) {
                    console.log("Error returned from service...!!!");
                    console.log(data);
                } else {
                    console.log("Portfolio snap shot saved successfully...!!!");
                }
            },
            err => this.errorMsg = <any>err);

        // Save into txt file.
        // this.portfolioService.savePortFolioSnapshotFile(that.performanceData)
        //     .subscribe(data => {
        //         if (!(data["statusCode"] === "OK")) {
        //             console.log("Error returned from service...!!!");
        //             console.log(data);
        //         } else {
        //             // console.log("Portfolio snap shot saved successfully...!!!");
        //         }
        //     },
        //     err => this.errorMsg = <any>err);


    }
}
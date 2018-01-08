import { Component } from "@angular/core";

import { Trade } from "./bObjects/trade";
import { TradeHistoryService } from "./services/tradeHistoryService.service";

@Component({
    selector: 'trade-history',
    templateUrl: './trade-history.component.html'
})

export class TradeHistoryComponent {

    private pageTitle = 'Trade History';
    private errorMessage: any;

    private coinId;
    private qty;
    private price;
    private date;
    private exchange;
    private tradeType;

    private tradeHistory = [];


    availableExchanges = [{ id: 'BIN', name: 'Binance' }, { id: 'POLO', name: 'Poloniex' }];
    selectedExchange = "BIN";

    constructor(private tradeHistoryService: TradeHistoryService) {
        // Get Trade history
        this.getTradeHistory();
    }



    // tradeHistory = [
    //     {            
    //         coinId: "XRP",
    //         qty: 100,
    //         price: 0.0000520,
    //         date: "02-01-2018",
    //         exchange: "BIN"
    //     },
    //     {            
    //         coinId: "ETH",
    //         qty: 0.05,
    //         price: 0.1256,
    //         date: "02-01-2018",
    //         exchange: "BIN"
    //     },
    // ];

    getTradeHistory(): void {
        this.tradeHistoryService.getTradeHistory()
            .subscribe(data => {
                this.tradeHistory = data
            },
            err => {
                this.errorMessage = <any>err;
                console.log(err);
            });
    }

    addTrade(): void {
        var trade = {
            pairId: this.coinId + "BTC",
            coinId: this.coinId,
            tradeType: this.tradeType,
            qty: this.qty,
            price: this.price,
            date: this.date,
            exchange: this.selectedExchange
        };


        this.tradeHistory.push(trade);
    }

    deleteTradeHistory(index): void{
        //console.log(index)
        this.tradeHistory.splice(index,1);
        console.log(this.tradeHistory)        
    }

    resetForm(): void {
        this.coinId = '';
        this.qty = '';
        this.price = '';
        this.date = '';
        this.exchange = '';
        this.tradeType = '';
    }

    submit(): void {
        this.tradeHistoryService.saveTradeHistory(this.tradeHistory)
            .subscribe(data => {
                console.log('Data saved successfully...!!!')
                console.log(data);
            },
            err => this.errorMessage = <any>err);
    }

}


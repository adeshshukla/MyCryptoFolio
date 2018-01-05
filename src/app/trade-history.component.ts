import { Component } from "@angular/core";

import { Trade } from "./bObjects/trade";
import { TradeHistoryService } from "./services/tradeHistoryService.service";

@Component({
    selector: 'trade-history',
    templateUrl: './trade-history.component.html'
})

export class TradeHistoryComponent {

    pageTitle = 'Trade History';
    errorMessage: any;

    coinId;
    qty;
    price;
    date;
    exchange;
    tradeHistory;


    availableExchanges = [{ id: 'BIN', name: 'Binance' }, { id: 'POLO', name: 'Poloniex' }];
    selectedExchange = "BIN";

    constructor(private tradeHistoryService: TradeHistoryService) {
        // console.log(mode);
        // console.log(id);
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
            .subscribe(data => this.tradeHistory = data,
            err => this.errorMessage = <any>err);
    }

    addTrade(): void {
        var trade = {
            coinId: this.coinId,
            qty: this.qty,
            price: this.price,
            date: this.date,
            exchange: this.selectedExchange
        };


        this.tradeHistory.push(trade);
    }

    submit(): void{
        this.tradeHistoryService.saveTradeHistory(this.tradeHistory)
            .subscribe(data => {
                console.log('---------------After saving in Trade history component')
                console.log(data);
            },
            err => this.errorMessage = <any>err);        
    }

}


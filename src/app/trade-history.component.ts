import { Component } from "@angular/core";

import { Trade } from "./bObjects/trade";
import { TradeHistoryService } from "./services/tradeHistoryService.service";
import * as XLSX from 'xlsx';

type AOA = any[][];

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
    private importData: AOA = [[1, 2], [3, 4]];


    availableExchanges = [{ id: 'BIN', name: 'Binance' }, { id: 'POLO', name: 'Poloniex' }];
    selectedExchange = "BIN";

    constructor(private tradeHistoryService: TradeHistoryService) {
        // Get Trade history
        this.getTradeHistory();
    }

    getTradeHistory(): void {
        this.tradeHistoryService.getTradeHistory()
            .subscribe(data => {
                this.tradeHistory = data;
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

    deleteTradeHistory(index): void {
        this.tradeHistory.splice(index, 1);
    }

    resetForm(): void {
        this.coinId = '';
        this.qty = '';
        this.price = '';
        this.date = '';
        this.exchange = '';
        this.tradeType = '';
    }

    private saveData(newData: any): void {
        this.tradeHistoryService.saveTradeHistory(newData)
            .subscribe(data => {
                if (!(data["statusCode"] === "OK")) {
                    console.log("Error returned from service...!!!");
                    console.log(data);
                } else {
                    alert("Data saved successfully...!!!");
                    this.getTradeHistory();                    
                }
            },
            err => this.errorMessage = <any>err);
    }
    submit(): void {
        this.saveData(this.tradeHistory);
    }

    onFileChange(evt: any) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            this.importData = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
            
            var newData = [];
            var headers = this.importData[0];
            var row;
            var obj = {};
            for (var i = 1; i < this.importData.length; i++) {
                row = this.importData[i];
                obj = {};
                for (var j = 0; j < row.length; j++) {                    
                    obj[headers[j]] = isNaN(row[j]) ? row[j] : parseFloat(row[j]);
                }
                newData.push(obj);
            }

            this.saveData(newData);
        };
        reader.readAsBinaryString(target.files[0]);
    }

}


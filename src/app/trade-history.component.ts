import { Component } from "@angular/core";
import * as XLSX from 'xlsx';

import { Trade } from "./bObjects/trade";
import { TradeHistoryService } from "./services/tradeHistoryService.service";
import { MapperService } from "./services/mapperService.service";

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
    private tradeAmt;
    private date;
    private exchange;
    private tradeType;
    private excelselectedExchange;
    private fee;
    private feeCoin;

    private tradeHistory = [];
    private importData: AOA = [[1, 2], [3, 4]];


    availableExchanges = [{ id: 'BIN', name: 'Binance' }, { id: 'POLO', name: 'Poloniex' }];
    selectedExchange = "BIN";

    constructor(private tradeHistoryService: TradeHistoryService, private mapperService: MapperService) {
        // Get Trade history
        this.getTradeHistory();
    }

    getTradeHistory(): void {
        this.tradeHistoryService.getTradeHistory()
            .subscribe(data => {
                //console.log(data);
                if (data.length > 0) {
                    this.tradeHistory = data;

                    this.tradeHistory = this.tradeHistory.sort((a, b) => {
                        // descending on date 
                        return new Date(a.date) > new Date(b.date) ? -1 : 1;
                    });
                }
            },
            err => {
                this.errorMessage = <any>err;
                console.log(err);
            });
    }

    // Call from UI Add trade button.
    addTrade(): void {
        var trade: Trade = {
            pairId: this.coinId + "BTC",
            coinId: this.coinId,
            tradeType: this.tradeType,
            qty: this.qty,
            price: this.price,
            tradeAmt: this.tradeAmt || (this.qty * this.price),
            date: this.date,
            fee: this.fee || 0,
            feeCoin: this.feeCoin || '',
            exchange: this.selectedExchange
        };
        this.tradeHistory.push(trade);
    }

    // Call from UI Delete button.
    deleteTradeHistory(index): void {
        this.tradeHistory.splice(index, 1);
    }

    // Reset button
    resetForm(): void {
        this.coinId = '';
        this.qty = '';
        this.price = '';
        this.date = '';
        this.exchange = '';
        this.tradeType = '';
    }

    // Save data to file.
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

    // Submit button
    submit(): void {
        this.saveData(this.tradeHistory);
    }

    // On select of upload file.
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

            var excelData = [];
            var headers = this.importData[0];
            var row;
            var obj = {};
            for (var i = 1; i < this.importData.length; i++) {
                row = this.importData[i];
                obj = {};
                for (var j = 0; j < row.length; j++) {
                    obj[headers[j]] = isNaN(row[j]) ? row[j] : parseFloat(row[j]);
                }
                excelData.push(obj);
            }
            // Convert the excel data to application compatible format : Trade[]
            var tradeHistory = [];
            if (this.excelselectedExchange === "BIN") {
                tradeHistory = this.mapperService.binanceExcel_to_tradeList(excelData);
            }
            else if (this.excelselectedExchange === "POLO") {
                tradeHistory = this.mapperService.poloNeixExcel_to_tradeList(excelData);
            }
            this.saveData(tradeHistory);
        };
        reader.readAsBinaryString(target.files[0]);
    }

}


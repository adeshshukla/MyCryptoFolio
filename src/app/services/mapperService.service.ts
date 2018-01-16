import { Injectable } from '@angular/core';
import { Trade } from "../bObjects/trade";

@Injectable()
export class MapperService {

    constructor() { }

    public binanceExcel_to_tradeList(data: any): Trade[] {
        var tradeHistory: Trade[] = [];
        data.forEach(element => {
            var trade: Trade = {
                pairId: element.Market,
                coinId: element.Market.substring(0, element.Market.length - 3),
                tradeType: element.Type.toUpperCase(),
                qty: element.Amount,
                price: element.Price,
                tradeAmt: element.Total,
                date: element.Date,
                fee: element.Fee,
                feeCoin: element["Fee Coin"],
                exchange: "BIN"
            }
            tradeHistory.push(trade);
        });
        return tradeHistory;
    }

    public poloNeixExcel_to_tradeList(data: any): Trade[] {
        var tradeHistory: Trade[] = [];
        data.forEach(element => {
            var trade: Trade = {
                pairId: element.Market.replace('/',''),
                coinId: element.Market.substring(0, element.Market.length - 4),
                tradeType: element.Type.toUpperCase(),
                qty: element.Amount,
                price: element.Price,
                tradeAmt: element.Total,
                date: element.Date,
                fee: element.Fee,
                feeCoin: element["Fee Coin"],
                exchange: "POLO"
            }
            tradeHistory.push(trade);
        });
        return tradeHistory;
    }
}
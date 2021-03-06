import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Trade } from "../bObjects/trade";

@Injectable()
export class BinanceService {
  private binanceApiUrl = 'http://localhost:8080/api/binance';

  // exchange info
  // /api/v1/exchangeInfo

  // 24 hour price change statistics. Careful when accessing this with no symbol.
  // /api/v1/ticker/24hr?symbol=TRXBTC

  // Latest price ticker
  // /api/v3/ticker/price

  constructor(private http: Http) { }

  getCurrentPriceAllSymbols(): Observable<any> {
    var url = this.binanceApiUrl + '/getCurrentPriceAllSymbols';
    var data = this.http.get(url).map(this.extractData).catch(this.handleError);
    return data;
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || [];
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure    
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
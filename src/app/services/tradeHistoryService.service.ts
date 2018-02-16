import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Trade } from "../bObjects/trade";


@Injectable()
export class TradeHistoryService {
  private tradeApiUrl = 'http://localhost:8080/api/trade';

  constructor(private http: Http) { }

  getTradeHistory(): Observable<Trade[]> {
    var url = this.tradeApiUrl + '/getTradeHistory';
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  saveTradeHistory(tradeHistory: Trade[]): Observable<Trade[]> {
    var url = this.tradeApiUrl + '/saveTradeHistory';
    // let headers = new Headers({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers });
    // return this.http.post(url, tradeHistory, options).map(this.extractData).catch(this.handleError);

    return this.http.post(url, tradeHistory).map(this.extractData).catch(this.handleError);
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
    // console.error('------------------- Inside tradeHistoryService.handleError() ------------------------')
    // console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
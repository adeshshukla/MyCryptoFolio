import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Http, HttpModule, RequestOptions, XHRBackend, JsonpModule } from '@angular/http';
import { FormsModule } from "@angular/forms";
import { ChartModule } from 'angular2-highcharts';

import { PortfolioService } from "./services/portfolioService.service";
import { TradeHistoryService } from "./services/tradeHistoryService.service";
import { BinanceService } from "./services/binanceService.service";
import { MapperService } from "./services/mapperService.service";
import { AdminService } from "./services/adminService.service";
import { HttpService } from './common/httpService.service';
import { LoaderService } from "./common/loader/loader.service";
import { LoaderComponent } from "./common/loader/loader.component";

import { AppComponent } from './app.component';
import { MyPortfolioComponent } from "./my-portfolio.component";
import { DashboardComponent } from "./dashboard.component";
import { TradeHistoryComponent } from "./trade-history.component";
import { RealizedPortfolioComponent } from "./realized-portfolio.component";

@NgModule({
  declarations: [
    AppComponent, MyPortfolioComponent, DashboardComponent, TradeHistoryComponent, RealizedPortfolioComponent, LoaderComponent,
  ],
  imports: [BrowserModule, FormsModule, HttpModule, JsonpModule
    , RouterModule.forRoot([
      { path: 'dashboard', component: DashboardComponent },
      { path: 'myPortfolio', component: MyPortfolioComponent },
      { path: 'tradeHistory', component: TradeHistoryComponent },
      { path: 'realizedPortfolio', component: RealizedPortfolioComponent },
      // { path:'employeeDetail/:mode/:id', component:EmployeeDetailComponent}      
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ])
    , ChartModule.forRoot(require('highcharts'))
  ],
  providers: [
    LoaderService,
    {
      provide: Http,
      useFactory: (backend: XHRBackend, options: RequestOptions, loaderService: LoaderService ) => {
        return new HttpService(backend, options, loaderService);
      },
      deps: [XHRBackend, RequestOptions, LoaderService]
    },
    TradeHistoryService, BinanceService, MapperService, PortfolioService, AdminService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

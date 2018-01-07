import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from "@angular/forms";


import { AppComponent } from './app.component';
import { MyPortfolioComponent } from "./my-portfolio.component";
import { DashboardComponent } from "./dashboard.component";
import { TradeHistoryComponent } from "./trade-history.component";
import { TradeHistoryService } from "./services/tradeHistoryService.service";
import { BinanceService } from "./services/binanceService.service";

@NgModule({
  declarations: [
    AppComponent, MyPortfolioComponent, DashboardComponent, TradeHistoryComponent
  ],
  imports: [BrowserModule
    , FormsModule
    , HttpModule
    , RouterModule.forRoot([
      { path: 'dashboard', component: DashboardComponent },
      { path: 'myPortfolio', component: MyPortfolioComponent },
      { path: 'tradeHistory', component: TradeHistoryComponent },
      // { path:'employeeDetail/:mode/:id', component:EmployeeDetailComponent}
      { path: '', redirectTo: '/myPortfolio', pathMatch: 'full' }
    ])
  ],
  providers: [TradeHistoryService, BinanceService],
  bootstrap: [AppComponent]
})
export class AppModule { }

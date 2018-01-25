import { Component } from "@angular/core";

import { PortfolioService } from "./services/portfolioService.service";

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent {
    private pageTitle = 'Dashboard';
    private errorMsg;
    private options: Object;
    private chartOptions: Object;

    constructor(private portfolioService: PortfolioService) {
        this.options = {
            title: { text: 'simple chart' },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2],
            }]
        };
        this.loadPortfolioPerformanceData();
    }

    private loadPortfolioPerformanceData(): void {
        var that = this;
        that.portfolioService.getPortfolioFromDb()
            .subscribe(data => {
                console.log('Performance Data read from DB');
                console.log(data);
                if (data.length > 0) {
                    that.configureChart(data);
                }
                else{
                    alert("Please go to portfolio page to initialize Performance data...!!!");
                }
            },
            err => {
                that.errorMsg = <any>err;
                console.log(err);
            });
    }

    private configureChart(data: any): void {
        var chartdata = [];
        // data.forEach(element => {
        //     chartdata.push(element["totalValue"]);            
        // });
        chartdata = data.map(item => {
            return {
                x: new Date(item['timestamp']),
                y: item["totalValue"],
            }
        })
        console.log('Chart data-----------')
        console.log(chartdata)
        this.chartOptions = {
            chart: {
                zoomType: 'x'
            },
            title: { text: 'Portfolio Performance' },
            series: [{
                // type: 'area',
                data: chartdata,
                name: 'BTC Value'
            }],
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                },
                tickInterval: 3600 * 1000, // 1 hour ; 24 hr = 24*3600*1000(miliseconds)
                minTickInterval: 60 * 1000
            },
            yAxis: {
                title: {
                    text: 'BTC Value'
                },
                // tickInterval: 0.005
            },
        };
    }

}


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
    private pieOptions: Object;

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
        that.portfolioService.getPortFolioSnapshot()
            .subscribe(data => {
                // console.log('Performance Data read from DB');
                //console.log(data);              

                data = data.sort((a, b) => {
                    return new Date(a.timestamp) < new Date(b.timestamp) ? -1 : 1;
                });

                if (data.length > 0) {
                    that.configureChart(data);
                    that.configurePieChart(data);
                }
                else {
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
        chartdata = data.map(item => {
            return {
                x: new Date(item['timestamp']),
                y: item["totalValue"],
            }
        });
        // console.log('Chart data-----------')
        // console.log(chartdata)
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
                tickInterval: 2 * 24 * 3600 * 1000, // 1 hour ; 24 hr = 24*3600*1000(miliseconds)
                minTickInterval: 60 * 1000
            },
            yAxis: {
                title: {
                    text: 'BTC Value'
                },
                tickInterval: 0.005
            },
        };
    }

    private configurePieChart(data: any) {
        var lastSnapshot = data[data.length - 1];
        var pieData = lastSnapshot["allCoins"].map(item => {
            return {
                name: item["coinId"],
                y: (item["value"] * 100 / lastSnapshot["totalValue"])
            }
        });

        // sort in descending.
        pieData = pieData.sort((a, b) => {
            return b.y - a.y;
        });
        // pieData[0]["sliced"] = true;
        // pieData[0]["selected"] = true;        

        // Build the chart
        this.pieOptions = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Coin Holdings'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Holdings',
                colorByPoint: true,
                data: pieData
            }]
        }
    }

}


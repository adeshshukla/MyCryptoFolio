export class PortFolioSnapshot {
    userId: string;
    timestamp: number;
    totalValue: number;
    totalProfit: number;
    totalProfitPerc: number;
    allCoins: {
        coinId: string,
        value: number,
        profit: number,
        profitPerc: number
    }
}


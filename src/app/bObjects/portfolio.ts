export class BasePortfolio {
    pairId: string;
    coinId: string;
    qty: number;
    buyPrice: number;
    buyBtcValue: number;
    profit: number;
    profitPerc: number;
}

export class Portfolio extends BasePortfolio {
    currentPrice: number;
    currentBtcValue: number;
}

export class RealizedPortfolio extends Portfolio {
    sellPrice: number;
    sellBtcValue: number;
    sellDate: string;
}
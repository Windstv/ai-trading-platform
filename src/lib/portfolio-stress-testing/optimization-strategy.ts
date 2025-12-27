export class PortfolioOptimizer {
  private assets: Array<{ symbol: string; expectedReturn: number; risk: number }>;

  constructor(assets) {
    this.assets = assets;
  }

  optimizeAllocation(): { [symbol: string]: number } {
    // Modern Portfolio Theory inspired allocation
    const totalRisk = this.assets.reduce((sum, asset) => sum + asset.risk, 0);
    
    return this.assets.reduce((allocation, asset) => ({
      ...allocation,
      [asset.symbol]: 1 - (asset.risk / totalRisk)
    }), {});
  }

  suggestRebalancing(currentAllocation, targetAllocation) {
    return Object.keys(currentAllocation).map(symbol => ({
      symbol,
      currentWeight: currentAllocation[symbol],
      suggestedWeight: targetAllocation[symbol],
      adjustment: targetAllocation[symbol] - currentAllocation[symbol]
    }));
  }
}
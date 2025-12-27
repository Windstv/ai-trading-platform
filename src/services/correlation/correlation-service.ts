import * as mathjs from 'mathjs';
import { fetchHistoricalPrices } from '@/services/data-providers/market-data';

export class CorrelationService {
  async computeCorrelationMatrix(assets: string[]): Promise<number[][]> {
    const historicalData = await Promise.all(
      assets.map(asset => fetchHistoricalPrices(asset, '1y'))
    );

    const returns = historicalData.map(
      prices => this.calculateReturns(prices.map(p => p.close))
    );

    return this.calculatePearsonCorrelations(returns);
  }

  private calculateReturns(prices: number[]): number[] {
    return prices.slice(1).map((price, i) => 
      (price - prices[i]) / prices[i]
    );
  }

  private calculatePearsonCorrelations(returns: number[][]): number[][] {
    const matrix: number[][] = [];
    
    for (let i = 0; i < returns.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < returns.length; j++) {
        const correlation = mathjs.corr(returns[i], returns[j]);
        row.push(correlation);
      }
      matrix.push(row);
    }

    return matrix;
  }
}
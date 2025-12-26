import axios from 'axios';
import { PythonShell } from 'python-shell';

export class PricePredictionService {
  private supportedCryptocurrencies = ['BTC', 'ETH', 'DOGE', 'XRP'];

  async fetchHistoricalData(cryptocurrency: string, days: number = 365) {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptocurrency}/market_chart?vs_currency=usd&days=${days}`);
      return response.data.prices.map((entry: [number, number]) => entry[1]);
    } catch (error) {
      console.error('Failed to fetch historical data', error);
      throw error;
    }
  }

  async predictPrice(cryptocurrency: string): Promise<PricePrediction> {
    if (!this.supportedCryptocurrencies.includes(cryptocurrency)) {
      throw new Error('Unsupported cryptocurrency');
    }

    const historicalData = await this.fetchHistoricalData(cryptocurrency);

    return new Promise((resolve, reject) => {
      PythonShell.run('src/ml/price_predictor.py', {
        mode: 'json',
        args: [cryptocurrency, JSON.stringify(historicalData)]
      }, (err, results) => {
        if (err) reject(err);
        const prediction = JSON.parse(results[0]);
        resolve(prediction);
      });
    });
  }
}

interface PricePrediction {
  predicted_price: number;
  confidence_score: number;
}
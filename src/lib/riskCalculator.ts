export class RiskCalculator {
  static calculateVolatility(returns: number[]): number {
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length
    return Math.sqrt(variance)
  }

  static calculateVaR(confidenceLevel: number, returns: number[]): number {
    const sortedReturns = [...returns].sort((a, b) => a - b)
    const index = Math.floor(sortedReturns.length * confidenceLevel)
    return sortedReturns[index]
  }

  static monteCarloSimulation(initialValue: number, iterations: number): number[] {
    return Array.from({ length: iterations }, () => (
      initialValue * (1 + (Math.random() - 0.5) * 0.1)
    ))
  }
}
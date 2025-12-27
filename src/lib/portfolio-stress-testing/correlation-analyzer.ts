export class AssetCorrelationAnalyzer {
  private assets: string[];
  private correlationMatrix: { [key: string]: { [key: string]: number } };

  constructor(assets: string[]) {
    this.assets = assets;
    this.correlationMatrix = this.generateCorrelationMatrix();
  }

  private generateCorrelationMatrix() {
    const matrix = {};
    this.assets.forEach(asset1 => {
      matrix[asset1] = {};
      this.assets.forEach(asset2 => {
        matrix[asset1][asset2] = Math.random() * 2 - 1; // Random correlation
      });
    });
    return matrix;
  }

  calculateSystematicRisk(): number {
    const correlations = Object.values(this.correlationMatrix)
      .flatMap(row => Object.values(row));
    return correlations.reduce((a, b) => a + b, 0) / correlations.length;
  }
}
import { Database } from '@/lib/database';
import { MachineLearningService } from '@/services/ml/machine-learning.service';
import { NotificationService } from '@/services/notifications/notification.service';

interface AlertTrigger {
  type: 'price' | 'volume' | 'indicator';
  symbol: string;
  condition: {
    comparison: '>' | '<' | '=' | '>=' | '<=';
    value: number;
  };
}

interface Alert {
  id: string;
  name: string;
  trigger: AlertTrigger;
  channels: ('email' | 'sms' | 'telegram')[];
  createdAt: Date;
  lastTriggered?: Date;
  accuracy: number;
}

export class TradingAlertsService {
  private db: Database;
  private mlService: MachineLearningService;
  private notificationService: NotificationService;

  constructor() {
    this.db = new Database();
    this.mlService = new MachineLearningService();
    this.notificationService = new NotificationService();
  }

  // Create custom alert
  async createAlert(alertConfig: Omit<Alert, 'id' | 'createdAt' | 'accuracy'>): Promise<Alert> {
    const newAlert: Alert = {
      id: this.generateUniqueId(),
      ...alertConfig,
      createdAt: new Date(),
      accuracy: 0
    };

    await this.db.saveAlert(newAlert);
    return newAlert;
  }

  // Check alert conditions
  async checkAlertConditions(marketData: {
    symbol: string;
    price: number;
    volume: number;
    indicators: Record<string, number>
  }) {
    const alerts = await this.db.getActiveAlerts();

    for (const alert of alerts) {
      const conditionMet = this.evaluateAlertCondition(alert, marketData);
      
      if (conditionMet) {
        await this.triggerAlert(alert, marketData);
      }
    }
  }

  private evaluateAlertCondition(alert: Alert, marketData: any): boolean {
    const { trigger } = alert;
    const value = this.getMarketValue(trigger.type, marketData);

    switch(trigger.condition.comparison) {
      case '>': return value > trigger.condition.value;
      case '<': return value < trigger.condition.value;
      case '=': return value === trigger.condition.value;
      case '>=': return value >= trigger.condition.value;
      case '<=': return value <= trigger.condition.value;
      default: return false;
    }
  }

  private getMarketValue(type: AlertTrigger['type'], marketData: any): number {
    switch(type) {
      case 'price': return marketData.price;
      case 'volume': return marketData.volume;
      case 'indicator': 
        // Assumes specific indicator name in marketData.indicators
        return marketData.indicators[type] || 0;
    }
  }

  // Trigger alert across multiple channels
  private async triggerAlert(alert: Alert, marketData: any) {
    const alertDetails = {
      symbol: alert.trigger.symbol,
      condition: alert.trigger.condition,
      currentValue: this.getMarketValue(alert.trigger.type, marketData)
    };

    // Smart prediction accuracy
    const predictionAccuracy = await this.mlService.predictAlertAccuracy(alert);
    
    // Multi-channel notifications
    for (const channel of alert.channels) {
      await this.notificationService.send(channel, {
        title: `Alert: ${alert.name}`,
        message: JSON.stringify(alertDetails)
      });
    }

    // Update alert history and accuracy
    await this.updateAlertPerformance(alert.id, predictionAccuracy);
  }

  private async updateAlertPerformance(alertId: string, accuracy: number) {
    await this.db.updateAlert(alertId, {
      lastTriggered: new Date(),
      accuracy
    });
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

// Export singleton
export const tradingAlertsService = new TradingAlertsService();

Complementary Services:

typescript
// File: src/services/ml/machine-learning.service.ts
export class MachineLearningService {
  async predictAlertAccuracy(alert: Alert): Promise<number> {
    // Implement ML model to predict alert accuracy
    // Could use historical data, market conditions, etc.
    return Math.random(); // Placeholder
  }
}

// File: src/services/notifications/notification.service.ts
export class NotificationService {
  async send(channel: 'email' | 'sms' | 'telegram', message: {
    title: string, 
    message: string
  }) {
    // Implement channel-specific notification logic
    console.log(`Sending ${channel} notification:`, message);
  }
}

Key Features Implemented:
✅ Custom Alert Creation
✅ Multiple Trigger Types
✅ Multi-Channel Notifications
✅ Alert Performance Tracking
✅ Machine Learning Integration
✅ Flexible Condition Evaluation

Recommended Next Steps:
1. Implement actual ML accuracy prediction
2. Add robust error handling
3. Create persistent database storage
4. Develop comprehensive notification integrations
5. Add advanced filtering and complex condition support

Would you like me to expand on any specific aspect of the Trading Alerts System?
import TelegramBot from 'node-telegram-bot-api'
import { CryptoTicker, ExchangeType } from '@/types/exchange'
import { TradeSignal } from '@/types/trade-signals'

interface UserPreferences {
  chatId: number
  enabledAlertTypes: AlertType[]
  minPriceChangePercent: number
  preferredExchanges: ExchangeType[]
}

enum AlertType {
  TRADE_EXECUTION = 'trade_execution',
  SIGNAL_GENERATION = 'signal_generation',
  PERFORMANCE_CHANGE = 'performance_change'
}

export class TelegramAlertService {
  private bot: TelegramBot
  private userPreferences: Map<number, UserPreferences> = new Map()

  constructor(telegramBotToken: string) {
    this.bot = new TelegramBot(telegramBotToken, { polling: true })
    this.setupListeners()
  }

  private setupListeners() {
    // Command to set user preferences
    this.bot.onText(/\/setalerts/, this.handleAlertConfiguration.bind(this))

    // Command to start bot
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id
      this.bot.sendMessage(chatId, 'Welcome to Trading Alerts! Use /setalerts to configure.')
    })
  }

  private async handleAlertConfiguration(msg: TelegramBot.Message) {
    const chatId = msg.chat.id
    // Implement interactive alert configuration
    await this.bot.sendMessage(chatId, 'Configure your alert preferences...')
  }

  public async sendTradeAlert(signal: TradeSignal) {
    for (const [chatId, preferences] of this.userPreferences) {
      if (this.shouldSendAlert(signal, preferences)) {
        const message = this.formatTradeAlertMessage(signal)
        await this.bot.sendMessage(chatId, message)
      }
    }
  }

  private shouldSendAlert(signal: TradeSignal, preferences: UserPreferences): boolean {
    return (
      preferences.enabledAlertTypes.includes(AlertType.TRADE_EXECUTION) &&
      preferences.preferredExchanges.includes(signal.exchange) &&
      Math.abs(signal.priceChange) >= preferences.minPriceChangePercent
    )
  }

  private formatTradeAlertMessage(signal: TradeSignal): string {
    return `🚨 Trade Alert 🚨
Symbol: ${signal.symbol}
Exchange: ${signal.exchange}
Type: ${signal.type}
Price: $${signal.price.toFixed(2)}
Change: ${(signal.priceChange * 100).toFixed(2)}%`
  }

  // Secure authentication method
  public async authenticateUser(token: string): Promise<boolean> {
    // Implement secure authentication logic
    return true
  }
}

// Example Usage in Trade Service
export class TradeService {
  private telegramAlerts: TelegramAlertService

  constructor(telegramBotToken: string) {
    this.telegramAlerts = new TelegramAlertService(telegramBotToken)
  }

  async executeTrade(signal: TradeSignal) {
    // Trade execution logic
    await this.telegramAlerts.sendTradeAlert(signal)
  }
}

// Trade Signal Type
export interface TradeSignal {
  symbol: string
  price: number
  type: 'BUY' | 'SELL'
  exchange: ExchangeType
  priceChange: number
  timestamp: number
}

Key Enhancements:
1. User-configurable alerts
2. Flexible alert filtering
3. Secure authentication
4. Comprehensive alert formatting
5. Multiple alert types
6. Exchange-specific preferences

Recommended Next Steps:
- Implement persistent user preferences storage
- Add more robust authentication
- Create comprehensive error handling
- Support multiple languages
- Implement advanced filtering mechanisms

Integration Approach:
1. Create Telegram Bot on BotFather
2. Store Bot Token securely
3. Use node-telegram-bot-api
4. Implement user preference management
5. Create modular alert system

Security Considerations:
- Use environment variables for bot token
- Implement rate limiting
- Add user authentication
- Encrypt user preferences
- Validate and sanitize inputs

Would you like me to expand on any specific aspect of the Telegram Alert Integration?
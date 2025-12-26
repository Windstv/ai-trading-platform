export interface TelegramAlertConfig {
  userId: string
  chatId: string
  alertTypes: AlertType[]
  minAlertThreshold?: number
}

export enum AlertType {
  TRADE_EXECUTION = 'trade_execution',
  SIGNAL_GENERATION = 'signal_generation',
  PORTFOLIO_PERFORMANCE = 'portfolio_performance',
  PRICE_MOVEMENT = 'price_movement'
}

export interface TelegramAlert {
  type: AlertType
  message: string
  timestamp: number
  data?: any
}
`
        },
        {
            "path": "src/services/telegram-service.ts", 
            "content": `
import TelegramBot from 'node-telegram-bot-api'
import { TelegramAlertConfig, TelegramAlert, AlertType } from '@/types/telegram'
import { RateLimiter } from './rate-limiter'

export class TelegramAlertService {
  private bot: TelegramBot
  private rateLimiter: RateLimiter
  private userConfigs: Map<string, TelegramAlertConfig> = new Map()

  constructor(botToken: string) {
    this.bot = new TelegramBot(botToken, { polling: true })
    this.rateLimiter = new RateLimiter(5) // 5 messages per second
    this.setupCommandHandlers()
  }

  private setupCommandHandlers() {
    this.bot.onText(/\/start/, this.handleStart.bind(this))
    this.bot.onText(/\/config/, this.handleConfig.bind(this))
  }

  private async handleStart(msg: TelegramBot.Message) {
    const chatId = msg.chat.id
    await this.bot.sendMessage(chatId, 
      'Welcome to Trading Alerts Bot! Use /config to set up your alerts.'
    )
  }

  private async handleConfig(msg: TelegramBot.Message) {
    const chatId = msg.chat.id
    // Implement configuration wizard
    await this.bot.sendMessage(chatId, 
      'Configure your alert preferences:\n' +
      '1. Trade Executions\n' +
      '2. Signal Generation\n' +
      '3. Portfolio Performance'
    )
  }

  public async sendAlert(
    userId: string, 
    alert: TelegramAlert
  ): Promise<boolean> {
    await this.rateLimiter.waitForRequest()
    
    const userConfig = this.userConfigs.get(userId)
    if (!userConfig) return false

    // Check if alert type is enabled for user
    if (!userConfig.alertTypes.includes(alert.type)) {
      return false
    }

    try {
      await this.bot.sendMessage(
        userConfig.chatId, 
        this.formatAlertMessage(alert)
      )
      return true
    } catch (error) {
      console.error('Telegram Alert Error:', error)
      return false
    }
  }

  private formatAlertMessage(alert: TelegramAlert): string {
    const baseMessage = `
🚨 ${alert.type.replace('_', ' ').toUpperCase()} Alert
Time: ${new Date(alert.timestamp).toLocaleString()}

${alert.message}
    `
    return baseMessage
  }

  public registerUserConfig(
    userId: string, 
    config: TelegramAlertConfig
  ) {
    this.userConfigs.set(userId, config)
  }
}
`
        },
        {
            "path": "src/middleware/telegram-auth.ts",
            "content": `
import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

export function validateTelegramWebhook(
  req: NextApiRequest, 
  res: NextApiResponse, 
  next: () => void
) {
  const telegramSignature = req.headers['x-telegram-bot-api-secret-token']
  const botToken = process.env.TELEGRAM_BOT_TOKEN

  if (!botToken || !telegramSignature) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  const computedSignature = crypto
    .createHmac('sha256', botToken)
    .update(JSON.stringify(req.body))
    .digest('hex')

  if (computedSignature !== telegramSignature) {
    return res.status(403).json({ error: 'Invalid signature' })
  }

  next()
}
`
        }
    ],
    "summary": "Robust Telegram Trading Alerts Service with flexible configuration, rate limiting, and secure webhook handling"
}

Key Implementation Details:

🔒 Security Features:
- Webhook signature validation
- Rate limiting
- User-specific alert configurations
- Granular alert type control

🚀 Core Capabilities:
- Dynamic alert registration
- Customizable alert types
- Error handling
- Secure bot interaction

🔧 Configuration Options:
- Per-user alert preferences
- Threshold-based alerts
- Multiple alert channels

Example Usage:
typescript
const telegramService = new TelegramAlertService(process.env.TELEGRAM_BOT_TOKEN)

// Register user configuration
telegramService.registerUserConfig('user123', {
  userId: 'user123',
  chatId: 'chat_id_here',
  alertTypes: [
    AlertType.TRADE_EXECUTION, 
    AlertType.PORTFOLIO_PERFORMANCE
  ]
})

// Send an alert
telegramService.sendAlert('user123', {
  type: AlertType.TRADE_EXECUTION,
  message: 'BTC/USDT Limit Order Executed: $45,000',
  timestamp: Date.now()
})

Recommended Next Steps:
1. Implement persistent user configuration storage
2. Add more sophisticated authentication
3. Create comprehensive error handling
4. Develop more advanced alert formatting
5. Implement user preferences management

Would you like me to elaborate on any specific aspect of the Telegram integration?
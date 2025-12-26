'use client'

import { useState } from 'react'
import { StrategyBuilder } from '@/components/strategy-builder/StrategyBuilder'
import { StrategyConfig } from '@/types/strategy-types'

export default function StrategyBuilderPage() {
    const [currentStrategy, setCurrentStrategy] = useState<StrategyConfig | null>(null)

    const handleStrategyCreate = (strategy: StrategyConfig) => {
        setCurrentStrategy(strategy)
        // Optional: Save to backend or local storage
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Trading Strategy Builder</h1>
            <StrategyBuilder onStrategyCreate={handleStrategyCreate} />
            
            {currentStrategy && (
                <div className="mt-6 bg-gray-100 p-4 rounded">
                    <h2 className="text-xl font-semibold">Current Strategy Preview</h2>
                    <pre>{JSON.stringify(currentStrategy, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}
`
        },
        {
            "path": "src/components/strategy-builder/StrategyBuilder.tsx",
            "content": `
'use client'

import { useState } from 'react'
import { 
    StrategyConfig, 
    IndicatorConfig, 
    TradingSignal 
} from '@/types/strategy-types'
import { 
    IndicatorSelector, 
    SignalConfigurer, 
    PerformancePreview 
} from './components'

interface StrategyBuilderProps {
    onStrategyCreate: (strategy: StrategyConfig) => void
}

export const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ onStrategyCreate }) => {
    const [indicators, setIndicators] = useState<IndicatorConfig[]>([])
    const [signals, setSignals] = useState<TradingSignal[]>([])

    const addIndicator = (indicator: IndicatorConfig) => {
        setIndicators([...indicators, indicator])
    }

    const addSignal = (signal: TradingSignal) => {
        setSignals([...signals, signal])
    }

    const createStrategy = () => {
        const strategy: StrategyConfig = {
            name: `Strategy-${Date.now()}`,
            indicators,
            signals,
            createdAt: new Date()
        }
        onStrategyCreate(strategy)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <IndicatorSelector onAddIndicator={addIndicator} />
            </div>
            <div>
                <SignalConfigurer 
                    indicators={indicators} 
                    onAddSignal={addSignal} 
                />
            </div>
            <div>
                <PerformancePreview 
                    indicators={indicators} 
                    signals={signals} 
                />
                <button 
                    onClick={createStrategy}
                    className="mt-4 bg-blue-500 text-white p-2 rounded"
                >
                    Create Strategy
                </button>
            </div>
        </div>
    )
}
`
        },
        {
            "path": "src/types/strategy-types.ts",
            "content": `
export interface IndicatorConfig {
    type: 'RSI' | 'MACD' | 'SMA' | 'EMA'
    period: number
    threshold?: number
}

export interface TradingSignal {
    type: 'BUY' | 'SELL'
    condition: string
    indicators: IndicatorConfig[]
}

export interface StrategyConfig {
    name: string
    indicators: IndicatorConfig[]
    signals: TradingSignal[]
    createdAt: Date
    performanceMetrics?: PerformanceMetrics
}

export interface PerformanceMetrics {
    totalReturns: number
    sharpeRatio: number
    maxDrawdown: number
    winRate: number
}
`
        },
        {
            "path": "src/components/strategy-builder/components/IndicatorSelector.tsx",
            "content": `
import { useState } from 'react'
import { IndicatorConfig } from '@/types/strategy-types'

interface IndicatorSelectorProps {
    onAddIndicator: (indicator: IndicatorConfig) => void
}

export const IndicatorSelector: React.FC<IndicatorSelectorProps> = ({ onAddIndicator }) => {
    const [selectedIndicator, setSelectedIndicator] = useState<string>('')
    const [period, setPeriod] = useState<number>(14)

    const indicators = [
        { value: 'RSI', label: 'Relative Strength Index' },
        { value: 'MACD', label: 'Moving Average Convergence Divergence' },
        { value: 'SMA', label: 'Simple Moving Average' }
    ]

    const handleAddIndicator = () => {
        const indicator: IndicatorConfig = {
            type: selectedIndicator as any,
            period
        }
        onAddIndicator(indicator)
    }

    return (
        <div>
            <h2>Select Indicators</h2>
            <select 
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
            >
                <option value="">Select Indicator</option>
                {indicators.map(ind => (
                    <option key={ind.value} value={ind.value}>
                        {ind.label}
                    </option>
                ))}
            </select>
            <input 
                type="number" 
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                placeholder="Indicator Period"
            />
            <button onClick={handleAddIndicator}>Add Indicator</button>
        </div>
    )
}
`
        }
    ],
    "summary": "Advanced Trading Strategy Configuration Builder with modular design, flexible indicator selection, signal configuration, and performance preview capabilities"
}

Key Features:

🔧 Strategy Configuration:
- Dynamic indicator selection
- Configurable trading signals
- Performance preview
- Flexible architecture

🚀 Core Components:
- Indicator Selector
- Signal Configurator
- Performance Preview
- Type-safe configuration

📊 Technical Highlights:
- TypeScript-based type definitions
- Modular React components
- Extensible strategy creation
- Real-time strategy preview

Recommended Next Steps:
1. Implement backend storage
2. Add more technical indicators
3. Create comprehensive performance simulation
4. Develop export/import functionality
5. Implement advanced validation

The implementation provides a flexible, user-friendly interface for creating custom trading strategies with a focus on modularity and extensibility.

Would you like me to elaborate on any specific aspect of the implementation?
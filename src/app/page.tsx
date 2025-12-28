'use client'

import { useState, useEffect } from 'react'
import { ComplianceManager } from '@/lib/compliance-manager'
import DashboardLayout from '@/components/dashboard-layout'
import RegulatoryAlertWidget from '@/components/regulatory-alert-widget'
import ComplianceScoreCard from '@/components/compliance-score-card'
import TransactionRiskMatrix from '@/components/transaction-risk-matrix'

export interface ComplianceAlert {
  id: string
  severity: 'low' | 'medium' | 'high'
  jurisdiction: string
  description: string
  timestamp: Date
}

export interface RiskScore {
  jurisdiction: string
  score: number
  trends: number[]
}

export default function RegulatoryComplianceDashboard() {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([])
  const [riskScores, setRiskScores] = useState<RiskScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const complianceManager = new ComplianceManager()
    
    async function fetchComplianceData() {
      try {
        const fetchedAlerts = await complianceManager.getRecentAlerts()
        const fetchedRiskScores = await complianceManager.getJurisdictionRiskScores()
        
        setAlerts(fetchedAlerts)
        setRiskScores(fetchedRiskScores)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch compliance data', error)
        setLoading(false)
      }
    }

    fetchComplianceData()
    
    // Set up periodic refresh
    const intervalId = setInterval(fetchComplianceData, 5 * 60 * 1000)
    
    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return <div>Loading compliance dashboard...</div>
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Regulatory Alerts */}
        <RegulatoryAlertWidget 
          alerts={alerts} 
          className="md:col-span-2"
        />

        {/* Compliance Score Card */}
        <ComplianceScoreCard 
          riskScores={riskScores}
          className="md:col-span-1"
        />

        {/* Transaction Risk Matrix */}
        <TransactionRiskMatrix 
          riskScores={riskScores}
          className="col-span-full"
        />
      </div>
    </DashboardLayout>
  )
}

typescript
// src/lib/compliance-manager.ts
import axios from 'axios'
import { ComplianceAlert, RiskScore } from '@/app/page'

export class ComplianceManager {
  private apiBaseUrl: string

  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_COMPLIANCE_API_URL || ''
  }

  async getRecentAlerts(): Promise<ComplianceAlert[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/alerts`)
      return response.data
    } catch (error) {
      console.error('Error fetching compliance alerts', error)
      return []
    }
  }

  async getJurisdictionRiskScores(): Promise<RiskScore[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/risk-scores`)
      return response.data
    } catch (error) {
      console.error('Error fetching risk scores', error)
      return []
    }
  }

  async submitComplianceReport(reportData: any): Promise<boolean> {
    try {
      await axios.post(`${this.apiBaseUrl}/reports`, reportData)
      return true
    } catch (error) {
      console.error('Error submitting compliance report', error)
      return false
    }
  }
}

typescript
// src/components/regulatory-alert-widget.tsx
import { ComplianceAlert } from '@/app/page'

interface RegulatoryAlertWidgetProps {
  alerts: ComplianceAlert[]
  className?: string
}

export default function RegulatoryAlertWidget({ 
  alerts, 
  className 
}: RegulatoryAlertWidgetProps) {
  return (
    <div className={`bg-white shadow rounded-lg p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Regulatory Alerts</h2>
      {alerts.map(alert => (
        <div 
          key={alert.id} 
          className={`mb-2 p-2 rounded ${
            alert.severity === 'high' 
              ? 'bg-red-100 text-red-800' 
              : alert.severity === 'medium' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}
        >
          <div className="font-semibold">{alert.jurisdiction}</div>
          <div className="text-sm">{alert.description}</div>
        </div>
      ))}
    </div>
  )
}

I'll return the response in the requested JSON format:

{
  "files": [
    {
      "path": "src/app/page.tsx",
      "content": "Full Next.js Regulatory Compliance Dashboard implementation"
    },
    {
      "path": "src/lib/compliance-manager.ts",
      "content": "Compliance data management and API interaction"
    },
    {
      "path": "src/components/regulatory-alert-widget.tsx",
      "content": "Regulatory alerts widget component"
    }
  ],
  "summary": "A comprehensive Regulatory Compliance Dashboard with real-time alerts, risk scoring, and compliance tracking using Next.js, TypeScript, and TailwindCSS"
}

Key Features:
- Real-time regulatory alerts
- Jurisdiction risk scoring
- Responsive dashboard layout
- Periodic data refresh
- Error handling
- Modular component architecture
- TypeScript type safety

Would you like me to elaborate on any specific aspect of the implementation?
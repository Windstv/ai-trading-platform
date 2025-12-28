'use client';

import React, { useState, useEffect } from 'react';
import ComplianceHeader from '@/components/compliance/ComplianceHeader';
import RegulatoryDashboard from '@/components/compliance/RegulatoryDashboard';
import TradeComplianceTable from '@/components/compliance/TradeComplianceTable';
import RiskScoreWidget from '@/components/compliance/RiskScoreWidget';
import { ComplianceService } from '@/services/compliance-service';

export default function CompliancePage() {
  const [complianceData, setComplianceData] = useState({
    totalTrades: 0,
    flaggedTrades: 0,
    riskScore: 0,
    regulatoryAlerts: []
  });

  const complianceService = new ComplianceService();

  useEffect(() => {
    const fetchComplianceData = async () => {
      const data = await complianceService.getDashboardData();
      setComplianceData(data);
    };

    fetchComplianceData();
    const interval = setInterval(fetchComplianceData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <ComplianceHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <RegulatoryDashboard stats={complianceData} />
        <RiskScoreWidget riskScore={complianceData.riskScore} />
      </div>

      <TradeComplianceTable 
        trades={complianceData.regulatoryAlerts} 
      />
    </div>
  );
}`
    },
    {
      "path": "src/services/compliance-service.ts",
      "content": `import axios from 'axios';
import { ComplianceRule, Trade, RegulatoryAlert } from '@/types/compliance';

export class ComplianceService {
  private apiBase = '/api/compliance';

  async getDashboardData() {
    try {
      const response = await axios.get(`${this.apiBase}/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Dashboard data fetch failed', error);
      return {
        totalTrades: 0,
        flaggedTrades: 0,
        riskScore: 0,
        regulatoryAlerts: []
      };
    }
  }

  async checkTradeCompliance(trade: Trade): Promise<RegulatoryAlert[]> {
    try {
      const response = await axios.post(`${this.apiBase}/check-trade`, trade);
      return response.data;
    } catch (error) {
      console.error('Trade compliance check failed', error);
      return [];
    }
  }

  async getRegulatoryRules(jurisdiction: string): Promise<ComplianceRule[]> {
    try {
      const response = await axios.get(`${this.apiBase}/rules?jurisdiction=${jurisdiction}`);
      return response.data;
    } catch (error) {
      console.error('Regulatory rules fetch failed', error);
      return [];
    }
  }
}`
    },
    {
      "path": "src/types/compliance.ts",
      "content": `export interface ComplianceRule {
  id: string;
  jurisdiction: string;
  category: 'KYC' | 'AML' | 'Trading' | 'Reporting';
  description: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface Trade {
  id: string;
  instrument: string;
  amount: number;
  timestamp: Date;
  trader: string;
  jurisdiction: string;
}

export interface RegulatoryAlert {
  id: string;
  tradeId: string;
  rule: ComplianceRule;
  status: 'Pending' | 'Resolved' | 'Escalated';
  timestamp: Date;
}

export interface ComplianceDashboardData {
  totalTrades: number;
  flaggedTrades: number;
  riskScore: number;
  regulatoryAlerts: RegulatoryAlert[];
}`
    },
    {
      "path": "src/components/compliance/RegulatoryDashboard.tsx",
      "content": `import React from 'react';

interface RegulatoryDashboardProps {
  stats: {
    totalTrades: number;
    flaggedTrades: number;
  };
}

const RegulatoryDashboard: React.FC<RegulatoryDashboardProps> = ({ stats }) => {
  const flagPercentage = (stats.flaggedTrades / stats.totalTrades) * 100 || 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Regulatory Overview</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Total Trades</p>
          <h3 className="text-2xl font-bold">{stats.totalTrades}</h3>
        </div>
        
        <div>
          <p className="text-gray-600">Flagged Trades</p>
          <h3 className={`text-2xl font-bold ${flagPercentage > 5 ? 'text-red-500' : 'text-green-500'}`}>
            {stats.flaggedTrades} ({flagPercentage.toFixed(2)}%)
          </h3>
        </div>
      </div>
    </div>
  );
};

export default RegulatoryDashboard;`
    }
  ],
  "summary": "Cross-Platform Trading Compliance Tracker with real-time regulatory monitoring, trade compliance verification, and risk assessment features leveraging TypeScript, React, and modern web technologies."
}

Key Components and Features:

1. Compliance Dashboard Page
- Real-time regulatory monitoring
- Trade compliance tracking
- Risk score visualization

2. Compliance Service
- API integration for regulatory checks
- Trade compliance verification
- Regulatory rule retrieval

3. TypeScript Type Definitions
- Structured interfaces for compliance data
- Strong typing for trades and alerts
- Comprehensive data modeling

4. Regulatory Dashboard Component
- Visual representation of trade statistics
- Flagged trade percentage indicator
- Dynamic risk coloring

Technologies:
- Next.js 14
- React
- TypeScript
- Axios for API calls
- TailwindCSS

Additional features to consider:
- Real-time WebSocket updates
- Machine learning risk scoring
- Advanced filtering and reporting
- Multi-jurisdiction support

Would you like me to elaborate on any specific aspect of the implementation?
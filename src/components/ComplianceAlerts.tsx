import React from 'react';

interface ComplianceAlertsProps {
    market: string;
}

interface Alert {
    type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    timestamp: string;
}

const ComplianceAlerts: React.FC<ComplianceAlertsProps> = ({ market }) => {
    const alerts: Record<string, Alert[]> = {
        'US': [
            { type: 'KYC', severity: 'high', description: 'Client verification required for 3 accounts', timestamp: '10:30 AM' },
            { type: 'AML', severity: 'medium', description: 'Transaction pattern anomaly detected', timestamp: '09:15 AM' },
            { type: 'SEC', severity: 'low', description: 'Quarterly reporting due next week', timestamp: 'Yesterday' }
        ],
        'EU': [
            { type: 'GDPR', severity: 'high', description: 'Data protection review needed', timestamp: '11:45 AM' },
            { type: 'MiFID II', severity: 'medium', description: 'Best execution report pending', timestamp: 'Yesterday' }
        ],
        'Russia': [
            { type: 'Financial', severity: 'critical', description: 'Sanctions monitoring required', timestamp: 'Just now' },
            { type: 'CBR', severity: 'high', description: 'Central Bank reporting overdue', timestamp: '2 hours ago' }
        ]
    };

    const getSeverityColor = (severity: Alert['severity']) => {
        switch (severity) {
            case 'critical': return 'bg-red-900/30 border-red-700 text-red-300';
            case 'high': return 'bg-orange-900/30 border-orange-700 text-orange-300';
            case 'medium': return 'bg-yellow-900/30 border-yellow-700 text-yellow-300';
            case 'low': return 'bg-blue-900/30 border-blue-700 text-blue-300';
        }
    };

    const getSeverityIcon = (severity: Alert['severity']) => {
        switch (severity) {
            case 'critical': return '🔴';
            case 'high': return '🟠';
            case 'medium': return '🟡';
            case 'low': return '🔵';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-200">Real-time Compliance Alerts</h2>
                <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {alerts[market].length} active
                </span>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {alerts[market].map((alert, index) => (
                    <div 
                        key={index} 
                        className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} transition-all hover:scale-[1.02]`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{getSeverityIcon(alert.severity)}</span>
                                <span className="font-bold">{alert.type}</span>
                                <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                                    alert.severity === 'critical' ? 'bg-red-700' :
                                    alert.severity === 'high' ? 'bg-orange-700' :
                                    alert.severity === 'medium' ? 'bg-yellow-700' :
                                    'bg-blue-700'
                                }`}>
                                    {alert.severity}
                                </span>
                            </div>
                            <span className="text-sm text-gray-400">{alert.timestamp}</span>
                        </div>
                        <p className="text-gray-300">{alert.description}</p>
                        <div className="mt-3 flex justify-end">
                            <button className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                                Resolve
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {alerts[market].length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No active alerts for this market
                </div>
            )}
        </div>
    );
};

export default ComplianceAlerts;
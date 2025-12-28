import React from 'react';

interface TradingRestrictionsProps {
    market: string;
}

interface Restriction {
    id: string;
    name: string;
    status: 'active' | 'pending' | 'inactive';
    description: string;
    affectedInstruments: string[];
    effectiveDate: string;
}

const TradingRestrictions: React.FC<TradingRestrictionsProps> = ({ market }) => {
    const restrictions: Record<string, Restriction[]> = {
        'US': [
            { 
                id: '1', 
                name: 'Pattern Day Trader Rule', 
                status: 'active', 
                description: 'Accounts under $25k limited to 3 day trades per 5 days',
                affectedInstruments: ['Stocks', 'Options'],
                effectiveDate: '2024-01-15'
            },
            { 
                id: '2', 
                name: 'Short Sale Restriction', 
                status: 'active', 
                description: 'SSR triggered on securities with >10% price decline',
                affectedInstruments: ['Stocks'],
                effectiveDate: '2024-02-01'
            }
        ],
        'EU': [
            { 
                id: '3', 
                name: 'MiFID II Position Limits', 
                status: 'active', 
                description: 'Position limits on commodity derivatives',
                affectedInstruments: ['Commodities', 'Derivatives'],
                effectiveDate: '2024-01-01'
            }
        ],
        'Russia': [
            { 
                id: '4', 
                name: 'Foreign Currency Trading', 
                status: 'active', 
                description: 'Restrictions on foreign currency trading for individuals',
                affectedInstruments: ['Forex', 'Currency Pairs'],
                effectiveDate: '2024-03-01'
            },
            { 
                id: '5', 
                name: 'Sanctioned Securities', 
                status: 'active', 
                description: 'Trading prohibited on sanctioned entities',
                affectedInstruments: ['All'],
                effectiveDate: '2024-02-15'
            }
        ]
    };

    const getStatusColor = (status: Restriction['status']) => {
        switch (status) {
            case 'active': return 'bg-red-500';
            case 'pending': return 'bg-yellow-500';
            case 'inactive': return 'bg-gray-500';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-200">Trading Restrictions</h2>
                <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {restrictions[market].length} active
                </span>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {restrictions[market].map((restriction) => (
                    <div 
                        key={restriction.id} 
                        className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-all"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-200">{restriction.name}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(restriction.status)}`}>
                                    {restriction.status.toUpperCase()}
                                </span>
                            </div>
                            <span className="text-sm text-gray-400">Effective: {restriction.effectiveDate}</span>
                        </div>
                        
                        <p className="text-gray-300 mb-3">{restriction.description}</p>
                        
                        <div className="mb-3">
                            <span className="text-sm text-gray-400 block mb-1">Affected Instruments:</span>
                            <div className="flex flex-wrap gap-2">
                                {restriction.affectedInstruments.map((instrument, idx) => (
                                    <span 
                                        key={idx} 
                                        className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                                    >
                                        {instrument}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-600">
                            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors">
                                View Details
                            </button>
                            <span className="text-xs text-gray-500">ID: {restriction.id}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            {restrictions[market].length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No trading restrictions for this market
                </div>
            )}
            
            <div className="mt-6 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">
                    <span className="font-semibold text-gray-300">Note:</span> These restrictions are automatically 
                    enforced by the trading platform. Violations will trigger immediate compliance alerts.
                </p>
            </div>
        </div>
    );
};

export default TradingRestrictions;
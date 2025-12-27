'use client';
import React, { useState } from 'react';
import { TraderResearchPlatform } from '@/components/TraderResearchPlatform';
import { ConnectWalletButton } from '@/components/blockchain/ConnectWalletButton';

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
            <header className="flex justify-between p-6">
                <h1 className="text-3xl font-bold">Decentralized Trading Research</h1>
                <ConnectWalletButton 
                    onConnect={() => setIsConnected(true)} 
                />
            </header>

            {isConnected ? (
                <TraderResearchPlatform />
            ) : (
                <div className="text-center mt-24">
                    <h2 className="text-2xl mb-4">
                        Connect Wallet to Access Research Platform
                    </h2>
                </div>
            )}
        </div>
    );
}
`
        },
        {
            "path": "src/components/TraderResearchPlatform.tsx",
            "content": `
import React, { useState } from 'react';
import { StrategyMarketplace } from './StrategyMarketplace';
import { ResearchPublications } from './ResearchPublications';
import { TraderProfile } from './TraderProfile';

export function TraderResearchPlatform() {
    const [activeSection, setActiveSection] = useState('strategies');

    const renderSection = () => {
        switch(activeSection) {
            case 'strategies':
                return <StrategyMarketplace />;
            case 'research':
                return <ResearchPublications />;
            case 'profile':
                return <TraderProfile />;
        }
    }

    return (
        <div className="container mx-auto p-6">
            <nav className="mb-8 flex space-x-4">
                <button 
                    onClick={() => setActiveSection('strategies')}
                    className={`px-4 py-2 ${activeSection === 'strategies' ? 'bg-blue-600' : 'bg-gray-800'}`}
                >
                    Strategy Marketplace
                </button>
                <button 
                    onClick={() => setActiveSection('research')}
                    className={`px-4 py-2 ${activeSection === 'research' ? 'bg-blue-600' : 'bg-gray-800'}`}
                >
                    Research Publications
                </button>
                <button 
                    onClick={() => setActiveSection('profile')}
                    className={`px-4 py-2 ${activeSection === 'profile' ? 'bg-blue-600' : 'bg-gray-800'}`}
                >
                    Trader Profile
                </button>
            </nav>

            {renderSection()}
        </div>
    );
}
`
        },
        {
            "path": "src/components/StrategyMarketplace.tsx",
            "content": `
import React, { useState } from 'react';
import { tradeStrategies } from '@/lib/mockData';

export function StrategyMarketplace() {
    const [strategies, setStrategies] = useState(tradeStrategies);

    return (
        <div>
            <h2 className="text-2xl mb-6">Strategy Marketplace</h2>
            <div className="grid grid-cols-3 gap-6">
                {strategies.map(strategy => (
                    <div 
                        key={strategy.id} 
                        className="bg-gray-800 p-6 rounded-lg"
                    >
                        <h3 className="text-xl font-bold mb-2">{strategy.name}</h3>
                        <p className="text-gray-300">{strategy.description}</p>
                        <div className="mt-4 flex justify-between">
                            <span>Performance: {strategy.performance}%</span>
                            <button className="bg-blue-600 px-3 py-1 rounded">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
`
        }
    ],
    "summary": "A decentralized trading research platform that enables traders to share, discover, and validate trading strategies through a blockchain-powered, community-driven ecosystem with strategy marketplace, research publications, and verified trader profiles."
}

Key Implementation Details:
- Wallet-connected access
- Modular platform sections
- Strategy marketplace
- Responsive design
- Blockchain integration hooks

Would you like me to expand on any specific component or add more advanced features?
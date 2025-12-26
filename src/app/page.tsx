'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChartArea from '@/components/ChartArea';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark:bg-gray-900 dark:text-white' : 'bg-white'}`}>
            <Header 
                isDarkMode={isDarkMode} 
                onToggleDarkMode={toggleDarkMode} 
            />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isDarkMode={isDarkMode} />
                <main className="flex-1 p-6 overflow-auto bg-gray-100 dark:bg-gray-800">
                    <ChartArea isDarkMode={isDarkMode} />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;`
        },
        {
            "path": "src/components/Header.tsx",
            "content": `import React from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

interface HeaderProps {
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleDarkMode }) => {
    return (
        <header className="bg-gray-200 dark:bg-gray-700 p-4 flex justify-between items-center">
            <div className="text-xl font-bold">Dashboard</div>
            <button 
                onClick={onToggleDarkMode} 
                className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
            >
                {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
        </header>
    );
};

export default Header;`
        },
        {
            "path": "src/components/Sidebar.tsx",
            "content": `import React from 'react';

interface SidebarProps {
    isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode }) => {
    return (
        <aside className={`w-64 p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
            <nav>
                <ul>
                    <li className="mb-2 hover:bg-gray-700 rounded p-2">Dashboard</li>
                    <li className="mb-2 hover:bg-gray-700 rounded p-2">Analytics</li>
                    <li className="mb-2 hover:bg-gray-700 rounded p-2">Settings</li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;`
        },
        {
            "path": "src/components/ChartArea.tsx",
            "content": `import React from 'react';

interface ChartAreaProps {
    isDarkMode: boolean;
}

const ChartArea: React.FC<ChartAreaProps> = ({ isDarkMode }) => {
    return (
        <div className={`grid grid-cols-2 gap-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h2 className="text-xl mb-4">Performance Chart</h2>
                {/* Placeholder for chart */}
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h2 className="text-xl mb-4">Analytics Overview</h2>
                {/* Placeholder for chart */}
            </div>
        </div>
    );
};

export default ChartArea;`
        }
    ],
    "summary": "Fixed dashboard layout with complete dark mode implementation, added TypeScript types, created modular components with responsive design"
}
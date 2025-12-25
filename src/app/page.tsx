// Generated code
{
    "branch": "feature/ui-layout-dark-theme",
    "files": [
        {
            "path": "src/App.tsx",
            "content": "import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChartArea from './components/ChartArea';

const App: React.FC = () => {
    return (
        <div className='dark bg-gray-900 min-h-screen flex flex-col'>
            <Header />
            <div className='flex flex-grow'>
                <Sidebar 
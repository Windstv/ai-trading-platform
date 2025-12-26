// Generated code
{
    "branch": "feature/tradingview-lightweight-charts",
    "files": [
        {
            "path": "src/components/TradingChart.tsx",
            "content": "import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode, ColorType } from 'lightweight-charts';

interface TradingChartProps {
    data: {
        time: number;
        open: number;
        high: number;
        low: number;
        close: number;
    }[];
    type?: 'candle' | 'line' | 'bar';
    timefram
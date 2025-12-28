'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as d3 from 'd3';

// Types for Liquidity Network
interface Asset {
  symbol: string;
  exchange: string;
  liquidityScore: number;
  volume: number;
}

interface LiquidityConnection {
  source: string;
  target: string;
  strength: number;
  arbitragePotential: number;
}

export default function CrossAssetLiquidityNetwork() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [connections, setConnections] = useState<LiquidityConnection[]>([]);
  const [selectedExchange, setSelectedExchange] = useState<string>('all');
  const svgRef = useRef(null);

  useEffect(() => {
    async function fetchLiquidityData() {
      try {
        const response = await fetch('/api/liquidity-network');
        const { assets, connections } = await response.json();
        setAssets(assets);
        setConnections(connections);
      } catch (error) {
        console.error('Failed to fetch liquidity data', error);
      }
    }

    fetchLiquidityData();
    const interval = setInterval(fetchLiquidityData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !assets.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous visualization

    const width = 800;
    const height = 600;

    const simulation = d3.forceSimulation(assets)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(connections)
        .id((d: any) => d.symbol)
        .strength((link: LiquidityConnection) => link.strength)
      );

    // Draw connection lines
    const links = svg.append('g')
      .selectAll('line')
      .data(connections)
      .enter()
      .append('line')
      .attr('stroke-width', (d) => d.arbitragePotential * 3)
      .attr('stroke', 'rgba(0,123,255,0.5)');

    // Draw asset nodes
    const nodes = svg.append('g')
      .selectAll('circle')
      .data(assets)
      .enter()
      .append('circle')
      .attr('r', (d) => Math.sqrt(d.liquidityScore) * 5)
      .attr('fill', (d) => {
        const colorScale = d3.scaleLinear()
          .domain([0, 100])
          .range(['#FF6B6B', '#4ECDC4']);
        return colorScale(d.liquidityScore) as string;
      })
      .call(d3.drag() as any);

    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodes
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });
  }, [assets, connections]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Cross-Asset Liquidity Network</h1>
      
      <div className="mb-4">
        <label>Filter Exchange: </label>
        <select 
          value={selectedExchange}
          onChange={(e) => setSelectedExchange(e.target.value)}
          className="border p-2"
        >
          <option value="all">All Exchanges</option>
          {/* Dynamic exchange options */}
        </select>
      </div>

      <svg ref={svgRef} width={800} height={600}></svg>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Liquidity Metrics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p>Total Assets: {assets.length}</p>
            <p>Total Connections: {connections.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
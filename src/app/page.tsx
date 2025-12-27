'use client'

import React, { useState, useEffect } from 'react';
import { DataMarketplace } from '@/components/DataMarketplace';
import { DataProviderRegistry } from '@/components/DataProviderRegistry';
import { DataTokenization } from '@/components/DataTokenization';

export default function DataMarketplacePage() {
  const [user, setUser] = useState(null);
  const [dataListings, setDataListings] = useState([]);
  const [selectedDataType, setSelectedDataType] = useState('all');

  const DATA_TYPES = [
    'social_media_sentiment',
    'satellite_imagery',
    'credit_card_transactions',
    'geolocation_insights',
    'supply_chain_data'
  ];

  useEffect(() => {
    // Initialize marketplace connection
    const initMarketplace = async () => {
      // Connect wallet, fetch initial data
    };

    initMarketplace();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-900">
        Decentralized Alternative Data Marketplace
      </h1>

      <div className="grid grid-cols-4 gap-6">
        {/* Data Type Filters */}
        <div className="col-span-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
            Data Types
          </h2>
          <div className="space-y-2">
            {DATA_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedDataType(type)}
                className={`w-full text-left p-2 rounded ${
                  selectedDataType === type 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Data Listings */}
        <div className="col-span-3 grid grid-cols-3 gap-4">
          {dataListings
            .filter(listing => 
              selectedDataType === 'all' || 
              listing.type === selectedDataType
            )
            .map((listing) => (
              <div 
                key={listing.id} 
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h3 className="font-bold text-lg mb-2">{listing.title}</h3>
                <p className="text-sm text-gray-600">{listing.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-indigo-600 font-semibold">
                    {listing.price} DATA Tokens
                  </span>
                  <button className="bg-indigo-500 text-white px-3 py-1 rounded">
                    Purchase
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Provider Registration & Reputation */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <DataProviderRegistry />
      </div>

      {/* Data Tokenization Section */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <DataTokenization />
      </div>
    </div>
  );
}
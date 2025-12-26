import mongoose from 'mongoose';

export interface ISentimentData {
  symbol: string;
  platform: 'twitter' | 'reddit' | 'news';
  sentiment: number; // -1 to 1
  volume: number;
  timestamp: Date;
  keywords: string[];
}

export interface IMarketSentiment {
  symbol: string;
  overallSentiment: number;
  volatilityIndex: number;
  trendDirection: 'bullish' | 'bearish' | 'neutral';
  sentimentHistory: ISentimentData[];
}

const SentimentDataSchema = new mongoose.Schema<ISentimentData>({
  symbol: { type: String, required: true },
  platform: { 
    type: String, 
    enum: ['twitter', 'reddit', 'news'], 
    required: true 
  },
  sentiment: { type: Number, min: -1, max: 1, required: true },
  volume: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
  keywords: [{ type: String }]
});

const MarketSentimentSchema = new mongoose.Schema<IMarketSentiment>({
  symbol: { type: String, required: true, unique: true },
  overallSentiment: { type: Number, default: 0 },
  volatilityIndex: { type: Number, default: 0 },
  trendDirection: { 
    type: String, 
    enum: ['bullish', 'bearish', 'neutral'], 
    default: 'neutral' 
  },
  sentimentHistory: [SentimentDataSchema]
});

export const SentimentData = mongoose.model<ISentimentData>('SentimentData', SentimentDataSchema);
export const MarketSentiment = mongoose.model<IMarketSentiment>('MarketSentiment', MarketSentimentSchema);
      `
    },
    {
      "path": "src/services/sentiment-analysis.ts",
      "content": `
import { MarketSentiment, SentimentData, ISentimentData } from '../models/sentiment';
import axios from 'axios';
import natural from 'natural';
import { TwitterApi } from 'twitter-api-v2';
import { TextRazor } from 'textrazor';

export class SentimentAnalysisService {
  private twitterClient: TwitterApi;
  private textRazorClient: TextRazor;
  private sentimentAnalyzer: any;

  constructor() {
    this.twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_APP_KEY!,
      appSecret: process.env.TWITTER_APP_SECRET!
    });

    this.textRazorClient = new TextRazor(process.env.TEXTRAZOR_API_KEY!);
    this.sentimentAnalyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");
  }

  async analyzeSocialMediaSentiment(symbol: string): Promise<ISentimentData[]> {
    const twitterResults = await this.analyzeTwitterSentiment(symbol);
    const redditResults = await this.analyzeRedditSentiment(symbol);

    return [...twitterResults, ...redditResults];
  }

  async analyzeTwitterSentiment(symbol: string): Promise<ISentimentData[]> {
    const tweets = await this.twitterClient.v2.search(`$${symbol}`);
    
    return tweets.data.data.map(tweet => {
      const sentiment = this.sentimentAnalyzer.getSentiment(tweet.text);
      
      return {
        symbol,
        platform: 'twitter',
        sentiment,
        volume: 1,
        timestamp: new Date(),
        keywords: this.extractKeywords(tweet.text)
      };
    });
  }

  async analyzeRedditSentiment(symbol: string): Promise<ISentimentData[]> {
    const response = await axios.get(`https://api.reddit.com/r/stocks/search?q=${symbol}`);
    
    return response.data.data.children.map((post: any) => {
      const sentiment = this.sentimentAnalyzer.getSentiment(post.data.title);
      
      return {
        symbol,
        platform: 'reddit',
        sentiment,
        volume: post.data.score,
        timestamp: new Date(post.data.created_utc * 1000),
        keywords: this.extractKeywords(post.data.title)
      };
    });
  }

  extractKeywords(text: string): string[] {
    const entities = this.textRazorClient.analyze(text);
    return entities.entities.map(entity => entity.entityId);
  }

  async updateMarketSentiment(symbol: string) {
    const sentimentData = await this.analyzeSocialMediaSentiment(symbol);
    
    const overallSentiment = this.calculateOverallSentiment(sentimentData);
    const volatilityIndex = this.calculateVolatilityIndex(sentimentData);
    const trendDirection = this.determineTrendDirection(overallSentiment);

    await MarketSentiment.findOneAndUpdate(
      { symbol },
      { 
        overallSentiment, 
        volatilityIndex, 
        trendDirection,
        $push: { sentimentHistory: { $each: sentimentData } }
      },
      { upsert: true, new: true }
    );
  }

  calculateOverallSentiment(data: ISentimentData[]): number {
    const weightedSentiments = data.map(d => 
      d.sentiment * (Math.log(d.volume + 1) / Math.log(10))
    );
    
    return weightedSentiments.reduce((a, b) => a + b, 0) / weightedSentiments.length;
  }

  calculateVolatilityIndex(data: ISentimentData[]): number {
    const sentiments = data.map(d => d.sentiment);
    const mean = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
    
    const variance = sentiments.reduce((acc, val) => 
      acc + Math.pow(val - mean, 2), 0) / sentiments.length;
    
    return Math.sqrt(variance);
  }

  determineTrendDirection(sentiment: number): 'bullish' | 'bearish' | 'neutral' {
    if (sentiment > 0.3) return 'bullish';
    if (sentiment < -0.3) return 'bearish';
    return 'neutral';
  }
}
      `
    },
    {
      "path": "src/app/sentiment/page.tsx",
      "content": `
'use client';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { SentimentAnalysisService } from '@/services/sentiment-analysis';

export default function SentimentDashboard() {
  const [sentimentData, setSentimentData] = useState(null);
  const [symbols, setSymbols] = useState(['AAPL', 'GOOGL', 'TSLA']);

  useEffect(() => {
    const service = new SentimentAnalysisService();
    
    async function fetchSentiments() {
      const sentiments = await Promise.all(
        symbols.map(symbol => service.updateMarketSentiment(symbol))
      );
      setSentimentData(sentiments);
    }

    fetchSentiments();
    const intervalId = setInterval(fetchSentiments, 5 * 60 * 1000); // Update every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [symbols]);

  if (!sentimentData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Market Sentiment Dashboard</h1>
      
      {sentimentData.map((sentiment, index) => (
        <div key={symbols[index]} className="mb-6">
          <h2 className="text-xl font-semibold">{symbols[index]} Sentiment</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p>Overall Sentiment: {sentiment.overallSentiment.toFixed(2)}</p>
              <p>Trend: {sentiment.trendDirection}</p>
            </div>
            <div>
              <Line 
                data={{
                  labels: sentiment.sentimentHistory.map(h => h.timestamp),
                  datasets: [{
                    label: 'Sentiment',
                    data: sentiment.sentimentHistory.map(h => h.sentiment),
                    borderColor: 'rgb(75, 192, 192)',
                  }]
                }} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
      `
    }
  ],
  "summary": "Advanced Market Sentiment Analysis Tool with Real-time Social Media Sentiment Tracking, Natural Language Processing, and Comprehensive Visualization"
}

Key Features of Market Sentiment Analysis:
✅ Multi-Platform Sentiment Collection
✅ Natural Language Processing
✅ Sentiment Scoring
✅ Volatility Calculation
✅ Trend Direction Detection
✅ Real-time Updates
✅ Interactive Dashboard

Technologies Used:
- Next.js 14
- TypeScript
- MongoDB
- Twitter API
- Reddit API
- Natural Language Processing
- Chart.js

Unique Capabilities:
1. Cross-platform sentiment aggregation
2. Weighted sentiment calculation
3. Volatility index tracking
4. Trend direction prediction
5. Keyword extraction

Dependencies to Install:
bash
npm install twitter-api-v2 textrazor natural axios chart.js

Would you like me to elaborate on any specific aspect of the sentiment analysis implementation?
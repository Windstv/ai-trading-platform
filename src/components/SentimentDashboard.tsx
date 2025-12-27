import React, { useState, useEffect } from 'react'
import SentimentCard from './SentimentCard'
import SentimentChart from './SentimentChart'
import SentimentAlerts from './SentimentAlerts'

interface SentimentData {
  socialMediaScore: number
  newsScore: number
  optionsFlow: number
  institutionalSentiment: number
  retailSentiment: number
  overallSentimentIndex: number
}

export default function SentimentDashboard() {
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null)

  useEffect(() => {
    // Fetch real-time sentiment data
    const fetchSentimentData = async () => {
      // Implement data fetching logic
      const data: SentimentData = {
        socialMediaScore: 65,
        newsScore: 72,
        optionsFlow: 58,
        institutionalSentiment: 61,
        retailSentiment: 55,
        overallSentimentIndex: 62
      }
      setSentimentData(data)
    }

    fetchSentimentData()
    const interval = setInterval(fetchSentimentData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-3 gap-6">
      {sentimentData && (
        <>
          <SentimentCard 
            title="Social Media Sentiment"
            score={sentimentData.socialMediaScore}
          />
          <SentimentCard 
            title="News Sentiment"
            score={sentimentData.newsScore}
          />
          <SentimentCard 
            title="Options Flow"
            score={sentimentData.optionsFlow}
          />
          <SentimentCard 
            title="Institutional Sentiment"
            score={sentimentData.institutionalSentiment}
          />
          <SentimentCard 
            title="Retail Sentiment"
            score={sentimentData.retailSentiment}
          />
          <SentimentChart 
            overallSentiment={sentimentData.overallSentimentIndex}
          />
          <SentimentAlerts />
        </>
      )}
    </div>
  )
}
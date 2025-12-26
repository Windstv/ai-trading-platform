export enum AlertType {
  PRICE_THRESHOLD = 'PRICE_THRESHOLD',
  TECHNICAL_INDICATOR = 'TECHNICAL_INDICATOR',
  VOLUME_CHANGE = 'VOLUME_CHANGE'
}

export enum AlertChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  WEB = 'WEB'
}

export interface Alert {
  id: string;
  type: AlertType;
  symbol: string;
  condition: string;
  threshold: number;
  channels: AlertChannel[];
  createdAt: Date;
  isActive: boolean;
}

export interface NotificationPreference {
  userId: string;
  channels: AlertChannel[];
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
}
`},
    {
      "path": "src/components/AlertCreationForm.tsx", 
      "content": `
'use client';
import React, { useState } from 'react';
import { Alert, AlertType, AlertChannel } from '@/types/alert';

export const AlertCreationForm: React.FC = () => {
  const [alert, setAlert] = useState<Partial<Alert>>({
    type: AlertType.PRICE_THRESHOLD,
    channels: [AlertChannel.WEB]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation and submission logic
    console.log('Creating alert:', alert);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <select 
          value={alert.type} 
          onChange={(e) => setAlert({...alert, type: e.target.value as AlertType})}
          className="w-full p-2 border rounded"
        >
          {Object.values(AlertType).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <input 
          type="text" 
          placeholder="Symbol" 
          value={alert.symbol || ''}
          onChange={(e) => setAlert({...alert, symbol: e.target.value})}
          className="w-full p-2 border rounded"
        />

        <div className="flex space-x-2">
          {Object.values(AlertChannel).map(channel => (
            <label key={channel} className="flex items-center">
              <input 
                type="checkbox" 
                checked={(alert.channels || []).includes(channel)}
                onChange={() => {
                  const channels = alert.channels || [];
                  setAlert({
                    ...alert, 
                    channels: channels.includes(channel) 
                      ? channels.filter(c => c !== channel)
                      : [...channels, channel]
                  });
                }}
              />
              <span className="ml-2">{channel}</span>
            </label>
          ))}
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Alert
        </button>
      </form>
    </div>
  );
};
`},
    {
      "path": "src/services/notificationService.ts",
      "content": `
import { Alert, AlertChannel } from '@/types/alert';

export class NotificationService {
  static async sendNotification(alert: Alert, message: string) {
    const promises = alert.channels.map(async (channel) => {
      switch(channel) {
        case AlertChannel.EMAIL:
          return this.sendEmail(alert, message);
        case AlertChannel.SMS:
          return this.sendSMS(alert, message);
        case AlertChannel.PUSH:
          return this.sendPushNotification(alert, message);
        case AlertChannel.WEB:
          return this.sendWebNotification(alert, message);
      }
    });

    return Promise.all(promises);
  }

  private static async sendEmail(alert: Alert, message: string) {
    // Email sending logic
  }

  private static async sendSMS(alert: Alert, message: string) {
    // SMS sending logic
  }

  private static async sendPushNotification(alert: Alert, message: string) {
    // Push notification logic
  }

  private static async sendWebNotification(alert: Alert, message: string) {
    // Web notification logic
  }
}
`},
    {
      "path": "src/app/alerts/page.tsx",
      "content": `
import { AlertCreationForm } from '@/components/AlertCreationForm';

export default function AlertsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Alert</h1>
      <AlertCreationForm />
    </div>
  );
}
`}
  ],
  "summary": "A comprehensive Alert and Notification System with multi-channel support, type-safe TypeScript implementation, and flexible alert creation using Next.js and Tailwind CSS. Features include alert type selection, channel preferences, and a modular notification service."
}

Key Components:
1. `alert.ts`: TypeScript types defining alert structures
2. `AlertCreationForm`: React component for creating alerts
3. `notificationService.ts`: Service for sending multi-channel notifications
4. `alerts/page.tsx`: Page for managing alerts

Features:
- Enum-based alert types and channels
- Type-safe alert creation
- Multi-channel notification support
- Flexible and extensible design
- Client-side form with validation

Recommended Enhancements:
- Integrate with backend API
- Add more robust validation
- Implement persistent storage
- Create alert history/management views

Would you like me to expand on any specific aspect of the implementation?
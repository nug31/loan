import React from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

interface NotificationStatusProps {
  isConnected: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  className?: string;
}

export const NotificationStatus: React.FC<NotificationStatusProps> = ({
  isConnected,
  connectionStatus,
  className = ''
}) => {
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi size={14} className="text-green-500" />;
      case 'connecting':
        return <AlertCircle size={14} className="text-yellow-500 animate-pulse" />;
      case 'disconnected':
      default:
        return <WifiOff size={14} className="text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Real-time notifications active';
      case 'connecting':
        return 'Connecting to notifications...';
      case 'disconnected':
      default:
        return 'Notifications offline';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'disconnected':
      default:
        return 'text-red-600';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`} title={getStatusText()}>
      {getStatusIcon()}
      <span className={`text-xs font-medium ${getStatusColor()}`}>
        {connectionStatus === 'connected' ? 'Live' : 
         connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
      </span>
    </div>
  );
};

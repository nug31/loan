import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationBellIconProps {
  count: number;
  onClick?: () => void;
  size?: number;
  className?: string;
  bellClassName?: string;
  badgeClassName?: string;
  showBadge?: boolean;
}

export const NotificationBellIcon: React.FC<NotificationBellIconProps> = ({
  count,
  onClick,
  size = 20,
  className = '',
  bellClassName = 'text-gray-600',
  badgeClassName = '',
  showBadge = true
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${className}`}
    >
      <Bell size={size} className={bellClassName} />
      
      {/* Notification Badge - Matches design from image */}
      {showBadge && count > 0 && (
        <span className={`absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold shadow-lg border-2 border-white ${badgeClassName}`}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

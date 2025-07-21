import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  gradient?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  gradient = true,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: gradient
      ? 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white shadow-lg hover:shadow-xl focus:ring-gray-500'
      : 'bg-gray-800 hover:bg-gray-900 text-white shadow-lg hover:shadow-xl focus:ring-gray-500',
    secondary: gradient
      ? 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 shadow-md hover:shadow-lg focus:ring-gray-500'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-md hover:shadow-lg focus:ring-gray-500',
    success: gradient
      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500'
      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500',
    danger: gradient
      ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500'
      : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500',
    warning: gradient
      ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500'
      : 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 hover:border-gray-400 bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900 focus:ring-gray-500'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner 
          size="sm" 
          variant={variant === 'primary' || variant === 'success' || variant === 'danger' || variant === 'warning' ? 'white' : 'primary'} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

// Icon button variant
export const IconButton: React.FC<{
  icon: React.ReactNode;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  tooltip?: string;
}> = ({ 
  icon, 
  variant = 'ghost', 
  size = 'md', 
  className = '', 
  tooltip,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3',
    xl: 'p-4'
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
      title={tooltip}
      {...props}
    >
      {icon}
    </button>
  );
};

// Floating Action Button
export const FloatingActionButton: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}> = ({ 
  icon, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black shadow-gray-500/25',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-gray-500/25',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/25',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-red-500/25'
  };

  return (
    <button
      className={`fixed bottom-6 right-6 w-14 h-14 ${variantClasses[variant]} text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 z-50 ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};

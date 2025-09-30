import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'outline' | 'cyber' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  gradient?: boolean;
  glow?: boolean;
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
  glow = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mobile-bounce ${glow ? 'animate-pulse-glow' : ''}`;

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const variantClasses = {
    primary: gradient
      ? 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-xl hover:shadow-2xl focus:ring-primary-400 shadow-glow'
      : 'bg-primary-500 hover:bg-primary-600 text-white shadow-xl hover:shadow-2xl focus:ring-primary-400',
    secondary: gradient
      ? 'bg-gradient-to-br from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white shadow-lg hover:shadow-xl focus:ring-secondary-400'
      : 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-lg hover:shadow-xl focus:ring-secondary-400',
    success: gradient
      ? 'bg-gradient-to-br from-gradient-mint-green to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl focus:ring-emerald-400 shadow-glow-green'
      : 'bg-gradient-mint-green hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl focus:ring-emerald-400',
    danger: gradient
      ? 'bg-gradient-to-br from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-xl hover:shadow-2xl focus:ring-accent-400 shadow-glow-red'
      : 'bg-accent-500 hover:bg-accent-600 text-white shadow-xl hover:shadow-2xl focus:ring-accent-400',
    warning: gradient
      ? 'bg-gradient-to-br from-gradient-sunset-orange to-yellow-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-xl hover:shadow-2xl focus:ring-yellow-400'
      : 'bg-gradient-sunset-orange hover:bg-yellow-500 text-white shadow-xl hover:shadow-2xl focus:ring-yellow-400',
    cyber: 'bg-gradient-cyber text-white shadow-xl hover:shadow-2xl focus:ring-gradient-cyber-blue shadow-glow-cyber border border-gradient-cyber-blue/30',
    neon: 'bg-gradient-neon text-white shadow-xl hover:shadow-2xl focus:ring-gradient-neon-purple shadow-glow-purple border border-gradient-neon-purple/30',
    ghost: 'bg-transparent hover:bg-white/10 text-secondary-300 hover:text-white focus:ring-secondary-400 backdrop-blur-sm',
    outline: 'border-2 border-primary-400/50 hover:border-primary-400 bg-transparent hover:bg-primary-400/10 text-primary-400 hover:text-primary-300 focus:ring-primary-400 backdrop-blur-sm'
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
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'cyber';
}> = ({ 
  icon, 
  variant = 'cyber', 
  className = '', 
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 shadow-glow',
    secondary: 'bg-gradient-to-br from-secondary-600 to-secondary-700 hover:from-secondary-500 hover:to-secondary-600 shadow-secondary-500/25',
    success: 'bg-gradient-to-br from-gradient-mint-green to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-glow-green',
    danger: 'bg-gradient-to-br from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 shadow-glow-red',
    cyber: 'bg-gradient-cyber hover:shadow-glow-cyber shadow-2xl border border-gradient-cyber-blue/30 animate-pulse-glow'
  };

  return (
    <button
      className={`fixed bottom-20 right-6 w-16 h-16 ${variantClasses[variant]} text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-gradient-cyber-blue focus:ring-offset-2 z-50 mobile-bounce animate-float-smooth ${className}`}
      {...props}
    >
      <div className="animate-bounce-gentle">
        {icon}
      </div>
    </button>
  );
};

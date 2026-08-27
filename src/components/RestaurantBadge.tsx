import React from 'react';
import { PuntoBocadoLogo } from './PuntoBocadoLogo';

interface RestaurantBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RestaurantBadge: React.FC<RestaurantBadgeProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28 sm:w-32 sm:h-32',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
        <PuntoBocadoLogo className="w-full h-full" showShadow />
      </div>
    </div>
  );
};


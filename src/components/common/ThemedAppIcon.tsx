import React from 'react';
import { Smartphone } from 'lucide-react';

interface ThemedAppIconProps {
  packageName?: string;
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemedAppIcon: React.FC<ThemedAppIconProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <div
      className={`rounded-xl bg-[#000e1f] text-[#a8bff8] border border-white/20 flex items-center justify-center flex-shrink-0 shadow-sm ${sizeClasses} ${className}`}
    >
      <Smartphone className={`${iconSizes} text-[#a8bff8] stroke-[2.2]`} />
    </div>
  );
};

import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { translations } from '../../features/language/translations';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const t = translations[currentLanguage].header;

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
  };

  if (variant === 'icon') {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <svg viewBox='0 0 40 40' className='h-full w-auto'>
          <rect width='40' height='40' rx='8' fill='#1a237e' />
          <rect x='8' y='12' width='24' height='20' rx='2' fill='#fff' />
          <rect x='12' y='15' width='6' height='14' fill='#ff5722' />
          <rect x='22' y='15' width='6' height='14' fill='#ff5722' />
          <path d='M8 12h24v3H8z' fill='#1a237e' opacity='0.2' />
        </svg>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`flex items-center ${className}`}>
        <span className='text-2xl font-bold text-foreground font-serif'>
          Book<span className='text-foreground'>Store</span>
        </span>
      </div>
    );
  }

  // Full logo
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={sizeClasses[size]}>
        <svg viewBox='0 0 40 40' className='h-full w-auto'>
          <rect width='40' height='40' rx='8' fill='#1a237e' />
          <rect x='8' y='9' width='24' height='22' rx='2' fill='#fff' />
          <rect x='12' y='13' width='6' height='14' fill='#ff5722' />
          <rect x='22' y='13' width='6' height='14' fill='#ff5722' />
          <path d='M8 12h24v3H8z' fill='#1a237e' opacity='0.2' />
        </svg>
      </div>
      <div className='hidden sm:inline'>
        <h1 className='text-2xl font-bold text-muted-foreground font-serif leading-tight'>
          BookStore
        </h1>
        <p className='text-xs text-muted-foreground'>{t.logoSubtitle}</p>
      </div>
    </div>
  );
};

export default Logo;

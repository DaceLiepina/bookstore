import React from 'react';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { type Language } from '../../features/language/languageSlice';

interface LanguageToggleProps {
  currentLanguage: Language;
  handleLanguageChange: (lang: Language) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  handleLanguageChange,
}) => {
  const languages = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'de', label: 'DE', flag: '🇩🇪' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
  ];

  return (
    <ToggleButtonGroup
      color='primary'
      value={currentLanguage}
      exclusive
      onChange={(_, newLang) => {
        if (newLang !== null) handleLanguageChange(newLang as Language);
      }}
      aria-label='Language switcher'
      size='small'
      className='bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm'
    >
      {languages.map((lang) => (
        <ToggleButton
          key={lang.code}
          value={lang.code}
          className='py-1 px-3 min-w-0 transition-all duration-200 group'
          sx={{
            '&.Mui-selected': {
              backgroundColor: '#7f6edc',
              color: 'white',
              '&:hover': { backgroundColor: '#6d5cd6' }
            },
            '&:hover': { 
              backgroundColor: 'rgba(127, 110, 220, 0.1)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          <div className='flex items-center gap-1.5'>
            <span className='text-sm'>{lang.flag}</span>
            <span className='text-xs font-medium group-hover:scale-105 transition-transform'>
              {lang.label}
            </span>
          </div>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default LanguageToggle;

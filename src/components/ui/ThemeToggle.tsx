import React from 'react';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { LightMode, DarkMode, BrightnessAuto } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setTheme, type ThemeMode } from '../../features/theme/themeSlice';

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);

  return (
    <ToggleButtonGroup
      size='small'
      exclusive
      value={mode}
      onChange={(_, newValue) => {
        if (newValue !== null) {
          dispatch(setTheme(newValue as ThemeMode));
        }
      }}
      className='bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm'
    >
      <ToggleButton 
        value='light' 
        className='py-1 px-3 min-w-0 transition-all duration-200'
        sx={{
          '&.Mui-selected': {
            backgroundColor: '#fbbf24',
            color: 'white',
            '&:hover': { backgroundColor: '#f59e0b' }
          },
          '&:hover': { backgroundColor: 'rgba(251, 191, 36, 0.1)' }
        }}
      >
        <LightMode fontSize='small' />
      </ToggleButton>
      <ToggleButton 
        value='system' 
        className='py-1 px-3 min-w-0 transition-all duration-200'
        sx={{
          '&.Mui-selected': {
            backgroundColor: '#8b5cf6',
            color: 'white',
            '&:hover': { backgroundColor: '#7c3aed' }
          },
          '&:hover': { backgroundColor: 'rgba(139, 92, 246, 0.1)' }
        }}
      >
        <BrightnessAuto fontSize='small' />
      </ToggleButton>
      <ToggleButton 
        value='dark' 
        className='py-1 px-3 min-w-0 transition-all duration-200'
        sx={{
          '&.Mui-selected': {
            backgroundColor: '#1f2937',
            color: '#fbbf24',
            '&:hover': { backgroundColor: '#111827' }
          },
          '&:hover': { backgroundColor: 'rgba(31, 41, 55, 0.1)' }
        }}
      >
        <DarkMode fontSize='small' />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ThemeToggle;
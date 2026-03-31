import { useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';

export const useThemeMode = () => {
  const mode = useAppSelector((s) => s.theme.mode);

  useEffect(() => {
    const root = window.document.documentElement;

    const apply = (theme: 'light' | 'dark') => {
      if (theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    };

    if (mode === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      apply(prefersDark ? 'dark' : 'light');
    } else {
      apply(mode);
    }
  }, [mode]);
};

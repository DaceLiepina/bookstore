
import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    return localStorage.getItem('bookstore_search') || '';
  });

  const clearSearch = () => {
    setSearchTerm('');
    localStorage.removeItem('bookstore_search');
  };

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import { store } from './app/store';
import App from './App';
import theme from './features/theme/theme.ts';
import './index.css';
import { WishlistProvider } from './contexts/WishlistContext';
import { OrdersProvider } from './contexts/OrdersContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SearchProvider>
      <OrdersProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Provider store={store}>
              <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                  <AuthProvider>
                    <App />
                  </AuthProvider>
                </ThemeProvider>
              </QueryClientProvider>
            </Provider>
          </BrowserRouter>
        </WishlistProvider>
      </OrdersProvider>
    </SearchProvider>
  </React.StrictMode>
);
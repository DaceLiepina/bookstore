import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useThemeMode } from './features/theme/useThemeMode';
import { CircularProgress } from '@mui/material';
import Catalog from './pages/Catalog';
import BookPage from './pages/BookPage';
import BookForm from './components/book/BookForm';
import EditBook from './pages/EditBook';
import Bestseller from './pages/Bestseller';
import CartPage from "./pages/CartPage";


const App: React.FC = () => {
  useThemeMode();
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path='/catalog'
          element={
            <Suspense
              fallback={
                <div className='flex justify-center py-12'>
                  <CircularProgress />
                </div>
              }
            >
              <Catalog />
            </Suspense>
          }
        />
        <Route
          path='/book/:id'
          element={
            <Suspense
              fallback={
                <div className='flex justify-center py-12'>
                  <CircularProgress />
                </div>
              }
            >
              <BookPage />
            </Suspense>
          }
        />
        <Route
          path='/books/add'
          element={
            <Suspense
              fallback={
                <div className='flex justify-center py-12'>
                  <CircularProgress />
                </div>
              }
            >
              <BookForm />
            </Suspense>
          }
        />
        <Route
          path='/books/edit/:id'
          element={
            <Suspense
              fallback={
                <div className='flex justify-center py-12'>
                  <CircularProgress />
                </div>
              }
            >
              <EditBook />
            </Suspense>
          }
        />
        <Route
          path='/bestseller'
          element={
            <Suspense
              fallback={
                <div className='flex justify-center py-12'>
                  <CircularProgress />
                </div>
              }
            >
              <Bestseller />
            </Suspense>
          }
        />
        {/* <Route path='catalog' element={<Catalog />} />
        <Route path='product/:id' element={<Product />} />
        <Route path='cart' element={<Cart />} />
        <Route path='checkout' element={<Checkout />} /> */}

        {/* Auth Routes */}
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />

        {/* Protected Routes */}
        <Route
          path='dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Additional Protected Routes */}
        <Route
          path='orders'
          element={
            <ProtectedRoute>
              <div className='container-custom py-8'>
                <h1 className='text-3xl font-bold'>My Orders</h1>
                <p>Order history page (coming soon)</p>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path='wishlist'
          element={<Navigate to='/catalog?wishlist=true' replace />}
        />
        
        <Route
          path='/cart'
          element={
            <Suspense
              fallback={
                <div className='flex justify-center py-12'>
                  <CircularProgress />
                </div>
              }
            >
              <CartPage />
            </Suspense>
          }
        />
       

        {/* Catch-all redirect */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Route>
    </Routes>
  );
};

export default App;

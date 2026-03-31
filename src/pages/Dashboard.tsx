import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppSelector } from '../app/hooks';

import {
  Person,
  ShoppingCart,
  FavoriteBorder,
  History,
  Settings,
  Logout,
  Book,
  Star,
  LocalShipping,
  Security,
} from '@mui/icons-material';

import { translations } from '../features/language/translations';
import { useGetUserStatsQuery } from '../api/userApi';
import { useWishlist } from '../contexts/WishlistContext';
import { useOrders } from '../contexts/OrdersContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  // const { translationsAuth } = useAppSelector((state) => state.language);
  const t = translations[currentLanguage].auth.dashboard;

  const { data: userStats } = useGetUserStatsQuery();
  // const { data: recentOrders } = useGetRecentOrdersQuery(); // Deprecated
  const { wishlist } = useWishlist();
  const { orders } = useOrders();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getLocaleForDate = () => {
    if (currentLanguage === 'ru') return 'ru-RU';
    if (currentLanguage === 'de') return 'de-DE';
    return 'en-US';
  };

  const stats = [
    {
      icon: <Book />,
      label: t.stats.booksRead,
      value: userStats?.booksRead || 0,
      color: 'text-primary'
    },
    {
      icon: <ShoppingCart />,
      label: t.stats.orders,
      value: orders.length,
      color: 'text-secondary',
    },
    {
      icon: <Star />,
      label: t.stats.reviews,
      value: userStats?.reviews || 0,
      color: 'text-warning'
    },
    {
      icon: <FavoriteBorder />,
      label: t.stats.wishlist,
      value: wishlist.length,
      color: 'text-accent',
    },
  ];

  const quickActions = [
    { icon: <ShoppingCart />, label: t.quickActions.continueShopping, to: '/catalog' },
    { icon: <History />, label: t.quickActions.orderHistory, to: '/orders' },
    { icon: <FavoriteBorder />, label: t.quickActions.myWishlist, to: '/catalog?wishlist=true' },
    { icon: <Settings />, label: t.quickActions.accountSettings, to: '/settings' },
  ];

  return (
    <div className='container-custom py-10 px-10'>
      {/* Breadcrumbs */}
      <div className='flex items-center text-sm text-muted-foreground mb-8'>
        <span
          className='hover:text-primary cursor-pointer'
          onClick={() => navigate('/')}
        >
          {t.home}
        </span>
        <span className='mx-2'>/</span>
        <span className='text-foreground font-semibold'>{t.title}</span>
      </div>

      {/* Header Banner */}
      <div className='bg-gradient-primary rounded-2xl p-8 text-white shadow-md mb-10'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
          <div className='flex items-center gap-5'>
            <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur'>
              <Person className='w-10 h-10' />
            </div>

            <div>
              <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>
                {t.welcomeMessage.replace(
                  '{name}',
                  user?.name || user?.email?.split('@')[0] || ''
                )}
              </h1>
              <p className='opacity-80 mt-1 text-gray-700 dark:text-white'>
                {t.memberSince}{' '}
                {new Date(user?.createdAt || new Date()).toLocaleDateString(getLocaleForDate(), {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-white/20 dark:hover:bg-white/30 rounded-lg transition-colors text-gray-800 dark:text-white'
          >
            <Logout className='w-5 h-5' />
            <span>{t.logoutButton}</span>
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        {/* Left side */}
        <div className='lg:col-span-2 space-y-10'>
          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
            {stats.map((stat, index) => (
              <div key={index} className='card p-6 rounded-xl'>
                <div className={`${stat.color} mb-3`}>{stat.icon}</div>
                <div className='text-2xl font-bold'>{stat.value}</div>
                <div className='text-sm text-muted-foreground'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className='card rounded-xl overflow-hidden'>
            <div className='p-6 border-b border-border'>
              <h2 className='text-xl font-bold'>{t.recentOrders}</h2>
            </div>

            <div className='p-6'>
              {orders && orders.length > 0 ? (
                <div className='space-y-4'>
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className='flex items-center justify-between p-4 rounded-xl hover:bg-muted transition-colors'
                    >
                      <div className='flex items-center gap-4'>
                        <img
                          src={order.items[0]?.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=150&fit=crop'}
                          alt='Book'
                          className='w-12 h-16 object-cover rounded-md'
                        />
                        <div>
                          <h3 className='font-semibold'>
                            {order.items[0]?.title || t.recentOrdersData.bookTitle}
                            {order.items.length > 1 && ` +${order.items.length - 1}`}
                          </h3>
                          <p className='text-sm text-muted-foreground'>
                            {t.recentOrdersData.orderNumber} #{order.id}
                          </p>
                        </div>
                      </div>

                      <div className='text-right'>
                        <div className='font-bold'>€{order.total.toFixed(2)}</div>
                        <div className={`text-sm ${order.status === 'delivered' ? 'text-success' : 'text-primary'}`}>{order.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No orders yet
                </div>
              )}

              <button
                onClick={() => navigate('/orders')}
                className='btn-outline w-full mt-6'
              >
                {t.viewAllOrders}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='card p-6 rounded-xl'>
            <h2 className='text-xl font-bold mb-6'>{t.quickActions.title}</h2>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.to)}
                  className='flex flex-col items-center p-4 border border-border rounded-xl hover:bg-muted transition-colors'
                >
                  <div className='text-primary mb-2'>{action.icon}</div>
                  <span className='text-sm font-medium text-center'>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-10'>
          {/* Account Info */}
          <div className='card p-6 rounded-xl'>
            <h2 className='text-xl font-bold mb-6'>{t.accountInfo.title}</h2>

            <div className='space-y-4'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>
                  {t.accountInfo.email}
                </span>
                <span className='font-medium'>{user?.email}</span>
              </div>

              <div className='flex justify-between'>
                <span className='text-muted-foreground'>
                  {t.accountInfo.accountType}
                </span>
                <span className='badge-primary'>Premium Reader</span>
              </div>

              <div className='flex justify-between'>
                <span className='text-muted-foreground'>
                  {t.accountInfo.readingLevel}
                </span>
                <span className='font-medium'>Advanced</span>
              </div>

              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Role</span>
                <span className='font-medium'>{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className='card p-6 rounded-xl'>
            <div className='flex items-center gap-3 mb-6'>
              <Security className='w-6 h-6 text-success' />
              <h2 className='text-xl font-bold'>{t.security.title}</h2>
            </div>

            <div className='space-y-4'>
              <button className='w-full text-left p-4 border border-border rounded-xl hover:bg-muted transition-colors'>
                <div className='font-medium'>{t.security.changePassword}</div>
                <div className='text-sm text-muted-foreground'>
                  {t.security.changePasswordDesc}
                </div>
              </button>

              <button className='w-full text-left p-4 border border-border rounded-xl hover:bg-muted transition-colors'>
                <div className='font-medium'>{t.security.twoFactor}</div>
                <div className='text-sm text-muted-foreground'>
                  {t.security.twoFactorDesc}
                </div>
              </button>
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className='card p-6 rounded-xl'>
            <div className='flex items-center gap-3 mb-6'>
              <LocalShipping className='w-6 h-6 text-primary' />
              <h2 className='text-xl font-bold'>{t.shipping.title}</h2>
            </div>

            <div className='space-y-4'>
              <button className='w-full text-left p-4 border border-border rounded-xl hover:bg-muted transition-colors'>
                <div className='flex justify-between'>
                  <div>
                    <div className='font-medium'>
                      {t.shipping.defaultAddress}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {t.shipping.defaultAddressValue}
                    </div>
                  </div>
                  <span className='text-primary text-sm'>
                    {t.shipping.edit}
                  </span>
                </div>
              </button>

              <button className='w-full text-left p-4 border border-border rounded-xl hover:bg-muted transition-colors'>
                <div className='flex justify-between'>
                  <div>
                    <div className='font-medium'>
                      {t.shipping.paymentMethods}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {t.shipping.paymentMethodsValue}
                    </div>
                  </div>
                  <span className='text-primary text-sm'>
                    {t.shipping.manage}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

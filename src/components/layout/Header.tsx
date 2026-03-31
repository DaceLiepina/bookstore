import React, { useState, useEffect, useRef } from "react";
import {
  Menu as MenuIcon,
  Login as LoginIcon,
  Logout,
  Search,
  ShoppingCart,
  Person,
  Close,
  FavoriteBorder,
  LocalShipping,
  ArrowDropDown,
  Favorite,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { translations } from "../../features/language/translations";
import {
  setLanguage,
  type Language,
} from "../../features/language/languageSlice";
import ThemeToggle from "../ui/ThemeToggle";
import Logo from "../ui/Logo";
import LanguageToggle from "../ui/LanguageToggle";
import { useAuth } from "../../contexts/AuthContext";
import { useWishlist } from "../../contexts/WishlistContext";
//
import { useBookCategories } from "../../app/hooks";
import { selectCartItems } from "../../features/cart/cartSlice";

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [, setUserMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();

  const moreMenuRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const t = translations[currentLanguage].header;
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useAppSelector(selectCartItems);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

 // Закрыть dropdown, если кликнуть вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Синхронизируем поисковую строку с URL при навигации
  useEffect(() => {
    if (location.pathname === "/catalog") {
      const params = new URLSearchParams(location.search);
      const searchParam = params.get("search") || "";
      setSearchTerm(searchParam);
    } else {
      setSearchTerm("");
    }
  }, [location]);

  const handleLanguageChange = (lang: Language) => {
    dispatch(setLanguage(lang));
  };

  const { categories = [], isLoading } = useBookCategories();

  const navigationItems = [
    { label: t.nav.bestseller, path: "/bestseller" },
    { label: t.nav.catalog, path: "/catalog" },
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    localStorage.setItem("bookstore_search", term);
  };

  // Обработчик отправки поискового запроса
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
    }
  };

  // Обработчик клика по иконке поиска (мобильная версия)
  const handleSearchIconClick = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen && searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      {/* Top Promo Bar */}
      <div className='bg-linear-to-r from-gray-800 to-gray-900 text-white py-2 px-10'>
        <div className='container-custom flex justify-between items-center'>
          <div className='flex items-center gap-2 text-sm'>
            <LocalShipping className='w-4 h-4 text-blue-300/50' />
            <span className='text-gray-300/50'>{t.promo}</span>
          </div>
          <div className='hidden md:flex items-center gap-4 text-sm text-gray-300/50'>
            <span>{t.storeLocator}</span>
            <span>{t.helpContact}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className='sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-800 px-10'>
        <div className='container-custom'>
          <div className='flex flex-col md:flex-row gap-4 py-4'>
            {/* Top Row */}
            <div className='flex w-full items-center justify-between'>
              {/* Left: Menu & Logo */}
              <div className='flex items-center gap-4 md:gap-8'>
                <button
                  className='md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  <MenuIcon className='dark:text-gray-300' />
                </button>
                <Link
                  to='/'
                  className='flex items-center gap-2 no-underline pl-4'
                >
                  <Logo />
                </Link>

                {/* Desktop Navigation */}
                <nav className='hidden lg:flex gap-6 ml-8 items-center'>
                  {/* Pamata linki */}
                  {navigationItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      className='font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors py-2 relative group'
                    >
                      {item.label}
                      <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300'></span>
                    </Link>
                  ))}

                  {/* More dropdown */}
                  <div className='relative' ref={moreMenuRef}>
                    <button
                      className='flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors group py-2'
                      onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                    >
                      {t.more}
                      <ArrowDropDown
                        className={`${
                          moreMenuOpen ? 'rotate-180' : ''
                        } transition-transform duration-200`}
                      />
                    </button>

                    {/* Dropdown panel */}
                    {moreMenuOpen && !isLoading && categories && (
                      <div className='absolute top-full mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50 border border-gray-200 dark:border-gray-700 overflow-hidden'>
                        <div className='p-2'>
                          <h3 className='px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700'>
                            {t.categories || 'Categories'}
                          </h3>
                          {categories.map((category) => (
                            <Link
                              key={category}
                              to={`/catalog?category=${encodeURIComponent(
                                category
                              )}`}
                              className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:text-primary dark:hover:text-primary'
                            >
                              {category}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </nav>
              </div>

              {/* Right: Actions */}
              <div className='flex items-center gap-2 md:gap-4'>
                {/* Theme and Language for desktop */}
                <div className='hidden md:flex items-center gap-3 mr-4'>
                  <div className='relative group'>
                    <ThemeToggle />
                    <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap'>
                      Theme
                    </div>
                  </div>
                  <div className='relative group'>
                    <LanguageToggle
                      currentLanguage={currentLanguage}
                      handleLanguageChange={handleLanguageChange}
                    />
                    <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap'>
                      Language
                    </div>
                  </div>
                </div>

                {/* Desktop Search */}
                <div className='hidden lg:flex relative'>
                  <form
                    onSubmit={handleSearchSubmit}
                    className='relative rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-64 lg:w-80'
                  >
                    <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400'>
                      <Search className='w-5 h-5' />
                    </div>
                    <input
                      type='text'
                      placeholder={t.searchPlaceholder}
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className='w-full pl-10 pr-4 py-2 bg-transparent outline-none dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400'
                    />
                  </form>
                </div>

                {/* Mobile Search Button */}
                <button
                  className='lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
                  onClick={handleSearchIconClick}
                >
                  <Search className='dark:text-gray-300' />
                </button>

                {/* Wishlist Button */}
                <div className='relative group'>
                  <Link
                    to='/catalog?wishlist=true'
                    className='relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center'
                  >
                    {wishlist.length > 0 ? (
                      <Favorite className='w-6 h-6 text-red-500' />
                    ) : (
                      <FavoriteBorder className='w-6 h-6 dark:text-gray-300 text-gray-600' />
                    )}
                    {wishlist.length > 0 && (
                      <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold text-shadow-lg'>
                        {wishlist.length > 9 ? '9+' : wishlist.length}
                      </span>
                    )}
                  </Link>
                  <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap'>
                    Wishlist
                  </div>
                </div>

                {/* Cart Button */}             
                <Link to="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 dark:text-gray-300 text-gray-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                {user?.isAuthenticated ? (
                  <div className='relative group'>
                    <Link
                      to='/dashboard'
                      className='flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
                    >
                      <Person className='w-6 h-6 dark:text-gray-300 text-gray-600' />
                    </Link>
                    <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap'>
                      My Account
                    </div>
                  </div>
                ) : (
                  <div className='relative group'>
                    <Link
                      to='/login'
                      className='flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
                    >
                      <LoginIcon className='w-6 h-6 dark:text-gray-300 text-gray-600' />
                    </Link>
                    <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap'>
                      Sign In
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Search Bar */}
            {searchOpen && (
              <div className='w-full md:hidden mt-2'>
                <form
                  onSubmit={handleSearchSubmit}
                  className='relative rounded-full bg-gray-100 dark:bg-gray-800 w-full'
                >
                  <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400'>
                    <Search className='w-5 h-5' />
                  </div>
                  <input
                    type='text'
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className='w-full pl-10 pr-4 py-2 bg-transparent outline-none dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400'
                    autoFocus
                  />
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className='fixed inset-0 md:hidden z-50'>
            {/* Overlay */}
            <div
              className='absolute inset-0 bg-black/50 backdrop-blur-sm'
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <div className='absolute left-0 top-0 h-full w-76 bg-white dark:bg-gray-900 shadow-xl animate-slide-in-left z-50'>
              <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800'>
                <h2 className='text-xl font-bold text-foreground'>{t.menu}</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg'
                >
                  <Close className='dark:text-gray-300' />
                </button>
              </div>
              <nav className='p-4'>
                {navigationItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className='block py-3 mb-1 px-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Kategorijas mobile versijā */}
                {!isLoading && categories && (
                  <div className='mt-6'>
                    <h3 className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-3 px-2'>
                      {t.categories || 'Categories'}
                    </h3>
                    <div className='space-y-1'>
                      {categories.map((category) => (
                        <Link
                          key={category}
                          to={`/catalog?category=${encodeURIComponent(
                            category
                          )}`}
                          className='block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hover:text-primary dark:hover:text-primary'
                          onClick={() => setMobileOpen(false)}
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Theme and Language */}
                <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-800'>
                  <div className='mb-4'>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                      Theme
                    </h3>
                    <ThemeToggle />
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                      Language
                    </h3>
                    <LanguageToggle
                      currentLanguage={currentLanguage}
                      handleLanguageChange={handleLanguageChange}
                    />
                  </div>
                </div>

                {/* User Section */}
                <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-800'>
                  {user?.isAuthenticated ? (
                    <div className='flex flex-col gap-3'>
                      <div className='flex items-center gap-3 px-2 py-2 rounded-lg bg-gray-100 dark:bg-gray-800'>
                        <Person className='text-gray-600 dark:text-gray-400' />
                        <span className='text-sm text-gray-700 dark:text-gray-300'>
                          {user.email || 'My account'}
                        </span>
                      </div>

                      <Link
                        to='/dashboard'
                        onClick={() => setMobileOpen(false)}
                        className='flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                      >
                        <Person className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                        <span className='text-gray-700 dark:text-gray-300'>
                          Dashboard
                        </span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className='flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left'
                      >
                        <Logout className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                        <span className='text-gray-700 dark:text-gray-300'>
                          Logout
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className='flex flex-col gap-3'>
                      <Link
                        to='/login'
                        onClick={() => setMobileOpen(false)}
                        className='flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                      >
                        <LoginIcon className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                        <span className='text-gray-700 dark:text-gray-300'>
                          Sign in
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
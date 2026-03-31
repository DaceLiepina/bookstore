import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FilterList,
  GridView,
  ViewList,
  ClearAll,
  ExpandMore,
  ExpandLess,
  Star,
  FavoriteBorder,
  Favorite,
  Inventory,
  ShoppingCart,
} from '@mui/icons-material';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import { useGetBooksQuery, useGetLocalBooksQuery } from '../api/bookApi';
import BookCard from '../components/ui/BookCard';
import { type Book } from '../types/book';
import { useAppSelector } from '../app/hooks';
import { translations } from '../features/language/translations';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { getFoundBooksText, pluralRu, pluralSimple } from '../utils/plural';

const Catalog: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'rating'>('title');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const t = translations[currentLanguage].catalog;

  const { user } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('search') || '';
  const categoryParam = queryParams.get('category') || '';
  const wishlistParam = queryParams.get('wishlist') === 'true';

  const [localSearchTerm, setLocalSearchTerm] = useState(searchParam);
  const { wishlist, toggleWishlist, isInWishlist, clearWishlist } =
    useWishlist();

  // Fetch data with RTK Query
  const {
    data: apiBooks = [],
    isLoading: isLoadingApi,
    error: apiError,
  } = useGetBooksQuery();
  const { data: localBooks = [], isLoading: isLoadingLocal } =
    useGetLocalBooksQuery();

  // Combine all books
  const allBooks: Book[] = [...apiBooks, ...localBooks];

  // Filter books
  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch = localSearchTerm
      ? book.title.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        book.description
          ?.toLowerCase()
          .includes(localSearchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(localSearchTerm.toLowerCase())
      : true;

    const matchesCategory =
      selectedCategory === 'all' || book.category === selectedCategory;

    const matchesPrice =
      book.price >= priceRange[0] && book.price <= priceRange[1];

    const matchesWishlist = wishlistParam
      ? wishlist.some((w) => w.id === book.id)
      : true;

    return matchesSearch && matchesCategory && matchesPrice && matchesWishlist;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'price') return a.price - b.price;
    return b.rating - a.rating;
  });

  // Get unique categories
  const categories = ['all', ...new Set(allBooks.map((book) => book.category))];

  // Handle URL category param
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Сброс фильтров
  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 100]);
    setSortBy('title');
    setLocalSearchTerm('');
  };

  const dispatch = useAppDispatch();

  const handleAddToCart = (book: Book) => {
    if (!book || !book.stock || book.stock <= 0) return;
    dispatch(addToCart(book));
    console.log('Added to cart:', book);
  };

  // Функция для обработки добавления в wishlist с проверкой аутентификации
  const handleWishlistToggle = (book: Book) => {
    if (!user?.isAuthenticated) {
      alert('Please login to add to wishlist');
      return;
    }
    toggleWishlist(book);
  };

  if (isLoadingApi || isLoadingLocal) {
    return (
      <div className='container-custom py-12'>
        <CircularProgress />
      </div>
    );
  }

  if (apiError) {
    return (
      <div className='container-custom py-12'>
        <Alert severity='error' className='mb-4'>
          {t.error}
        </Alert>
      </div>
    );
  }

  // Max price for slider
  const maxPrice = Math.ceil(Math.max(...allBooks.map((b) => b.price), 100));

  return (
    <div className='container-custom py-8 px-4 md:px-6 lg:px-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-4xl py-1 font-bold mb-2 bg-linear-to-b from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          {wishlistParam ? t.wTitle : t.title}
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          {wishlistParam
            ? (() => {
                const count = wishlist.length;

                if (currentLanguage === 'ru') {
                  return `${count} ${pluralRu(count, t.wRBooks!)} ${
                    t.wishlist
                  }`;
                }

                return `${count} ${pluralSimple(count, t.wSBooks!)} ${
                  t.wishlist
                }`;
              })()
            : `${t.totalBooks}: ${allBooks.length}`}
        </p>
      </div>

      {/* Controls Bar */}
      <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
          {/* Left side: Info and filters toggle */}
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <FilterList className='text-primary' />
              <h3 className='font-semibold text-lg dark:text-gray-200'>
                {t.filters.title}
              </h3>
            </div>

            <Button
              variant='outlined'
              size='small'
              onClick={() => setShowFilters(!showFilters)}
              endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
              className='border-primary text-primary hover:bg-primary/10 dark:text-primary dark:border-primary'
            >
              {showFilters
                ? t.filters.hide || 'Hide Filters'
                : t.filters.show || 'Show Filters'}
            </Button>

            {localSearchTerm && (
              <Chip
                label={`Search: "${localSearchTerm}"`}
                onDelete={() => setLocalSearchTerm('')}
                color='primary'
                variant='outlined'
                className='dark:border-primary dark:text-primary'
              />
            )}
          </div>

          {/* Right side: Sort and view controls */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex items-center gap-4'>
              <FormControl size='small' className='min-w-[150px]'>
                <InputLabel className='dark:text-gray-200'>
                  {t.sortBy}
                </InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  label={t.sortBy}
                  className='dark:bg-gray-800'
                >
                  <MenuItem value='title'>{t.sortOptions.title}</MenuItem>
                  <MenuItem value='price'>{t.sortOptions.price}</MenuItem>
                  <MenuItem value='rating'>{t.sortOptions.rating}</MenuItem>
                </Select>
              </FormControl>

              <div className='flex border border-gray-300 rounded-lg overflow-hidden dark:border-gray-700'>
                <button
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setViewMode('grid')}
                  title={t.viewGrid || 'Grid View'}
                >
                  <GridView />
                </button>
                <button
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setViewMode('list')}
                  title={t.viewList || 'List View'}
                >
                  <ViewList />
                </button>
              </div>
            </div>

            <Button
              variant='outlined'
              startIcon={<ClearAll />}
              onClick={resetFilters}
              className='border-gray-300 hover:border-red-500 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-500 dark:hover:text-red-400'
            >
              {t.resetFilters}
            </Button>

            {wishlistParam && wishlist.length > 0 && (
              <Button
                variant='outlined'
                color='error'
                onClick={() => {
                  if (window.confirm('Clear all items from wishlist?')) {
                    clearWishlist();
                  }
                }}
              >
                Clear Wishlist
              </Button>
            )}
          </div>
        </div>

        {/* Expandable Filters */}
        <Collapse in={showFilters}>
          <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {/* Categories */}
              <div>
                <h4 className='font-medium mb-3 dark:text-gray-300'>
                  {t.filters.categories}
                </h4>
                <div className='flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1'>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedCategory === category
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className='font-medium mb-3 dark:text-gray-300'>
                  {t.filters.priceRange}
                </h4>
                <div className='px-2'>
                  <Slider
                    value={priceRange}
                    onChange={(_, newValue) =>
                      setPriceRange(newValue as [number, number])
                    }
                    valueLabelDisplay='auto'
                    valueLabelFormat={(value) => `€${value}`}
                    min={0}
                    max={maxPrice}
                    step={5}
                    className='text-primary'
                  />
                  <div className='flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2'>
                    <span>€{priceRange[0]}</span>
                    <span>€{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h4 className='font-medium mb-3 dark:text-gray-300'>
                  Statistics
                </h4>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='bg-gray-50 dark:bg-gray-900 p-3 rounded-lg'>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Showing
                    </p>
                    <p className='text-2xl font-bold dark:text-gray-200'>
                      {sortedBooks.length}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      of {allBooks.length} books
                    </p>
                  </div>
                  <div className='bg-gray-50 dark:bg-gray-900 p-3 rounded-lg'>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Average Price
                    </p>
                    <p className='text-2xl font-bold dark:text-gray-200'>
                      €
                      {(
                        allBooks.reduce((sum, book) => sum + book.price, 0) /
                        Math.max(allBooks.length, 1)
                      ).toFixed(2)}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      per book
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </div>

      {/* Books Grid/List */}
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <Chip
            label={getFoundBooksText(sortedBooks.length, t, currentLanguage)}
            sx={(theme) => ({
              fontWeight: 500,
              borderRadius: 2,

              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[800]
                  : theme.palette.grey[200],

              color:
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
            })}
            className='text-lg py-2 px-4'
          />

          {user?.isAuthenticated && user.role === 'admin' && (
            <Link
              to='/books/add'
              className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-md hover:shadow-lg dark:hover:bg-purple-700'
            >
              <span className='font-medium'>{t.addNewBook}</span>
            </Link>
          )}
        </div>

        {sortedBooks.length === 0 ? (
          <div className='text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl'>
            <p className='text-gray-500 dark:text-gray-400 text-lg mb-4'>
              {t.noBooksFound}
            </p>
            <Button
              variant='contained'
              onClick={resetFilters}
              className='bg-primary hover:bg-primary-dark'
            >
              Clear All Filters
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View - Максимум 4 колонки
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {sortedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onAddToCart={() => handleAddToCart(book)}
                onToggleFavorite={() => handleWishlistToggle(book)}
              />
            ))}
          </div>
        ) : (
          // List View - Картинка слева, информация справа, ограниченная высота
          <div className='space-y-4'>
            {sortedBooks.map((book) => (
              <div
                key={book.id}
                className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow h-54 flex'
              >
                {/* Image - Left side */}
                <div className='w-32 md:w-40 h-full shrink-0'>
                  <Link to={`/book/${book.id}`} className='block h-full'>
                    <img
                      src={book.image}
                      alt={book.title}
                      className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                    />
                  </Link>
                </div>

                {/* Content - Right side */}
                <div className='flex-1 p-4 flex flex-col justify-between min-w-0'>
                  {/* Top section */}
                  <div className='flex-1 overflow-hidden'>
                    <div className='flex items-start justify-between mb-2'>
                      <div className='min-w-0'>
                        <Link to={`/book/${book.id}`}>
                          <h3 className='font-semibold text-lg truncate hover:text-primary transition-colors dark:text-gray-200'>
                            {book.title}
                          </h3>
                        </Link>
                        <p className='text-gray-600 text-sm dark:text-gray-400'>
                          by {book.author}
                        </p>
                      </div>
                      <IconButton
                        size='small'
                        onClick={() => handleWishlistToggle(book)}
                        className='text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                      >
                        {isInWishlist(book.id.toString()) ? (
                          <Favorite className='text-red-500' />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>
                    </div>

                    <div className='flex items-center gap-2 mb-2'>
                      <div className='flex items-center'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(book.rating)
                                ? 'text-yellow-500'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        {book.rating.toFixed(1)}
                      </span>
                    </div>

                    <div className='mb-2'>
                      <span className='inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded dark:text-gray-300'>
                        {book.category}
                      </span>
                      {book.bestseller && (
                        <span className='inline-block ml-2 px-2 py-1 bg-secondary text-white text-xs rounded'>
                          Bestseller
                        </span>
                      )}
                      {book.isLocal && (
                        <span className='inline-block ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs rounded'>
                          Local
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom section - Price and Actions */}
                  <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700'>
                    <div className='flex items-center gap-3'>
                      {book.sale && book.salePrice ? (
                        <div className='flex items-center gap-2'>
                          <span className='text-2xl font-bold text-red-600 dark:text-red-400'>
                            €{book.salePrice.toFixed(2)}
                          </span>
                          <span className='text-gray-400 line-through dark:text-gray-500'>
                            €{book.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className='text-2xl font-bold dark:text-gray-200'>
                          €{book.price.toFixed(2)}
                        </span>
                      )}

                      {book.stock && book.stock > 0 ? (
                        <div className='flex items-center gap-1 text-sm text-green-600 dark:text-green-400'>
                          <Inventory className='w-4 h-4' />
                          <span>{book.stock} in stock</span>
                        </div>
                      ) : (
                        <span className='text-sm text-red-600 dark:text-red-400'>
                          Out of stock
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(book)}
                      disabled={!book.stock || book.stock <= 0}
                      className={`bg-blue-600 text-white px-8 py-3 rounded-lg
                    hover:bg-blue-700 transition-all
                    active:scale-95 active:opacity-80
                    flex items-center gap-2
                    ${
                      !book.stock || book.stock <= 0
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer'
                    }
                  `}
                    >
                      <ShoppingCart className='w-5 h-5' />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;

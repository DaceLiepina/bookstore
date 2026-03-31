import React, { useMemo } from 'react';
import {
  ArrowForward,
  LocalFireDepartment,
  TrendingUp,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { translations } from '../features/language/translations';
import BookCard from '../components/ui/BookCard';
import {
  useGetBestsellersQuery,
  useGetBooksQuery,
  useGetLocalBooksQuery,
} from '../api/bookApi';
import { type Book } from '../types/book';
import { CircularProgress, Alert } from '@mui/material';
import heroImage from '../assets/images/book_hero.png';
import readingImage from '../assets/images/reading.jpeg';

const Home: React.FC = () => {
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const t = translations[currentLanguage].home;

  const { data: bestsellers = [], isLoading, error } = useGetBestsellersQuery();
  const { data: apiBooks = [] } = useGetBooksQuery();
  const { data: localBooks = [] } = useGetLocalBooksQuery();

  const homeBestsellers = bestsellers.slice(0, 4);

  const categories = useMemo(() => {
    const allBooks = [...apiBooks, ...localBooks];
    const getCategoryCount = (categoryName: string) =>
      allBooks.filter((book) => book.category === categoryName).length;

    return [
      {
        id: 'fiction',
        name: t.categories.fiction,
        count: getCategoryCount('Fiction'),
        url: '/catalog?category=Fiction',
        color: 'bg-blue-100 text-blue-800',
      },
      {
        id: 'epic',
        name: t.categories.epic,
        count: getCategoryCount('Epic'),
        url: '/catalog?category=Epic',
        color: 'bg-green-100 text-green-800',
      },
      {
        id: 'play',
        name: t.categories.play,
        count: getCategoryCount('Play'),
        url: '/catalog?category=Play',
        color: 'bg-purple-100 text-purple-800',
      },
      {
        id: 'fantasy',
        name: t.categories.fantasy,
        count: getCategoryCount('Fantasy'),
        url: '/catalog?category=Fantasy',
        color: 'bg-yellow-100 text-yellow-800',
      },
      {
        id: 'children',
        name: t.categories.children,
        count: getCategoryCount('Children'),
        url: '/catalog?category=Children',
        color: 'bg-pink-100 text-pink-800',
      },
      {
        id: 'romance',
        name: t.categories.romance,
        count: getCategoryCount('Romance'),
        url: '/catalog?category=Romance',
        color: 'bg-red-100 text-red-800',
      },
    ];
  }, [apiBooks, localBooks, t.categories]);

  return (
    <div className='space-y-12 md:space-y-16 text-gray-700 dark:bg-gray-900 dark:text-gray-400'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-linear-to-r from-gray-100 to-blue-900 text-gray-900 dark:from-gray-800 dark:to-blue-950 dark:text-white pl-10'>
        <div className='container-custom py-16 md:py-24'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
            <div>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                {t.heroTitle}
              </h1>
              <p className='text-xl mb-8 opacity-90'>{t.heroSubtitle}</p>
              <div className='flex flex-wrap gap-4 group '>
                <button className='btn-secondary flex items-center gap-2'>
                  {t.shopNow}
                  <ArrowForward className='transform group-hover:translate-x-1 transition-transform' />
                </button>
                <form action='/bestseller'>
                  <button className='border-2 border-white dark:border-gray-500 text-gray-800 dark:text-blue-500 px-6 py-3 rounded-lg hover:bg-white/10 shadow-sm hover:shadow-lg hover:shadow-blue-300/50 dark:hover:shadow-blue-600/50 transition-all active:scale-95 cursor-pointer'>
                    {t.viewBestsellers}
                  </button>
                </form>
              </div>
            </div>
            <div className='hidden md:block px-18'>
              <div className='relative'>
                <img
                  src={`${heroImage}`}
                  alt='Books Collection'
                  className='rounded-2xl'
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className='container-custom px-10'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold mb-2'>
            <TrendingUp className='text-purple-700 pr-2' />
            {t.browseCategories}
          </h2>
          <p className='text-gray-600'>{t.browseCategoriesSubtitle}</p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4'>
          {categories.map((category) => (
            <Link to={category.url}>
              <div
                key={category.id}
                className='card-hover bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm hover:shadow-lg hover:shadow-blue-300/50 dark:hover:shadow-blue-600/50 transition-all'
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${category.color} mb-3`}
                >
                  <span className='text-lg font-semibold'>
                    {category.name.charAt(0)}
                  </span>
                </div>
                <h3 className='font-semibold mb-1'>{category.name}</h3>
                <p className='text-sm text-gray-500'>
                  {category.count} {t.books}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className='container-custom px-10'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <LocalFireDepartment className='text-orange-600' />
              <h2 className='text-3xl font-bold'>{t.bestsellers}</h2>
            </div>
            <p className='text-gray-600'>{t.bestsellersSubtitle}</p>
          </div>
          <Link
            to='/catalog'
            className='flex items-center gap-1 text-primary hover:underline mt-2 sm:mt-0'
          >
            {t.viewAll}
            <ArrowForward className='w-5 h-5' />
          </Link>
        </div>

        {isLoading ? (
          <div className='flex justify-center py-12'>
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity='error' className='mb-6'>
            {t.bestsellersError}
          </Alert>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {homeBestsellers.map((book: Book) => (
              <BookCard
                key={book.id}
                book={book}
                onAddToCart={() => console.log('Add to cart:', book)}
                onToggleFavorite={() => console.log('Toggle favorite:', book)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className='container-custom px-10 pb-15'>
        <div className='bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
            <div>
              <h2 className='text-3xl font-bold mb-4'>{t.newsletterTitle}</h2>
              <p className='text-gray-600 mb-6'>{t.newsletterSubtitle}</p>
              <div className='flex flex-col sm:flex-row gap-2'>
                <input
                  type='email'
                  placeholder={t.emailPlaceholder}
                  className='grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200'
                />
                <button className='btn-secondary px-6 py-3 whitespace-nowrap'>
                  {t.subscribe}
                </button>
              </div>
              <p className='mt-4 text-sm text-gray-500'>{t.privacyPolicy}</p>
            </div>
            <div className='hidden md:block'>
              <img
                src={`${readingImage}`}
                alt='Reading'
                className='rounded-xl shadow-lg'
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
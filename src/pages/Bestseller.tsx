import React from 'react';
import { useGetBestsellersQuery } from '../api/bookApi';
import BookCard from '../components/ui/BookCard';
import { type Book } from '../types/book';
import { CircularProgress, Alert } from '@mui/material';
import { useAppSelector } from '../app/hooks';
import { translations } from '../features/language/translations';

const Bestseller: React.FC = () => {
  const { data: bestsellers = [], isLoading, error } = useGetBestsellersQuery();

  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const t = translations[currentLanguage].bestseller;

  if (isLoading) {
    return (
      <div className='container-custom py-12'>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className='container-custom py-12'>
        <Alert severity='error'>
          {t.error}
        </Alert>
      </div>
    );
  }

  return (
    <div className='container-custom py-8 px-10 text-foreground'>
      <h1 className='text-4xl font-bold mb-2'>{t.title}</h1>
      <p className='text-muted-foreground mb-8'>{t.subtitle}</p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {bestsellers.map((book: Book) => (
          <BookCard
            key={book.id}
            book={book}
            onAddToCart={() => console.log('Add to cart:', book)}
            onToggleFavorite={() => console.log('Toggle favorite:', book)}
          />
        ))}
      </div>
    </div>
  );

};

export default Bestseller;

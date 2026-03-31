import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookForm from '../components/book/BookForm';
import { useGetLocalBooksQuery } from '../api/bookApi';
import { CircularProgress, Alert, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import type { LocalBook, BookFormData } from '../types/book';
import { useAppSelector } from '../app/hooks';
import { translations } from '../features/language/translations';

// Функция преобразования LocalBook в BookFormData
const convertToFormData = (book: LocalBook): BookFormData => {
  return {
    title: book.title || '',
    author: book.author || '',
    price: book.price || 0,
    rating: book.rating || 0,
    image: book.image || '',
    category: book.category || '',
    description: book.description || '',
    isbn: book.isbn || '',
    pages: book.pages || 0,
    publisher: book.publisher || '',
    publicationDate:
      book.publicationDate || new Date().toISOString().split('T')[0],
    language: book.language || 'English',
    bestseller: book.bestseller || false,
    sale: book.sale || false,
    salePrice: book.salePrice || 0,
    stock: book.stock || 0,
  };
};

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: localBooks = [], isLoading } = useGetLocalBooksQuery();

  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const t = translations[currentLanguage].bookPage;

  const book = localBooks.find((b) => b.id === id);

  useEffect(() => {
    if (!isLoading && !book) {
      setTimeout(() => navigate('/catalog'), 3000);
    }
  }, [isLoading, book, navigate]);

  if (isLoading) {
    return (
      <div className='container-custom py-12'>
        <CircularProgress />
      </div>
    );
  }

  if (!book) {
    return (
      <div className='container-custom py-12 px-10'>
        <Alert severity='error' className='mb-4'>
          {t.notFound}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/catalog')}>
          {t.goBack}
        </Button>
      </div>
    );
  }

  const initialValues = convertToFormData(book);

  return <BookForm initialValues={initialValues} isEdit={true} />;
};

export default EditBook;

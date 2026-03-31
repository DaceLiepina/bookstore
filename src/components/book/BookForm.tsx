import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  useAddLocalBookMutation,
  useUpdateLocalBookMutation,
} from '../../api/bookApi';
import { type BookFormData } from '../../types/book';
import { useCurrentUser, useIsAdmin, useAppSelector } from '../../app/hooks';
import placeholder from "../../assets/placeholder_book.svg"
import { translations } from '../../features/language/translations';
import type { BookFormTranslations } from '../../features/language/types';

interface BookFormProps {
  initialValues?: BookFormData;
  isEdit?: boolean;
}

const getValidationSchema = (t: BookFormTranslations) => Yup.object({
  title: Yup.string().required(t.errors.required),
  author: Yup.string().required(t.errors.required),
  price: Yup.number()
    .min(0, t.errors.negativePrice)
    .required(t.errors.required),
  rating: Yup.number()
    .min(0, t.errors.ratingRange)
    .max(5, t.errors.ratingRange),
  image: Yup.string().url(t.errors.invalidUrl).required(t.errors.required),
  category: Yup.string().required(t.errors.required),
  description: Yup.string(),
  isbn: Yup.string(),
  pages: Yup.number().min(1, t.errors.minPages),
  publisher: Yup.string(),
  publicationDate: Yup.string(),
  language: Yup.string(),
  bestseller: Yup.boolean(),
  sale: Yup.boolean(),
  salePrice: Yup.number()
    .min(0, t.errors.negativePrice)
    .when('sale', {
      is: true,
      then: (schema) => schema.required(t.errors.required),
    }),
  stock: Yup.number().min(0, t.errors.negativeStock),
});

const BookForm: React.FC<BookFormProps> = ({
  initialValues,
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const isAdminUser = useIsAdmin();

  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const t = translations[currentLanguage];
  const tForm = t.bookForm;
  const tHome = t.home;

  const [addBook, { isLoading: isAdding }] = useAddLocalBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateLocalBookMutation();

  const validationSchema = useMemo(() => getValidationSchema(tForm), [tForm]);

  const formik = useFormik({
    initialValues: initialValues || {
      title: '',
      author: '',
      price: 0,
      rating: 0,
      image: '',
      category: '',
      description: '',
      isbn: '',
      pages: 0,
      publisher: '',
      publicationDate: new Date().toISOString().split('T')[0],
      language: tForm.languages.english,
      bestseller: false,
      sale: false,
      salePrice: 0,
      stock: 10,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit && id) {
          // Проверяем права на редактирование
          const localBooks = JSON.parse(
            localStorage.getItem('localBooks') || '[]'
          );
          const book = localBooks.find((b: any) => b.id === id);

          if (book && book.addedBy !== currentUser?.email && !isAdminUser) {
            alert(tForm.errors.onlyOwnBooks);
            return;
          }

          await updateBook({ id, updates: values }).unwrap();
          alert(tForm.success.updated);
        } else {
          await addBook(values).unwrap();
          alert(tForm.success.added);
        }
        navigate('/catalog');
      } catch (error) {
        console.error('Error saving book:', error);
        alert(tForm.errors.saveError);
      }
    },
  });

  const categories = [
    tHome.categories.fiction,
    tHome.categories.nonFiction,
    tHome.categories.science,
    tHome.categories.business,
    tHome.categories.children,
    tHome.categories.romance,
    tHome.categories.fantasy,
    tHome.categories.mystery,
    tHome.categories.biography,
    tHome.categories.history,
  ];

  const languages = [
    tForm.languages.english,
    tForm.languages.german,
    tForm.languages.french,
    tForm.languages.spanish,
    tForm.languages.russian,
    tForm.languages.chinese,
  ];

  if (!currentUser?.isAuthenticated) {
    return (
      <div className='container-custom mt-8 px-10'>
        <Alert severity='warning'>{tForm.errors.loginRequired}</Alert>
      </div>
    );
  }

  if (isEdit && !isAdminUser) {
    // Для обычных пользователей проверяем, их ли это книга
    const localBooks = JSON.parse(localStorage.getItem('localBooks') || '[]');
    const book = id ? localBooks.find((b: any) => b.id === id) : null;

    if (book && book.addedBy !== currentUser?.email) {
      return (
        <div className='container-custom mt-8 px-10'>
          <Alert severity='error'>{tForm.errors.onlyOwnBooks}</Alert>
        </div>
      );
    }
  }

  return (
    <div className='container-custom py-8 px-10 max-w-4xl mx-auto'>
      <h1 className='text-4xl font-bold mb-2'>
        {isEdit ? tForm.titleEdit : tForm.titleAdd}
      </h1>
      <p className='text-gray-600 mb-8'>
        {isEdit
          ? tForm.subtitleEdit
          : tForm.subtitleAdd}
      </p>

      <form onSubmit={formik.handleSubmit} className='space-y-8'>
        {/* Basic Information */}
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
          <h2 className='text-xl font-semibold mb-6'>{tForm.sections.basicInfo}</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <TextField
              fullWidth
              label={`${tForm.labels.title} *`}
              name='title'
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              className='bg-white dark:bg-gray-800'
            />

            <TextField
              fullWidth
              label={`${tForm.labels.author} *`}
              name='author'
              value={formik.values.author}
              onChange={formik.handleChange}
              error={formik.touched.author && Boolean(formik.errors.author)}
              helperText={formik.touched.author && formik.errors.author}
            />

            <TextField
              fullWidth
              label={`${tForm.labels.price} *`}
              name='price'
              type='number'
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            />

            <TextField
              fullWidth
              label={tForm.labels.rating}
              name='rating'
              type='number'
              value={formik.values.rating}
              onChange={formik.handleChange}
              error={formik.touched.rating && Boolean(formik.errors.rating)}
              helperText={formik.touched.rating && formik.errors.rating}
              InputProps={{ inputProps: { min: 0, max: 5, step: 0.1 } }}
            />

            <FormControl
              fullWidth
              error={formik.touched.category && Boolean(formik.errors.category)}
            >
              <InputLabel>{tForm.labels.category} *</InputLabel>
              <Select
                name='category'
                value={formik.values.category}
                onChange={formik.handleChange}
                label={`${tForm.labels.category} *`}
               sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? '#fff' : '#1f2937',
                  color: (theme) =>
                    theme.palette.mode === 'light' ? '#111827' : '#f3f4f6',
                  '.MuiSelect-icon': {
                    color: (theme) =>
                      theme.palette.mode === 'light' ? '#111827' : '#f3f4f6',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'light' ? '#fff' : '#1f2937',
                      color: (theme) =>
                        theme.palette.mode === 'light' ? '#111827' : '#f3f4f6',
                    },
                  },
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <div className='text-red-500 text-xs mt-1'>
                  {formik.errors.category}
                </div>
              )}
            </FormControl>

            <TextField
              fullWidth
              label={`${tForm.labels.image} *`}
              name='image'
              value={formik.values.image}
              onChange={formik.handleChange}
              error={formik.touched.image && Boolean(formik.errors.image)}
              helperText={formik.touched.image && formik.errors.image}
              placeholder={`${placeholder}`}
            />
          </div>
        </div>

        {/* Description */}
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
          <h2 className='text-xl font-semibold mb-6'>{tForm.sections.description}</h2>
          <TextField
            fullWidth
            label={tForm.labels.description}
            name='description'
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            placeholder={tForm.labels.description}
          />
        </div>

        {/* Additional Information */}
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
          <h2 className='text-xl font-semibold mb-6'>{tForm.sections.additionalInfo}</h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
            <TextField
              fullWidth
              label={tForm.labels.isbn}
              name='isbn'
              value={formik.values.isbn}
              onChange={formik.handleChange}
            />

            <TextField
              fullWidth
              label={tForm.labels.pages}
              name='pages'
              type='number'
              value={formik.values.pages}
              onChange={formik.handleChange}
              InputProps={{ inputProps: { min: 1 } }}
            />

            <TextField
              fullWidth
              label={tForm.labels.stock}
              name='stock'
              type='number'
              value={formik.values.stock}
              onChange={formik.handleChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <TextField
              fullWidth
              label={tForm.labels.publisher}
              name='publisher'
              value={formik.values.publisher}
              onChange={formik.handleChange}
            />

            <TextField
              fullWidth
              label={tForm.labels.publicationDate}
              name='publicationDate'
              type='date'
              value={formik.values.publicationDate}
              onChange={formik.handleChange}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>{tForm.labels.language}</InputLabel>
              <Select
                name='language'
                value={formik.values.language}
                onChange={formik.handleChange}
                label={tForm.labels.language}
                  sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'light' ? '#fff' : '#1f2937',
                      color: (theme) =>
                        theme.palette.mode === 'light' ? '#111827' : '#f3f4f6',
                      '.MuiSelect-icon': {
                        color: (theme) =>
                          theme.palette.mode === 'light' ? '#111827' : '#f3f4f6',
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'light' ? '#fff' : '#1f2937',
                          color: (theme) =>
                            theme.palette.mode === 'light' ? '#111827' : '#f3f4f6',
                        },
                      },
                    }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Flags */}
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
          <h2 className='text-xl font-semibold mb-6'>{tForm.sections.flags}</h2>

          <div className='flex flex-wrap gap-8'>
            <FormControlLabel
              control={
                <Checkbox
                  name='bestseller'
                  checked={formik.values.bestseller}
                  onChange={formik.handleChange}
                  color='primary'
                />
              }
              label={tForm.labels.bestseller}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name='sale'
                  checked={formik.values.sale}
                  onChange={formik.handleChange}
                  color='secondary'
                />
              }
              label={tForm.labels.sale}
            />
          </div>

          {formik.values.sale && (
            <div className='mt-6'>
              <TextField
                fullWidth
                label={`${tForm.labels.salePrice} *`}
                name='salePrice'
                type='number'
                value={formik.values.salePrice}
                onChange={formik.handleChange}
                error={
                  formik.touched.salePrice && Boolean(formik.errors.salePrice)
                }
                helperText={formik.touched.salePrice && formik.errors.salePrice}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                className='max-w-xs'
              />
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className='flex gap-4 pt-6'>
          <button
            type='submit'
            disabled={isAdding || isUpdating}
            className='bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
          >
            {isAdding || isUpdating ? (
              <>
                <CircularProgress size={20} color='inherit' />
                {isEdit ? tForm.buttons.updating : tForm.buttons.adding}
              </>
            ) : (
              <>{isEdit ? tForm.buttons.update : tForm.buttons.add}</>
            )}
          </button>

          <button
            type='button'
            onClick={() => navigate(-1)}
            className='px-8 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors'
          >
            {tForm.buttons.cancel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;

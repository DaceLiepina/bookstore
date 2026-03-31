import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Book, LocalBook } from '../types/book';
import bookImage from '../assets/images/book.jpeg';

// Интерфейс для книги из API
interface ApiBook {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publication_year: number;
  language: string;
  genre: string[];
  price: number;
  currency: string;
  stock: number;
  rating: number;
  reviews_count: number;
  cover_url: string;
  annotation: string;
}

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://alexh73.github.io/bookstore/src/data/',
  }),
  tagTypes: ['Books', 'LocalBooks', 'Bestsellers'],
  endpoints: (builder) => ({
    // Получение всех книг из API
    getBooks: builder.query<Book[], void>({
      query: () => 'data.json',
      transformResponse: (response: ApiBook[]) => {
        console.log('API books received:', response.length);

        // Преобразуем книги из API в нашу структуру
        return response.map((apiBook: ApiBook, index: number) => ({
          id: apiBook.id.toString(),
          title: apiBook.title,
          author: apiBook.author,
          price: apiBook.price,
          rating: apiBook.rating,
          image: apiBook.cover_url,
          category: apiBook.genre[0] || 'Fiction', // Берем первую категорию
          description: apiBook.annotation,
          isbn: apiBook.isbn,
          pages: 300, // API не предоставляет, ставим по умолчанию
          publisher: 'Unknown Publisher', // API не предоставляет
          publicationDate: `${apiBook.publication_year}-01-01`, // Преобразуем год в дату
          language: apiBook.language,
          bestseller: index < 8, // Первые 8 книг считаем бестселлерами
          sale: false, // В API нет информации о распродажах
          salePrice: apiBook.price,
          stock: apiBook.stock,
          tags: apiBook.genre,
        }));
      },
      providesTags: ['Books'],
    }),

    // Получение бестселлеров
    getBestsellers: builder.query<Book[], void>({
      query: () => 'data.json',
      transformResponse: (response: ApiBook[]) => {
        // Преобразуем и сортируем по рейтингу (по убыванию)

        // Преобразуем и фильтруем бестселлеры
        const allBooks = response
          .map((apiBook: ApiBook, _index: number) => ({
            id: apiBook.id.toString(),
            title: apiBook.title,
            author: apiBook.author,
            price: apiBook.price,
            rating: apiBook.rating,
            image: apiBook.cover_url,
            category: apiBook.genre[0] || 'Fiction',
            description: apiBook.annotation,
            isbn: apiBook.isbn,
            pages: 300,
            publisher: 'Unknown Publisher',
            publicationDate: `${apiBook.publication_year}-01-01`,
            language: apiBook.language,
            bestseller: true, // Помечаем как бестселлер
            sale: false,
            salePrice: apiBook.price,
            stock: apiBook.stock,
            tags: apiBook.genre,
          }))
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 20); // Берем топ-20

        return allBooks;
      },
      providesTags: ['Bestsellers'],
    }),

    // Получение книги по ID
    getBookById: builder.query<Book | null, string>({
      queryFn: async (id, _api, _extraOptions, baseQuery) => {
        try {
          // Сначала проверяем локальные книги
          const localBooks: LocalBook[] = JSON.parse(
            localStorage.getItem('localBooks') || '[]'
          );
          const localBook = localBooks.find((book) => book.id === id);

          if (localBook) {
            return { data: localBook };
          }

          // Ищем в API
          const result = await baseQuery('data.json');
          if (result.error) {
            return { error: result.error };
          }

          const apiBooks = result.data as ApiBook[];
          const apiBook = apiBooks.find((b: ApiBook) => b.id.toString() === id);

          if (apiBook) {
            // Преобразуем в нашу структуру
            const book: Book = {
              id: apiBook.id.toString(),
              title: apiBook.title,
              author: apiBook.author,
              price: apiBook.price,
              rating: apiBook.rating,
              image: apiBook.cover_url,
              category: apiBook.genre[0] || 'Fiction',
              description: apiBook.annotation,
              isbn: apiBook.isbn,
              pages: 300,
              publisher: 'Unknown Publisher',
              publicationDate: `${apiBook.publication_year}-01-01`,
              language: apiBook.language,
              bestseller: apiBook.rating >= 4.5, // Считаем бестселлером если рейтинг высокий
              sale: false,
              salePrice: apiBook.price,
              stock: apiBook.stock,
              tags: apiBook.genre,
            };
            return { data: book };
          }

          return { data: null };
        } catch (error: any) {
          console.error('Error in getBookById:', error);
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message,
            },
          };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Books', id }],
    }),

    // Получение локальных книг (остается без изменений)
    getLocalBooks: builder.query<LocalBook[], void>({
      queryFn: () => {
        try {
          const localBooks = JSON.parse(
            localStorage.getItem('localBooks') || '[]'
          );
          console.log('Local books loaded:', localBooks.length);
          return { data: localBooks };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message,
            },
          };
        }
      },
      providesTags: ['LocalBooks'],
    }),

    // Добавление локальной книги (остается без изменений)
    addLocalBook: builder.mutation<LocalBook, Partial<LocalBook>>({
      queryFn: (book) => {
        try {
          const localBooks: LocalBook[] = JSON.parse(
            localStorage.getItem('localBooks') || '[]'
          );
          const user = JSON.parse(
            localStorage.getItem('bookstore_user') || 'null'
          );

          const newBook: LocalBook = {
            ...book,
            id: `local_${Date.now()}`,
            localId: `local_${Date.now()}`,
            addedAt: new Date().toISOString(),
            addedBy: user?.email || 'anonymous',
            isLocal: true,
            rating: book.rating || 0,
            stock: book.stock || 10,
            price: book.price || 0,
            category: book.category || 'Other',
            image: book.image || `${bookImage}`,
            author: book.author || 'Unknown Author',
            title: book.title || 'Untitled Book',
            tags: [],
          } as LocalBook;

          localBooks.push(newBook);
          localStorage.setItem('localBooks', JSON.stringify(localBooks));
          console.log('Local book added:', newBook);

          return { data: newBook };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message,
            },
          };
        }
      },
      invalidatesTags: ['LocalBooks'],
    }),

    // Остальные методы без изменений...
    updateLocalBook: builder.mutation<
      LocalBook,
      { id: string; updates: Partial<LocalBook> }
    >({
      queryFn: ({ id, updates }) => {
        try {
          const localBooks: LocalBook[] = JSON.parse(
            localStorage.getItem('localBooks') || '[]'
          );
          const index = localBooks.findIndex(
            (book: LocalBook) => book.id === id
          );

          if (index === -1) {
            throw new Error('Book not found');
          }

          const updatedBook = { ...localBooks[index], ...updates };
          localBooks[index] = updatedBook;
          localStorage.setItem('localBooks', JSON.stringify(localBooks));

          return { data: updatedBook };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message,
            },
          };
        }
      },
      invalidatesTags: ['LocalBooks'],
    }),

    deleteLocalBook: builder.mutation<{ success: boolean }, string>({
      queryFn: (id) => {
        try {
          const localBooks: LocalBook[] = JSON.parse(
            localStorage.getItem('localBooks') || '[]'
          );
          const filteredBooks = localBooks.filter(
            (book: LocalBook) => book.id !== id
          );
          localStorage.setItem('localBooks', JSON.stringify(filteredBooks));

          return { data: { success: true } };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message,
            },
          };
        }
      },
      invalidatesTags: ['LocalBooks'],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBestsellersQuery,
  useGetBookByIdQuery,
  useGetLocalBooksQuery,
  useAddLocalBookMutation,
  useUpdateLocalBookMutation,
  useDeleteLocalBookMutation,
} = bookApi;

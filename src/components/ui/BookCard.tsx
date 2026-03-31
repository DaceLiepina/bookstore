import React from "react";
import {
  Star,
  FavoriteBorder,
  AddShoppingCart,
  Favorite,
  Delete,
  Edit,
} from "@mui/icons-material";
import { useAppSelector } from "../../app/hooks";
import { translations } from "../../features/language/translations";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../../contexts/WishlistContext";
import { useAuth } from "../../contexts/AuthContext";
import { type Book } from "../../types/book";
import { useDeleteLocalBookMutation } from "../../api/bookApi";
import { useAppDispatch } from '../../app/hooks';
import { addToCart } from '../../features/cart/cartSlice';

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    rating: number;
    image: string;
    category: string;
    bestseller?: boolean;
    sale?: boolean;
    salePrice?: number;
    isLocal?: boolean;
    addedBy?: string;
    tags?: string[];
  };
  onAddToCart?: (book: any) => void;
  onToggleFavorite?: (book: any) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const t = translations[currentLanguage].bookCard;

  const { user } = useAuth();

  const { isInWishlist, toggleWishlist, removeFromWishlist } = useWishlist();
const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [deleteBook] = useDeleteLocalBookMutation();

  const bookIdString = String(book.id);
  
    const handleAddToCart = () => {
      if (!book) return;
      if (!user?.isAuthenticated) {
        alert('Please login to add items to the cart');
        return;
      }
      dispatch(addToCart(book));
      console.log('Added to cart:', book.title);
    };

  // Создаем объект книги с id как string для wishlist
  const getBookForWishlist = (): Book => ({
    ...(book as Book),
    id: bookIdString,
  });

  const handleDelete = async () => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await deleteBook(bookIdString).unwrap();
      removeFromWishlist(bookIdString); // синхронизация wishlist
    } catch (e) {
      console.error("Delete error", e);
    }
  };

  // Локальная проверка: только админ и локальная книга
  const showAdminButtons =
    user?.isAuthenticated && user.role === "admin" && book.isLocal;

  return (
    <div className='group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300'>
      {/* Image Container */}
      <div className='relative overflow-hidden'>
        <Link to={`/book/${book.id}`}>
          <img
            src={book.image}
            alt={book.title}
            className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300'
          />
        </Link>
        {/* Badges */}
        <div className='absolute top-3 left-3 flex flex-col gap-1'>
          {book.bestseller && (
            <span className='bg-gray-400 text-white px-2 py-1 rounded text-xs font-semibold'>
              {t.bestseller || 'Bestseller'}
            </span>
          )}
          {book.sale && book.salePrice && book.salePrice < book.price && (
            <span className='bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold'>
              {t.sale || 'Sale'}
            </span>
          )}
          {book.isLocal && (
            <span className='bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold'>
              Local
            </span>
          )}
        </div>
        {/* Rating Badge */}
        <div className='absolute bottom-3 left-3'>
          <div className='flex items-center bg-black/70 text-white px-2 py-1 rounded text-xs'>
            <Star className='w-3 h-3 text-yellow-400 mr-1' />
            <span>{book.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => {
            if (!user?.isAuthenticated) {
              alert('Please login to add to wishlist');
              return;
            }
            toggleWishlist(getBookForWishlist());
          }}
          className='absolute top-3 right-3 hover:bg-white p-1.5 rounded-full shadow-sm dark:bg-gray-800/50 dark:hover:bg-gray-700 transition-all active:scale-95 cursor-pointer'
        >
          {isInWishlist(bookIdString) ? (
            <Favorite className='w-4 h-4 text-red-500' />
          ) : (
            <FavoriteBorder className='w-4 h-4 dark:text-gray-200' />
          )}
        </button>

        {/* Action buttons */}
        {showAdminButtons && (
          <div className='absolute right-3 bottom-3 flex flex-col gap-2'>
            <button
              onClick={handleDelete}
              className='hover:border-2 hover:border-red-600 p-1 shadow text-white text-sx transition-all active:scale-95 cursor-pointer'
              title='Delete book'
            >
              <Delete fontSize='small' />
            </button>

            <button
              onClick={() => navigate(`/books/edit/${book.id}`)}
              className='hover:border-2 hover:border-blue-600 py-1 px-2 shadow text-white transition-all active:scale-95 cursor-pointer'
              title='Edit book'
            >
              <Edit fontSize='small' />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='p-4'>
        <div className='mb-2'>
          <span className='text-xs text-gray-500 uppercase tracking-wide dark:text-gray-400'>
            {book.category}
          </span>
        </div>

        <Link to={`/book/${book.id}`}>
          <h3 className='font-semibold text-lg mb-1 line-clamp-1 hover:text-primary transition-colors dark:text-gray-400'>
            {book.title}
          </h3>
        </Link>

        <p className='text-gray-600 text-sm mb-3 dark:text-gray-400'>
          {book.author}
        </p>

        {/* Tags/Genres */}
        {book.tags && book.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mb-3'>
            {book.tags.slice(0, 2).map((tag: string, index: number) => (
              <span
                key={index}
                className='px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded'
              >
                {tag}
              </span>
            ))}
            {book.tags.length > 2 && (
              <span className='px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded'>
                +{book.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className='flex items-center justify-between mb-4'>
          <div className='text-right'>
            {book.sale && book.salePrice && book.salePrice < book.price ? (
              <>
                <span className='text-gray-400 line-through text-sm dark:text-gray-500'>
                  €{book.price.toFixed(2)}
                </span>
                <p className='text-secondary font-bold text-lg'>
                  €{book.salePrice.toFixed(2)}
                </p>
              </>
            ) : (
              <p className='font-bold text-lg dark:text-gray-400'>
                €{book.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className='border border-primary dark:text-gray-300 w-full py-2 rounded-lg hover:bg-secondary hover:text-white shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer'
        >
          <AddShoppingCart className='w-5 h-5' />
          {t.addToCart}
        </button>
      </div>
    </div>
  );
};

export default BookCard;

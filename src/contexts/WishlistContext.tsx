import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { type Book } from '../types/book';

interface WishlistContextType {
  wishlist: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  toggleWishlist: (book: Book) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('bookstore_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      return [];
    }
  });

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    try {
      localStorage.setItem('bookstore_wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlist]);

  const addToWishlist = (book: Book) => {
    setWishlist((prev) => {
      // Проверяем, нет ли уже книги в вишлисте
      if (prev.some((item) => item.id === book.id)) {
        return prev;
      }
      return [...prev, book];
    });
  };

  const removeFromWishlist = (bookId: string) => {
    setWishlist((prev) => prev.filter((book) => book.id !== bookId));
  };

  const isInWishlist = (bookId: string) => {
    return wishlist.some((book) => book.id === bookId);
  };

  const toggleWishlist = (book: Book) => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

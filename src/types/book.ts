export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  description?: string;
  isbn?: string;
  pages?: number;
  publisher?: string;
  publicationDate?: string;
  language?: string;
  bestseller?: boolean;
  sale?: boolean;
  salePrice?: number;
  tags?: string[];
  stock?: number;
  isLocal?: boolean;
}

export interface LocalBook extends Book {
  localId?: string;
  addedBy?: string;
  addedAt?: string;
  isLocal: boolean;
}

export interface BookFormData {
  title: string;
  author: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  description: string;
  isbn: string;
  pages: number;
  publisher: string;
  publicationDate: string;
  language: string;
  bestseller: boolean;
  sale: boolean;
  salePrice: number;
  stock: number;
}

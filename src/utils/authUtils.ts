import { getAuthUser } from './storage';

export interface User {
  id?: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  isAuthenticated: boolean;
}

export const getCurrentUser = (): User | null => {
  try {
    const authUser = getAuthUser();
    if (!authUser) return null;

    return {
      email: authUser.email,
      name: authUser.name,
      role: authUser.role || 'user',
      isAuthenticated: authUser.isAuthenticated || false,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const canEditBook = (book: any): boolean => {
  const user = getCurrentUser();
  if (!user?.isAuthenticated) return false;

  // Админы могут редактировать все локальные книги
  if (user.role === 'admin' && book?.isLocal) return true;

  // Пользователи могут редактировать только свои книги
  if (book?.addedBy === user.email) return true;

  return false;
};

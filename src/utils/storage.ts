export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthUser {
  email: string;
  name?: string;
  token?: string;
  role: 'user' | 'admin';
  isAuthenticated: boolean;
  createdAt?: string;
}

// Сохранение текущего пользователя
export const saveAuthUser = (user: AuthUser | { email: string; name?: string; role?: 'user' | 'admin'; createdAt?: string }) => {
  const authData = {
    email: user.email,
    name: user.name,
    role: user.role,
    isAuthenticated: true,
    lastLogin: new Date().toISOString(),
    createdAt: user.createdAt,
  };
  localStorage.setItem('auth_user', JSON.stringify(authData));
};

// Получение текущего пользователя
export const getAuthUser = (): AuthUser | null => {
  const data = localStorage.getItem('auth_user');
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    return {
      email: parsed.email,
      name: parsed.name,
      role: parsed.role || 'user', // Default to 'user' if not specified
      isAuthenticated: parsed.isAuthenticated || false,
      createdAt: parsed.createdAt,
    };
  } catch {
    return null;
  }
};

// Очистка данных пользователя
export const clearAuthUser = () => {
  localStorage.removeItem('auth_user');
};

// Сохранение всех пользователей (для демо)
export const saveUsers = (
  users: Record<string, { password: string; user: User }>
) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Получение всех пользователей
export const getUsers = (): Record<
  string,
  { password: string; user: User }
> => {
  const data = localStorage.getItem('users');
  return data ? JSON.parse(data) : {};
};

// Сохранение токена
export const saveToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

// Получение токена
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Проверка, аутентифицирован ли пользователь
export const isAuthenticated = (): boolean => {
  const user = getAuthUser();
  return user?.isAuthenticated || false;
};

// Очистка всех данных аутентификации
export const clearAllAuthData = () => {
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_token');
};

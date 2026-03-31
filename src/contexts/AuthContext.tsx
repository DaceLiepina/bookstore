import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  type User,
  type AuthUser,
  getAuthUser,
  saveAuthUser,
  getUsers,
  saveUsers,
  clearAllAuthData,
} from '../utils/storage';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name?: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  updateUserRole: (role: 'user' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка пользователя при монтировании
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = getAuthUser();
        if (savedUser?.isAuthenticated) {
          // Определяем роль пользователя при загрузке
          const userWithRole = {
            ...savedUser,
            role: determineUserRole(savedUser.email)
          };
          setUser(userWithRole);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Функция для определения роли пользователя
  const determineUserRole = (email?: string): 'user' | 'admin' => {
    if (!email) return 'user';

    // Администраторы по email
    const adminEmails = ['admin@bookstore.com', 'demo@bookstore.com'];
    return adminEmails.includes(email) ? 'admin' : 'user';
  };

  // Создание нового пользователя
  const createNewUser = (
    email: string,
    _password: string,
    name?: string
  ): User => {
    return {
      id: `user_${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      role: determineUserRole(email), // Используем функцию определения роли
      createdAt: new Date().toISOString(),
    };
  };

  // Регистрация
  const register = async (
    email: string,
    password: string,
    name?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Валидация
      if (!email || !password) {
        setError('Email and password are required');
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return false;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }

      // Проверка существующего пользователя
      const users = getUsers();
      if (users[email]) {
        setError('User with this email already exists');
        return false;
      }

      // Создание нового пользователя с определением роли
      const newUser = createNewUser(email, password, name);

      // Сохранение в localStorage
      users[email] = { password, user: newUser };
      saveUsers(users);

      // Сохраняем в auth_user с правильными данными
      const authUserData = {
        email: newUser.email,
        name: newUser.name,
        isAuthenticated: true,
        role: newUser.role,
        createdAt: newUser.createdAt,
      };
      saveAuthUser(authUserData);

      setUser(authUserData);

      return true;
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Вход
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Валидация
      if (!email || !password) {
        setError('Email and password are required');
        return false;
      }

      // Получение пользователей
      const users = getUsers();
      const userData = users[email];

      // Проверка учетных данных
      if (!userData || userData.password !== password) {
        setError('Invalid email or password');
        return false;
      }

      // Определяем роль пользователя
      const userRole = determineUserRole(email);

      // Создаем объект для сохранения
      const authUserData = {
        email: userData.user.email,
        name: userData.user.name,
        isAuthenticated: true,
        role: userRole,
        createdAt: userData.user.createdAt,
      };

      // Успешный вход
      saveAuthUser(authUserData);

      setUser(authUserData);

      return true;
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Выход
  const logout = () => {
    clearAllAuthData();
    setUser(null);
    setError(null);
  };

  // Обновление роли пользователя
  const updateUserRole = (role: 'user' | 'admin') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      saveAuthUser(updatedUser);
    }
  };

  // Очистка ошибок
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        error,
        clearError,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

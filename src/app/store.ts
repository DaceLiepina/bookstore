import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { bookApi } from '../api/bookApi';
import { userApi } from '../api/userApi';

// Import existing reducers
import languageReducer from '../features/language/languageSlice';
import themeReducer from '../features/theme/themeSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from "../features/cart/cartSlice";


// ---------- Комбинируем все редьюсеры ----------

const rootReducer = combineReducers({
  language: languageReducer,
  theme: themeReducer,
  auth: authReducer,
  cart: cartReducer,
  [bookApi.reducerPath]: bookApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['language', 'theme', 'user'],
  blacklist: [bookApi.reducerPath, userApi.reducerPath], // Исключаем то, что не нужно сохранять
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ---------- Создаём store ----------

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,
    }).concat(bookApi.middleware).concat(userApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

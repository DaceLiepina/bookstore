import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react';
import { type Order } from '../types/order';

interface OrdersContextType {
    orders: Order[];
    addOrder: (order: Order) => void;
    // Функции удаления или очистки можно добавить по необходимости
    clearOrders: () => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrdersProvider');
    }
    return context;
};

interface OrdersProviderProps {
    children: ReactNode;
}

export const OrdersProvider: React.FC<OrdersProviderProps> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>(() => {
        try {
            const saved = localStorage.getItem('orders'); // Используем тот же ключ, что и в userApi
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading orders from localStorage:', error);
            return [];
        }
    });

    // Сохраняем в localStorage при каждом изменении
    useEffect(() => {
        try {
            localStorage.setItem('orders', JSON.stringify(orders));
        } catch (error) {
            console.error('Error saving orders to localStorage:', error);
        }
    }, [orders]);

    const addOrder = (order: Order) => {
        setOrders((prev) => {
            // Добавляем новый заказ в начало списка
            return [order, ...prev];
        });
    };

    const clearOrders = () => {
        setOrders([]);
    };

    return (
        <OrdersContext.Provider
            value={{
                orders,
                addOrder,
                clearOrders,
            }}
        >
            {children}
        </OrdersContext.Provider>
    );
};

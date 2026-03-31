import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface UserStats {
    booksRead: number;
    orders: number;
    reviews: number;
    wishlist: number;
}

interface Order {
    id: string;
    date: string;
    total: number;
    status: 'delivered' | 'processing' | 'shipped';
    items: Array<{
        bookId: string;
        title: string;
        image: string;
        price: number;
    }>;
}

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    tagTypes: ['UserStats', 'Orders'],
    endpoints: (builder) => ({
        getUserStats: builder.query<UserStats, void>({
            queryFn: () => {
                // Mock implementation using localStorage
                const wishlist = JSON.parse(localStorage.getItem('bookstore_wishlist') || '[]');
                const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');

                // Calculate books read based on delivered orders or manual list
                // For now, let's say "Books Read" = delivered orders * avg items per order (placeholder)
                // or just mock it slightly more realistically based on orders

                return {
                    data: {
                        booksRead: Math.floor(orders.length * 1.5), // Placeholder logic
                        orders: orders.length,
                        reviews: reviews.length,
                        wishlist: wishlist.length,
                    },
                };
            },
            providesTags: ['UserStats'],
        }),

        getRecentOrders: builder.query<Order[], void>({
            queryFn: () => {
                const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                // Sort by date desc and take top 3
                const recent = orders
                    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 3);

                return { data: recent };
            },
            providesTags: ['Orders'],
        }),
    }),
});

export const { useGetUserStatsQuery, useGetRecentOrdersQuery } = userApi;

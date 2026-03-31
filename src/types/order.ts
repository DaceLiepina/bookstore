export interface OrderItem {
    bookId: string;
    title: string;
    image: string;
    price: number;
}

export interface Order {
    id: string;
    date: string;
    total: number;
    status: 'delivered' | 'processing' | 'shipped';
    items: OrderItem[];
}

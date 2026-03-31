import { createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Book } from "../../types/book";
import type { RootState } from '../../app/store';



export interface CartItem extends Book {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Book>) {
      const id = action.payload.id.toString();
      const existing = state.items.find((item) => item.id.toString() === id);

      if (existing) existing.quantity += 1;
      else state.items.push({ ...action.payload, quantity: 1 });
    },
    decreaseQuantity(state, action: PayloadAction<string | number>) {
      const id = action.payload.toString();
      const item = state.items.find((i) => i.id.toString() === id);
      if (!item) return;

      if (item.quantity > 1) item.quantity -= 1;
      else state.items = state.items.filter((i) => i.id.toString() !== id);
    },
    removeFromCart(state, action: PayloadAction<string | number>) {
      const id = action.payload.toString();
      state.items = state.items.filter((i) => i.id.toString() !== id);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);

export default cartSlice.reducer;

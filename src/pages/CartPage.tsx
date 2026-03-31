import React from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { addToCart, decreaseQuantity, removeFromCart, clearCart } from "../features/cart/cartSlice";
import { Button, Chip } from "@mui/material";
import { ArrowBack, ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector((state) => state.cart.items);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          onClick={() => navigate("/catalog")}
        >
          Go to Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className='container-custom py-8 px-6'>
      <h1 className='text-3xl font-bold mb-6 flex items-center gap-2'>
        <ShoppingCart /> My Cart
      </h1>

      <div className='flex flex-col gap-6'>
        {items.map((item) => (
          <div
            key={item.id}
            className='flex flex-col md:flex-row items-center gap-4 border border-border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow'
          >
            <img
              src={item.image}
              alt={item.title}
              className='w-32 h-40 object-cover rounded-lg'
            />

            <div className='flex-1 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4'>
              <div>
                <h2 className='text-xl font-semibold md:-mt-5 md:mb-10'>
                  {item.title}
                </h2>
                <p className='text-gray-600 mb-2'>€{item.price}</p>
                <div className='flex items-center gap-2 md:self-end'>
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                  >
                    −
                  </Button>
                  <Chip label={item.quantity} color='primary' />
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={() => dispatch(addToCart(item))}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className='flex flex-col gap-2 items-start md:items-end md:self-end'>
                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-8 flex flex-col md:flex-row md:justify-between items-center'>
        <h2 className='text-2xl font-semibold'>
          Total: €{totalPrice.toFixed(2)}
        </h2>
        <div className='flex gap-4 mt-4 md:mt-0'>
          <Button
            variant='outlined'
            startIcon={<ArrowBack />}
            onClick={() => navigate('/catalog')}
          >
            Continue Shopping
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

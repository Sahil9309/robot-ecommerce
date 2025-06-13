import { createContext, useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (robot) => {
    if (!user) {
      return false; // Don't add to cart if not logged in
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item._id === robot._id);
      if (existingItem) {
        return prev.map(item => 
          item._id === robot._id 
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...robot, quantity: 1 }];
    });
    return true;
  };

  const removeFromCart = (robotId) => {
    setCartItems(prev => prev.filter(item => item._id !== robotId));
  };

  const updateQuantity = (robotId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(robotId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item._id === robotId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      getCartTotal,
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
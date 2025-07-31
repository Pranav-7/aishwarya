import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const submitOrder = async (deliveryAddress = '', contactNumber = '') => {
    if (!currentUser) {
      throw new Error('User must be logged in to submit an order');
    }

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    try {
      const orderData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        items: cartItems,
        total: getCartTotal(),
        status: 'pending',
        deliveryAddress: deliveryAddress,
        contactNumber: contactNumber,
        paymentContact: '+919449100021',
        createdAt: serverTimestamp(),
        customerInfo: {
          name: currentUser.displayName || 'Customer',
          email: currentUser.email
        }
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Clear cart after successful order submission
      clearCart();
      
      return docRef.id;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    submitOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
} 
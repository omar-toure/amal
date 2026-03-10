'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Link from 'next/link';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [notification, setNotification] = useState({ show: false, productName: '' });

  useEffect(() => {
    // Load from local storage on mount
    const savedCart = localStorage.getItem('amal_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart parse error", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('amal_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    // Trigger notification
    setNotification({ show: true, productName: product.name });
    setTimeout(() => setNotification({ show: false, productName: '' }), 5000);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      cartCount: cartItems.reduce((count, item) => count + item.quantity, 0)
    }}>
      {children}

      {/* Global Notification */}
      {notification.show && (
        <div className="cart-notification-toast">
          <div className="toast-content">
            <div className="toast-icon">✓</div>
            <div className="toast-text">
              <span className="toast-product">{notification.productName}</span> ajouté au panier !
            </div>
            <Link href="/cart" className="toast-link" onClick={() => setNotification({ show: false, productName: '' })}>
              Voir le panier
            </Link>
          </div>
          <button className="toast-close" onClick={() => setNotification({ show: false, productName: '' })}>&times;</button>
        </div>
      )}

      <style jsx>{`
        .cart-notification-toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: #ffffff;
          color: #0B1B32;
          padding: 12px 20px;
          border-radius: 50px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 320px;
          justify-content: space-between;
          border: 1px solid #e5e0d8;
          animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes slideUp {
          from { transform: translate(-50%, 100px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .toast-icon {
          background: #D20A11;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .toast-text {
          font-size: 0.95rem;
          font-weight: 500;
        }

        .toast-product {
          font-weight: 700;
          color: #D20A11;
        }

        .toast-link {
          color: #D20A11;
          text-decoration: underline;
          font-weight: 700;
          font-size: 0.9rem;
          margin-left: 5px;
        }

        .toast-close {
          background: none;
          border: none;
          color: #666;
          font-size: 20px;
          cursor: pointer;
          padding: 0 5px;
        }

        @media (max-width: 640px) {
          .cart-notification-toast {
            width: 90%;
            bottom: 20px;
            padding: 10px 15px;
            min-width: unset;
          }
          .toast-text { font-size: 0.85rem; }
        }
      `}</style>
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

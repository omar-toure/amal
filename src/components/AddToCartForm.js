"use client";

import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function AddToCartForm({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="add-to-cart-form mt-6">
      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="quantity" className="font-semibold text-dark">Quantité:</label>
        <div className="flex items-center border border-gray-medium rounded-md overflow-hidden text-dark bg-white">
          <button 
            type="button" 
            className="px-3 py-1 bg-gray-light hover:bg-gray-medium transition text-dark border-r border-gray-medium"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >-</button>
          <input 
            type="number" 
            id="quantity" 
            value={quantity} 
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center py-1 focus:outline-none text-dark bg-white"
            min="1"
          />
          <button 
            type="button" 
            className="px-3 py-1 bg-gray-light hover:bg-gray-medium transition text-dark border-l border-gray-medium"
            onClick={() => setQuantity(quantity + 1)}
          >+</button>
        </div>
      </div>
      
      <button 
        onClick={handleAdd} 
        className="btn btn-primary w-full md:w-auto mt-2"
        style={{ padding: '15px 40px', fontSize: '1.1rem' }}
      >
        Ajouter au panier
      </button>
    </div>
  );
}

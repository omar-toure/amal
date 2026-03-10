"use client";

import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import Link from 'next/link';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { formatPrice, currency } = useCurrency();

  if (product.hidden) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!product.available || !product.inStock) return;
    addToCart(product, 1);
  };

  const getPrice = () => {
    if (product.onSale && product.discountPercentage > 0) {
      return product.price * (1 - product.discountPercentage / 100);
    }
    return product.price;
  };

  const finalPrice = getPrice();

  return (
    <div className={`product-card group ${!product.inStock || !product.available ? 'product-unavailable' : ''}`}>
      <Link href={`/product/${product.id}`} className="product-image-container">
        <img 
          src={`/site amal/${product.image}`} 
          alt={product.name}
          className="product-image"
        />
        {product.onSale && product.available && product.inStock && (
          <div className="product-badge badge-sale">-{product.discountPercentage}%</div>
        )}
        {!product.available && (
          <div className="product-badge badge-unavailable">Indisponible</div>
        )}
        {product.available && !product.inStock && (
          <div className="product-badge badge-outofstock">Rupture</div>
        )}
      </Link>
      
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <Link href={`/product/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        <div className="product-bottom">
          <div className="product-price">
            {product.price > 0 ? (
              <div className="price-container">
                {product.onSale && product.discountPercentage > 0 ? (
                  <>
                    <span className="price-old">{formatPrice(product.price)}</span>
                    <span className="price-amount sale-price">{formatPrice(finalPrice)}</span>
                  </>
                ) : (
                  <span className="price-amount">{formatPrice(product.price)}</span>
                )}
                <span className="price-unit"> / {product.unit}</span>
              </div>
            ) : (
              <span className="price-amount">Voir options</span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart} 
            className={`btn-add-cart ${!product.inStock || !product.available ? 'btn-disabled' : ''}`}
            disabled={!product.inStock || !product.available}
          >
            {!product.available ? 'Indisponible' : !product.inStock ? 'Rupture' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  );
}

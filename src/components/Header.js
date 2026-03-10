"use client";

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useState, useEffect } from 'react';
import './Header.css';

export default function Header() {
  const { cartCount } = useCart();
  const { currency, toggleCurrency } = useCurrency();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        
        {/* LOGO */}
        <div className="header-logo">
          <Link href="/">
            <img 
              src="/site amal/logo.png" 
              alt="Amal Logo" 
              className="logo-img"
            />
          </Link>
        </div>

        {/* SPACER to push content to the right */}
        <div className="flex-grow"></div>

        {/* RIGHT ACTIONS & NAV */}
        <div className="header-right flex items-center gap-6 md:gap-8 lg:gap-10">
          <nav className="header-nav hidden-mobile flex gap-6">
            <Link href="/" className="nav-link">Accueil</Link>
            <Link href="/products" className="nav-link">Nos produits</Link>
            <Link href="/about" className="nav-link">À propos</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </nav>
          
          <div className="header-actions flex items-center gap-4 md:gap-6">
            {/* CURRENCY SWITCHER */}
            <button 
              onClick={toggleCurrency} 
              className="currency-switcher"
              title="Changer la devise"
            >
              <span className={currency === 'CAD' ? 'active-currency' : ''}>CAD</span>
              <span className="currency-divider">|</span>
              <span className={currency === 'FCFA' ? 'active-currency' : ''}>FCFA</span>
            </button>

            <a href="https://www.facebook.com/AmalBusiness" target="_blank" rel="noopener noreferrer" title="Facebook" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://www.instagram.com/amal_juice" target="_blank" rel="noopener noreferrer" title="Instagram" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            
            <Link href="/cart" className="cart-link">
              <div className="cart-icon-container">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <path d="M3 6h18"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span className="cart-badge">{cartCount}</span>
              </div>
            </Link>
          </div>

          {/* MOBILE MENU TRIGGER */}
          <div className="mobile-actions hidden-tablet-up">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          <Link href="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
          <Link href="/products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Nos produits</Link>
          <Link href="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>À propos</Link>
          <Link href="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </div>
      )}
    </header>
  );
}

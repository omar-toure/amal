import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        
        {/* LEFT: Logo */}
        <div className="footer-logo">
          <Link href="/">
            <img 
              src="/site amal/logo.png" 
              alt="Amal Logo" 
              className="footer-logo-img"
            />
          </Link>
          <p className="footer-tagline">L'authenticité des saveurs artisanales</p>
        </div>

        {/* CENTER: Navigation */}
        <div className="footer-nav">
          <h3>Menu</h3>
          <ul>
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/products">Nos produits</Link></li>
            <li><Link href="/categories">Nos catégories</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* RIGHT: Socials */}
        <div className="footer-socials">
          <h3>Suivez-nous</h3>
          <div className="social-links-footer">
            <a href="https://www.instagram.com/amal_juice?igsh=OHcxMHcxZDZpYzNw" target="_blank" rel="noopener noreferrer" className="social-icon hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ig-grad-footer" x1="2" y1="22" x2="22" y2="2">
                    <stop offset="0%" stopColor="#fdf497" />
                    <stop offset="5%" stopColor="#fdf497" />
                    <stop offset="45%" stopColor="#fd5949" />
                    <stop offset="60%" stopColor="#d6249f" />
                    <stop offset="90%" stopColor="#285AEB" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="6" ry="6" stroke="url(#ig-grad-footer)" strokeWidth="2"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#ig-grad-footer)" strokeWidth="2"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#ig-grad-footer)" strokeWidth="2" strokeLinecap="round"></line>
              </svg>
              <span>Instagram</span>
            </a>
            <a href="https://www.facebook.com/AmalBusiness?rdid=6WnwOgOeFWmakKKC&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19BmqByNw2%2F#" target="_blank" rel="noopener noreferrer" className="social-icon hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#1877F2"/>
                <path d="M15.36 12l-.43-2.89h-2.33V7.24c0-.82.38-1.6 1.63-1.6h1.26V3.24A15.42 15.42 0 0013.25 3c-2.28 0-3.77 1.34-3.77 3.82v2.29H7.13V12h2.35v7.6a12.06 12.06 0 002.54 0V12h2.33" fill="#ffffff"/>
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Amal E-Commerce. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

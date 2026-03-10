import Link from 'next/link';
import './Hero.css';

export default function Hero({ data, animate = true, showButton = true }) {
  if (!data) return null;

  return (
    <section 
      className={`hero-section ${animate ? 'hero-animate' : ''}`} 
      style={{ backgroundImage: `url('/site amal/${data.backgroundImage}')` }}
    >
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <h1 className="hero-main-title" style={{ color: '#ffffff' }}>{data.title}</h1>
        <p className="hero-sub-text" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{data.subtitle}</p>
        {showButton && (
          <Link href="/products" className="btn btn-primary btn-hero">
            {data.buttonText || "Découvrir les produits"}
          </Link>
        )}
      </div>
    </section>
  );
}

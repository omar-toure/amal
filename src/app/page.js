import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';
import { getProducts } from './lib/products';
import { getHomeData } from './lib/home';
import './Home.css';

export default async function Home() {
  const products = await getProducts();
  const homeData = await getHomeData();
  
  // Categorize products
  const visibleProducts = products.filter(p => !p.hidden);
  const popularProducts = visibleProducts.filter(p => p.popular).slice(0, 4);
  const cereals = visibleProducts.filter(p => p.category === "Céréales & Dérivés");
  const peanuts = visibleProducts.filter(p => p.category === "Produits à base d’arachide");
  const drinks = visibleProducts.filter(p => p.category === "Boissons & poudres naturelles");
  const incense = visibleProducts.filter(p => (p.category === "Encens" || p.category === "Produits traditionnels"));

  return (
    <div className="home-page">
      {/* SECTION 1: Hero */}
      <Hero data={homeData.hero} showButton={true} />

      {/* SECTION 2: Presentation */}
      <section className="presentation-section py-16 bg-light">
        <div className="container">
          <div className="presentation-box text-center">
            <h2>{homeData.presentation.title}</h2>
            <p className="max-w-3xl mx-auto">{homeData.presentation.text}</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Popular Products */}
      <section className="popular-section py-16 bg-dark">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{homeData.sections.popular}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Categories Map */}
      <section className="categories-section py-16 bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{homeData.sections.categories}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/categories#cereales" className="product-card group block text-center p-4">
              <div className="product-image-container bg-transparent mb-4">
                <img src={`/site amal/${homeData.categoryImages.cereals}`} alt="Céréales" className="product-image object-contain" />
              </div>
              <h3 className="product-name font-bold text-lg">Céréales & Dérivés</h3>
            </Link>
            <Link href="/categories#arachide" className="product-card group block text-center p-4">
              <div className="product-image-container bg-transparent mb-4">
                <img src={`/site amal/${homeData.categoryImages.peanuts}`} alt="Arachide" className="product-image object-contain" />
              </div>
              <h3 className="product-name font-bold text-lg">Base d’arachide</h3>
            </Link>
            <Link href="/categories#boissons" className="product-card group block text-center p-4">
              <div className="product-image-container bg-transparent mb-4">
                <img src={`/site amal/${homeData.categoryImages.drinks}`} alt="Boissons" className="product-image object-contain" />
              </div>
              <h3 className="product-name font-bold text-lg">Boissons Naturelles</h3>
            </Link>
            <Link href="/categories#encens" className="product-card group block text-center p-4">
              <div className="product-image-container bg-transparent mb-4">
                <img src={`/site amal/${homeData.categoryImages.incense}`} alt="Encens" className="product-image object-contain" />
              </div>
              <h3 className="product-name font-bold text-lg">Encens</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: Bestsellers */}
      <section className="bestsellers-section bg-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        {homeData.bestsellers?.image && (
          <div className="bestsellers-image-container">
            <img 
              src={`/site amal/${homeData.bestsellers.image}`} 
              alt="Nos meilleures ventes" 
              className="bestsellers-img"
            />
          </div>
        )}
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.55)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '20px',
          textAlign: 'center',
          zIndex: 2
        }}>
          <h2 style={{ fontSize: '3rem', color: '#ffffff', marginBottom: '1rem', fontFamily: 'var(--font-serif)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {homeData.bestsellers?.title || "Nos meilleures ventes"}
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#ffffff', maxWidth: '800px', marginBottom: '2rem', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            {homeData.bestsellers?.description || "Découvrez les produits les plus appréciés de nos clients. L'alliance parfaite entre tradition et qualité absolue pour votre quotidien."}
          </p>
          <Link href="/products" className="btn btn-primary" style={{ padding: '15px 35px', fontSize: '1.1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            Acheter maintenant
          </Link>
        </div>
      </section>

      {/* SECTION 6: Reference */}
      <section className="reference-section bg-light" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="container-fluid" style={{ maxWidth: '100%', padding: 0 }}>
          <div className="grid sm:grid-cols-2 items-center" style={{ minHeight: '600px' }}>
            {/* Image (Left) - FULL COVER */}
            {homeData.reference?.image && (
              <div style={{ height: '100%', width: '100%' }}>
                <img 
                  src={`/site amal/${homeData.reference.image}`} 
                  alt="Notre Référence" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '400px' }}
                />
              </div>
            )}
            
            {/* Text (Right) */}
            <div className="reference-text" style={{ padding: '4rem 10%', backgroundColor: 'var(--bg-light)' }}>
              <h2 className="font-serif text-secondary" style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: '1.2' }}>
                {homeData.reference?.title || "Votre référence en produits naturels et traditionnels"}
              </h2>
              <p className="text-dark" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', lineHeight: '1.7', opacity: 0.9 }}>
                {homeData.reference?.description || "Nous sélectionnons rigoureusement des ingrédients purs, sans aucun additif, pour vous garantir le goût authentique du terroir."}
              </p>
              <Link href="/products" className="btn btn-secondary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                Découvrir le catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: Reviews */}
      <section className="reviews-section py-16 bg-dark">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title text-white">{homeData.sections.reviews}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(homeData.reviews_data || []).map((review, index) => (
              <div key={index} className="review-card">
                <div className="stars">★★★★★</div>
                <p className="review-text">"{review.text}"</p>
                <h4 className="reviewer">- {review.name}</h4>
              </div>
            ))}
            {(!homeData.reviews_data || homeData.reviews_data.length === 0) && (
              <div className="col-span-3 text-center text-white opacity-50 py-10">
                Aucun avis pour le moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 10: CTA / Contact */}
      <section className="cta-section py-16 bg-light">
        <div className="container text-center">
          <div className="cta-box max-w-2xl mx-auto p-12 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl mb-4">{homeData.cta.title}</h2>
            <p className="mb-8 mt-4">{homeData.cta.text}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn btn-primary">{homeData.cta.buttonContact}</Link>
              <Link href="/products" className="btn btn-secondary">{homeData.cta.buttonCatalog}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

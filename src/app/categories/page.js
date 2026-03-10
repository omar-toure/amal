"use client";

import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import Hero from '../../components/Hero';

export default function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Céréales & Dérivés");
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState(null);

  const categories = [
    { id: "Céréales & Dérivés", name: "Céréales & Dérivés" },
    { id: "Produits à base d’arachide", name: "Produits à base d’arachide" },
    { id: "Boissons & poudres naturelles", name: "Boissons & poudres naturelles" },
    { id: "Encens", name: "Encens" },
    { id: "Produits traditionnels", name: "Produits traditionnels" },
  ];

  useEffect(() => {
    // Handle hash based navigation if any
    const hash = window.location.hash.replace('#', '');
    if (hash === 'cereales') setActiveCategory("Céréales & Dérivés");
    if (hash === 'arachide') setActiveCategory("Produits à base d’arachide");
    if (hash === 'boissons') setActiveCategory("Boissons & poudres naturelles");
    if (hash === 'encens') setActiveCategory("Encens");
    if (hash === 'traditionnels') setActiveCategory("Produits traditionnels");

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });

    fetch('/api/home')
      .then(res => res.json())
      .then(data => setHomeData(data));
  }, []);

  const filteredProducts = products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-light min-h-screen">
      <Hero data={homeData?.categoriesHero} animate={false} showButton={false} />
      <div className="container py-16">
        <div className="section-header">
          <h1 className="section-title text-dark">Nos Catégories</h1>
        </div>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-primary text-white shadow-lg transform -translate-y-1' 
                  : 'bg-white text-dark border border-gray-medium hover:border-primary'
              }`}
              style={{
                backgroundColor: activeCategory === cat.id ? 'var(--primary)' : 'white',
                color: activeCategory === cat.id ? 'white' : 'var(--dark)'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">Chargement...</div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2" style={{ borderColor: 'var(--primary)', display: 'inline-block' }}>
              {categories.find(c => c.id === activeCategory)?.name}
            </h2>
            
            {filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-light rounded-lg">
                <p>Aucun produit dans cette catégorie pour le moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

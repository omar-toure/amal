import { getProducts } from '../lib/products';
import ProductCard from '../../components/ProductCard';
import Hero from '../../components/Hero';
import { getHomeData } from '../lib/home';

export const metadata = {
  title: 'Tous nos produits | Amal E-Commerce',
};

export default async function ProductsPage() {
  const products = await getProducts();
  const homeData = await getHomeData();
  const visibleProducts = products.filter(p => !p.hidden);
  
  return (
    <div className="products-page min-h-screen bg-light">
      <Hero data={homeData.productsHero} animate={false} showButton={false} />
      
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {visibleProducts.length === 0 && (
          <div className="text-center py-16">
            <p>Aucun produit n'est disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { getProducts } from '../../lib/products';
import AddToCartForm from '../../../components/AddToCartForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find(p => p.id === id);
  
  if (!product) return { title: 'Produit introuvable' };
  return { title: `${product.name} | Amal E-Commerce` };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-16">
      <div className="container">
        <div className="mb-6">
          <Link href="/products" className="text-primary hover:underline font-medium">
            &larr; Retour aux produits
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 bg-white p-6 md:p-12 rounded-lg shadow-sm border border-gray-medium">
          {/* Product Image */}
          <div className="product-image-large bg-gray-light rounded-lg flex items-center justify-center p-4">
            <img 
              src={`/site amal/${product.image}`} 
              alt={product.name}
              style={{ maxHeight: '350px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          
          {/* Product Details */}
          <div className="product-details flex flex-col justify-center text-dark">
            <div className="text-sm uppercase tracking-wider mb-2 font-semibold text-gray-dark">
              {product.category}
            </div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="text-3xl font-bold mb-6 pb-6 border-b border-gray-medium text-primary">
              {product.price > 0 ? (
                <>
                  {product.price} $ <span className="text-lg font-medium text-gray-dark">/ {product.unit}</span>
                </>
              ) : (
                'Prix sur demande'
              )}
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="leading-relaxed text-lg text-gray-dark">
                {product.description || "Aucune description disponible pour ce produit."}
              </p>
            </div>
            
            <AddToCartForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

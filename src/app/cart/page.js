"use client";

import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+221',
    phone: '',
    address: '',
    paymentMethod: 'Wave'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();

    const phoneNumber = "14384594187";
    const total = getCartTotal();

    let message = `*Nouvelle Commande - Amal E-Commerce*\n\n`;
    message += `*Client:* ${formData.name}\n`;
    message += `*Téléphone:* ${formData.countryCode} ${formData.phone}\n`;
    message += `*Adresse:* ${formData.address}\n`;
    message += `*Mode de paiement:* ${formData.paymentMethod}\n\n`;

    message += `*Détails de la commande:*\n`;
    cartItems.forEach(item => {
      message += `- ${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})\n`;
    });

    message += `\n*TOTAL: ${formatPrice(total)}*\n\n`;
    message += `Merci de confirmer la réception de ma commande.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Utiliser un lien <a> pour éviter le blocage des popups
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // clearCart(); // Optional: clear cart after redirect
  };

  return (
    <div className="py-16 min-h-screen bg-gray-light">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <p className="text-xl text-gray-dark mb-6">Votre panier est actuellement vide.</p>
            <Link href="/products" className="btn btn-primary">
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">

              {/* ── MOBILE : cartes ── */}
              <div className="cart-mobile-list">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-card">
                    <img
                      src={`/site amal/${item.image}`}
                      alt={item.name}
                      className="cart-card-img"
                    />
                    <div className="cart-card-info">
                      <div className="cart-card-name">{item.name}</div>
                      <div className="cart-card-unit">Unité : {item.unit}</div>
                      <div className="cart-card-price">{formatPrice(item.price)} / unité</div>
                      <div className="cart-card-row">
                        <div className="inline-flex items-center border border-gray-medium rounded">
                          <button
                            className="px-2 py-1 bg-gray-light hover:bg-gray-medium transition"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >-</button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button
                            className="px-2 py-1 bg-gray-light hover:bg-gray-medium transition"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >+</button>
                        </div>
                        <span className="cart-card-total">{formatPrice(item.price * item.quantity)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cart-card-remove"
                          title="Supprimer"
                        >✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── DESKTOP : tableau ── */}
              <div className="cart-desktop-table">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-medium">
                      <th className="p-4 font-semibold text-gray-dark">Produit</th>
                      <th className="p-4 font-semibold text-gray-dark text-center">Prix</th>
                      <th className="p-4 font-semibold text-gray-dark text-center">Quantité</th>
                      <th className="p-4 font-semibold text-gray-dark text-right">Total</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id} className="border-b border-gray-light">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={`/site amal/${item.image}`}
                              alt={item.name}
                              className="object-cover rounded"
                              style={{ width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' }}
                            />
                            <div>
                              <div className="font-semibold text-dark">{item.name}</div>
                              <div className="text-sm text-gray-dark">Unité: {item.unit}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center font-medium">{formatPrice(item.price)}</td>
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center border border-gray-medium rounded">
                            <button
                              className="px-2 py-1 bg-gray-light hover:bg-gray-medium transition"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >-</button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <button
                              className="px-2 py-1 bg-gray-light hover:bg-gray-medium transition"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >+</button>
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-dark hover:text-primary transition"
                            title="Supprimer"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-gray-50 flex flex-col md:flex-row justify-between items-center border-t border-gray-medium">
                <Link href="/products" className="text-primary hover:underline font-medium mb-4 md:mb-0">
                  &larr; Continuer mes achats
                </Link>
                <div className="text-xl">
                  <span className="text-gray-dark mr-4">Total à payer:</span>
                  <span className="text-3xl font-bold text-primary">{formatPrice(getCartTotal())}</span>
                </div>
              </div>
            </div>


            <div className="flex justify-end">
              <button
                onClick={() => setShowCheckout(true)}
                className="btn btn-primary"
                style={{ padding: '15px 40px', fontSize: '1.2rem' }}
              >
                Passer la commande
              </button>
            </div>
          </div>
        )}

        {/* Checkout Modal with Form */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowCheckout(false)}
                className="absolute top-4 right-4 text-3xl text-gray-dark hover:text-dark transition"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold text-center mb-6 text-primary border-b pb-4">
                Finaliser ma commande
              </h2>

              <form onSubmit={handleWhatsAppOrder} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Nom complet *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-control"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Numéro de téléphone *</label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      className="form-control"
                      style={{ width: '100px' }}
                      value={formData.countryCode}
                      onChange={handleInputChange}
                    >
                      <option value="+221">SN +221</option>
                      <option value="+1">CA +1</option>
                      <option value="+33">FR +33</option>
                      <option value="+225">CI +225</option>
                      <option value="+223">ML +223</option>
                      <option value="+224">GN +224</option>
                      <option value="">Autre</option>
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="form-control flex-grow"
                      placeholder="Votre numéro"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Adresse de livraison complète *</label>
                  <textarea
                    name="address"
                    required
                    className="form-control"
                    rows="2"
                    placeholder="Rue, quartier, ville..."
                    value={formData.address}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Mode de paiement préféré *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`p-3 border rounded-lg cursor-pointer transition text-center ${formData.paymentMethod === 'Wave' ? 'border-primary bg-red-50 text-primary font-bold' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Wave"
                        className="hidden"
                        checked={formData.paymentMethod === 'Wave'}
                        onChange={handleInputChange}
                      />
                      Wave
                    </label>
                    <label className={`p-3 border rounded-lg cursor-pointer transition text-center ${formData.paymentMethod === 'Interac' ? 'border-primary bg-red-50 text-primary font-bold' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Interac"
                        className="hidden"
                        checked={formData.paymentMethod === 'Interac'}
                        onChange={handleInputChange}
                      />
                      Interac
                    </label>
                    <label className={`p-3 border rounded-lg cursor-pointer transition text-center ${formData.paymentMethod === 'Orange Money' ? 'border-primary bg-red-50 text-primary font-bold' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Orange Money"
                        className="hidden"
                        checked={formData.paymentMethod === 'Orange Money'}
                        onChange={handleInputChange}
                      />
                      OM
                    </label>
                    <label className={`p-3 border rounded-lg cursor-pointer transition text-center ${formData.paymentMethod === 'Espèces' ? 'border-primary bg-red-50 text-primary font-bold' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Espèces"
                        className="hidden"
                        checked={formData.paymentMethod === 'Espèces'}
                        onChange={handleInputChange}
                      />
                      Espèces
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                  >
                    <span>💬</span> Commander sur WhatsApp
                  </button>
                  <p className="text-center text-xs text-gray-dark mt-4 italic">
                    En cliquant, votre panier sera envoyé au vendeur sur WhatsApp pour confirmation.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .bg-red-50 { background-color: rgba(210, 10, 17, 0.05); }

        /* Par défaut (mobile) : cartes visibles, tableau caché */
        .cart-mobile-list { display: block; }
        .cart-desktop-table { display: none; }

        /* Desktop : tableau visible, cartes cachées */
        @media (min-width: 768px) {
          .cart-mobile-list { display: none; }
          .cart-desktop-table { display: block; }
        }

        /* Styles des cartes mobiles */
        .cart-card {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid #e5e0d8;
          align-items: flex-start;
        }
        .cart-card-img {
          width: 70px;
          height: 70px;
          min-width: 70px;
          object-fit: cover;
          border-radius: 8px;
        }
        .cart-card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cart-card-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: #0B1B32;
        }
        .cart-card-unit {
          font-size: 0.78rem;
          color: #888;
        }
        .cart-card-price {
          font-size: 0.85rem;
          color: #555;
        }
        .cart-card-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 6px;
          flex-wrap: wrap;
        }
        .cart-card-total {
          font-weight: 800;
          font-size: 1rem;
          color: #D20A11;
          flex: 1;
          text-align: right;
        }
        .cart-card-remove {
          background: none;
          border: none;
          color: #bbb;
          font-size: 1rem;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
        }
        .cart-card-remove:hover { color: #D20A11; }
      `}</style>
    </div>
  );
}

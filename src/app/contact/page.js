"use client";

import { useState, useEffect } from 'react';
import Hero from '../../components/Hero';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    fetch('/api/home').then(res => res.json()).then(data => setHomeData(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero data={homeData?.contactHero} animate={false} showButton={false} />
      
      <div className="container max-w-5xl py-16">
        <div className="section-header">
          <h1 className="section-title">Contactez-nous</h1>
          <p className="mt-4 text-gray-dark text-lg">N'hésitez pas à nous envoyer un message via le formulaire ou directement par email.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Contact Info */}
          <div className="bg-primary text-white p-10 md:p-12 flex flex-col justify-center relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Informations de contact</h2>
              <p className="mb-8 text-white text-opacity-90 leading-relaxed">
                Vous avez une question sur nos produits ? Vous souhaitez passer une commande spéciale pour un événement ? Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl">
                    📧
                  </div>
                  <div>
                    <div className="text-sm text-white text-opacity-80 font-medium">E-mail</div>
                    <div className="font-semibold text-lg">toure.omar811@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="p-10 md:p-12">
            <h2 className="text-2xl font-bold mb-6 text-dark">Envoyez-nous un message</h2>
            
            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Message envoyé !</h3>
                <p>Merci de nous avoir contactés. Nous vous répondrons très bientôt à l'adresse fournie.</p>
                <div className="flex flex-col gap-3 mt-6">
                  <a 
                    href={`mailto:toure.omar811@gmail.com?subject=Contact de ${formData.name}&body=${formData.message}`}
                    className="btn btn-primary py-3"
                  >
                    Ouvrir mon application mail (Recommandé)
                  </a>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-primary font-medium hover:underline"
                  >
                    Envoyer un autre message via le formulaire
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nom complet</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control" 
                    placeholder="Votre nom"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Adresse e-mail</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control" 
                    placeholder="votre.email@exemple.com"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea 
                    id="message" 
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control" 
                    rows="5" 
                    placeholder="Comment pouvons-nous vous aider ?"
                    required 
                  ></textarea>
                </div>
                
                {status === 'error' && (
                  <div className="text-red-500 mb-4 font-medium">
                    Une erreur est survenue. Veuillez réessayer plus tard.
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={status === 'submitting'}
                  style={{ padding: '15px' }}
                >
                  {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

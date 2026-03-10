"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kilo',
    category: 'Céréales & Dérivés',
    image: '',
    popular: false,
    hidden: false,
    available: true,
    inStock: true,
    onSale: false,
    discountPercentage: 0
  });

  const categories = [
    "Céréales & Dérivés",
    "Produits à base d’arachide",
    "Boissons & poudres naturelles",
    "Encens",
    "Produits traditionnels"
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
    setLoading(false);
  };

  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'home'
  const [homeData, setHomeData] = useState(null);
  const [savingHome, setSavingHome] = useState(false);

  const fetchHomeData = async () => {
    try {
      const res = await fetch('/api/home');
      const data = await res.json();
      setHomeData(data);
    } catch (error) {
      console.error("Failed to fetch home data", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchHomeData();
  }, []);

  const handleHomeInputChange = (section, field, value) => {
    setHomeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleHomeMainInputChange = (field, value) => {
    setHomeData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [field]: value
      }
    }));
  };

  const handleReviewChange = (index, field, value) => {
    setHomeData(prev => {
      const newReviews = [...(prev.reviews_data || [])];
      newReviews[index] = { ...newReviews[index], [field]: value };
      return { ...prev, reviews_data: newReviews };
    });
  };

  const addReview = () => {
    setHomeData(prev => ({
      ...prev,
      reviews_data: [...(prev.reviews_data || []), { text: '', name: '' }]
    }));
  };

  const deleteReview = (index) => {
    setHomeData(prev => {
      const newReviews = [...(prev.reviews_data || [])];
      newReviews.splice(index, 1);
      return { ...prev, reviews_data: newReviews };
    });
  };

  const handleSaveHome = async () => {
    setSavingHome(true);
    try {
      const res = await fetch('/api/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homeData)
      });
      if (res.ok) {
        alert("Contenu de l'accueil mis à jour avec succès !");
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Failed to save home data", error);
      alert("Erreur lors de la mise à jour.");
    }
    setSavingHome(false);
  };

  const handleImageUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.filename) {
        callback(data.filename);
      } else {
        alert("Erreur: L'image n'a pas pu être téléchargée.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors du téléchargement.");
    }
  };

  // Render Tabs
  const renderTabs = () => (
    <div className="flex gap-4 mb-8 border-b border-gray-medium overflow-x-auto">
      <button 
        className={`px-4 py-2 font-bold whitespace-nowrap ${activeTab === 'products' ? 'text-primary border-b-2 border-primary' : 'text-gray-dark hover:text-primary'}`}
        onClick={() => setActiveTab('products')}
      >
        Gestion des Produits
      </button>
      <button 
        className={`px-4 py-2 font-bold whitespace-nowrap ${activeTab === 'home' ? 'text-primary border-b-2 border-primary' : 'text-gray-dark hover:text-primary'}`}
        onClick={() => setActiveTab('home')}
      >
        Gestion de l'Accueil
      </button>
      <button 
        className={`px-4 py-2 font-bold whitespace-nowrap ${activeTab === 'about' ? 'text-primary border-b-2 border-primary' : 'text-gray-dark hover:text-primary'}`}
        onClick={() => setActiveTab('about')}
      >
        Gestion de l'À Propos
      </button>
    </div>
  );

  // Render Home Editor
  const renderHomeEditor = () => {
    if (!homeData) return <div>Chargement...</div>;

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-light max-w-4xl">
        <h2 className="text-xl font-bold mb-6 text-primary border-b pb-2">Modifier la page d'accueil</h2>
        
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <h3 className="font-bold mb-4 text-lg">Bannière : Page d'Accueil</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label text-sm">Titre de la bannière</label>
                <input type="text" value={homeData.hero.title} onChange={(e) => handleHomeInputChange('hero', 'title', e.target.value)} className="form-control text-sm py-2" />
              </div>
              <div>
                <label className="form-label text-sm">Sous-titre / Texte de la bannière</label>
                <textarea value={homeData.hero.subtitle} onChange={(e) => handleHomeInputChange('hero', 'subtitle', e.target.value)} className="form-control text-sm" rows="2"></textarea>
              </div>
              <div>
                <label className="form-label text-sm">Image de fond de la bannière</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('hero', 'backgroundImage', filename))} className="form-control text-sm py-2" />
                {homeData.hero.backgroundImage && <p className="text-sm mt-1 text-gray-dark">Fichier actuel : {homeData.hero.backgroundImage}</p>}
              </div>
            </div>
          </div>

          {/* Other Page Heroes */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <h3 className="font-bold mb-4 text-lg">Bannières : Autres Pages</h3>
            <div className="space-y-6">
              {/* Products Page Hero */}
              <div className="p-3 bg-white rounded border border-gray-light">
                <h4 className="font-bold text-sm mb-3 text-secondary">Page : Tous les Produits</h4>
                <div className="space-y-3">
                  <input type="text" placeholder="Titre" value={homeData.productsHero?.title || ''} onChange={(e) => handleHomeInputChange('productsHero', 'title', e.target.value)} className="form-control text-xs py-1.5" />
                  <textarea placeholder="Sous-titre" value={homeData.productsHero?.subtitle || ''} onChange={(e) => handleHomeInputChange('productsHero', 'subtitle', e.target.value)} className="form-control text-xs" rows="2"></textarea>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('productsHero', 'backgroundImage', filename))} className="form-control text-xs" />
                  {homeData.productsHero?.backgroundImage && <p className="text-[10px] text-gray-dark italic">Actuel : {homeData.productsHero.backgroundImage}</p>}
                </div>
              </div>

              {/* Categories Page Hero */}
              <div className="p-3 bg-white rounded border border-gray-light">
                <h4 className="font-bold text-sm mb-3 text-secondary">Page : Nos Catégories</h4>
                <div className="space-y-3">
                  <input type="text" placeholder="Titre" value={homeData.categoriesHero?.title || ''} onChange={(e) => handleHomeInputChange('categoriesHero', 'title', e.target.value)} className="form-control text-xs py-1.5" />
                  <textarea placeholder="Sous-titre" value={homeData.categoriesHero?.subtitle || ''} onChange={(e) => handleHomeInputChange('categoriesHero', 'subtitle', e.target.value)} className="form-control text-xs" rows="2"></textarea>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('categoriesHero', 'backgroundImage', filename))} className="form-control text-xs" />
                  {homeData.categoriesHero?.backgroundImage && <p className="text-[10px] text-gray-dark italic">Actuel : {homeData.categoriesHero.backgroundImage}</p>}
                </div>
              </div>

              {/* Contact Page Hero */}
              <div className="p-3 bg-white rounded border border-gray-light">
                <h4 className="font-bold text-sm mb-3 text-secondary">Page : Contact</h4>
                <div className="space-y-3">
                  <input type="text" placeholder="Titre" value={homeData.contactHero?.title || ''} onChange={(e) => handleHomeInputChange('contactHero', 'title', e.target.value)} className="form-control text-xs py-1.5" />
                  <textarea placeholder="Sous-titre" value={homeData.contactHero?.subtitle || ''} onChange={(e) => handleHomeInputChange('contactHero', 'subtitle', e.target.value)} className="form-control text-xs" rows="2"></textarea>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('contactHero', 'backgroundImage', filename))} className="form-control text-xs" />
                  {homeData.contactHero?.backgroundImage && <p className="text-[10px] text-gray-dark italic">Actuel : {homeData.contactHero.backgroundImage}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Presentation */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <h3 className="font-bold mb-4 text-lg">Section 2 : Présentation de la marque</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label text-sm">Titre de présentation</label>
                <input type="text" value={homeData.presentation.title} onChange={(e) => handleHomeInputChange('presentation', 'title', e.target.value)} className="form-control text-sm py-2" />
              </div>
              <div>
                <label className="form-label text-sm">Texte de description</label>
                <textarea value={homeData.presentation.text} onChange={(e) => handleHomeInputChange('presentation', 'text', e.target.value)} className="form-control text-sm" rows="4"></textarea>
              </div>
            </div>
          </div>

          {/* Section Titles */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <h3 className="font-bold mb-4 text-lg">Titres des sections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-sm">Titre : Produits Populaires</label>
                <input type="text" value={homeData.sections.popular} onChange={(e) => handleHomeMainInputChange('popular', e.target.value)} className="form-control text-sm py-2" />
              </div>
              <div>
                <label className="form-label text-sm">Titre : Parcourir par catégories</label>
                <input type="text" value={homeData.sections.categories} onChange={(e) => handleHomeMainInputChange('categories', e.target.value)} className="form-control text-sm py-2" />
              </div>
              <div>
                <label className="form-label text-sm">Titre : Avis Clients</label>
                <input type="text" value={homeData.sections.reviews} onChange={(e) => handleHomeMainInputChange('reviews', e.target.value)} className="form-control text-sm py-2" />
              </div>
            </div>
          </div>

          {/* Bestsellers Section */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <h3 className="font-bold mb-4 text-lg">Section : Nos Meilleures Ventes</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label text-sm">Titre</label>
                <input type="text" value={homeData.bestsellers?.title || ''} onChange={(e) => handleHomeInputChange('bestsellers', 'title', e.target.value)} className="form-control text-sm py-2" />
              </div>
              <div>
                <label className="form-label text-sm">Description</label>
                <textarea value={homeData.bestsellers?.description || ''} onChange={(e) => handleHomeInputChange('bestsellers', 'description', e.target.value)} className="form-control text-sm" rows="3"></textarea>
              </div>
              <div>
                <label className="form-label text-sm">Image de la section</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('bestsellers', 'image', filename))} className="form-control text-sm py-2" />
                {homeData.bestsellers?.image && <p className="text-sm mt-1 text-gray-dark">Fichier actuel : {homeData.bestsellers.image}</p>}
              </div>
            </div>
          </div>

          {/* Reference Section */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <h3 className="font-bold mb-4 text-lg">Section : Notre Référence</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label text-sm">Titre</label>
                <input type="text" value={homeData.reference?.title || ''} onChange={(e) => handleHomeInputChange('reference', 'title', e.target.value)} className="form-control text-sm py-2" />
              </div>
              <div>
                <label className="form-label text-sm">Description</label>
                <textarea value={homeData.reference?.description || ''} onChange={(e) => handleHomeInputChange('reference', 'description', e.target.value)} className="form-control text-sm" rows="3"></textarea>
              </div>
              <div>
                <label className="form-label text-sm">Image de la section (grande image large recommandée)</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('reference', 'image', filename))} className="form-control text-sm py-2" />
                {homeData.reference?.image && <p className="text-sm mt-1 text-gray-dark">Fichier actuel : {homeData.reference.image}</p>}
              </div>
            </div>
          </div>

          {/* Category Images */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <h3 className="font-bold mb-4 text-lg">Images des catégories (Section: Parcourir par catégories)</h3>
            <p className="text-sm text-gray-dark mb-4">Sélectionnez une image depuis votre ordinateur pour chaque catégorie.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-sm">Image : Céréales & Dérivés</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('categoryImages', 'cereals', filename))} className="form-control text-sm py-2" />
                {homeData.categoryImages?.cereals && <p className="text-sm mt-1 text-gray-dark">Fichier actuel : {homeData.categoryImages.cereals}</p>}
              </div>
              <div>
                <label className="form-label text-sm">Image : Base d’arachide</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('categoryImages', 'peanuts', filename))} className="form-control text-sm py-2" />
                {homeData.categoryImages?.peanuts && <p className="text-sm mt-1 text-gray-dark">Fichier actuel : {homeData.categoryImages.peanuts}</p>}
              </div>
              <div>
                <label className="form-label text-sm">Image : Boissons Naturelles</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('categoryImages', 'drinks', filename))} className="form-control text-sm py-2" />
                {homeData.categoryImages?.drinks && <p className="text-sm mt-1 text-gray-dark">Fichier actuel : {homeData.categoryImages.drinks}</p>}
              </div>
              <div>
                <label className="form-label text-sm">Image : Encens</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('categoryImages', 'incense', filename))} className="form-control text-sm py-2" />
                {homeData.categoryImages?.incense && <p className="text-sm mt-1 text-gray-dark">Fichier actuel : {homeData.categoryImages.incense}</p>}
              </div>
              <div>
                <label className="form-label text-sm">Image : Produits Traditionnels</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('categoryImages', 'traditional', filename))} className="form-control text-sm py-2" />
                {homeData.categoryImages?.traditional && <p className="text-sm mt-1 text-gray-dark">Fichier actuel : {homeData.categoryImages.traditional}</p>}
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Section : Avis Clients</h3>
              <button type="button" onClick={addReview} className="btn bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-3">
                + Ajouter un avis
              </button>
            </div>
            <div className="space-y-6">
              {(homeData.reviews_data || []).map((review, index) => (
                <div key={index} className="p-3 bg-white rounded border border-gray-medium relative group">
                  <button 
                    type="button" 
                    onClick={() => deleteReview(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm"
                  >
                    &times;
                  </button>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="form-label text-xs">Nom du client</label>
                      <input 
                        type="text" 
                        value={review.name} 
                        onChange={(e) => handleReviewChange(index, 'name', e.target.value)} 
                        className="form-control text-sm py-1"
                        placeholder="Ex: Mariama S."
                      />
                    </div>
                    <div>
                      <label className="form-label text-xs">Commentaire</label>
                      <textarea 
                        value={review.text} 
                        onChange={(e) => handleReviewChange(index, 'text', e.target.value)} 
                        className="form-control text-sm" 
                        rows="2"
                        placeholder="Son témoignage..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
              {(!homeData.reviews_data || homeData.reviews_data.length === 0) && (
                <p className="text-sm text-gray-dark text-center py-4 italic">Aucun avis ajouté.</p>
              )}
            </div>
          </div>

          {/* CTA Group */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <h3 className="font-bold mb-4 text-lg">Section Call-To-Action (Bas de page)</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label text-sm">Titre de l'action</label>
                <input type="text" value={homeData.cta.title} onChange={(e) => handleHomeInputChange('cta', 'title', e.target.value)} className="form-control text-sm py-2" />
              </div>
              <div>
                <label className="form-label text-sm">Texte d'accompagnement</label>
                <textarea value={homeData.cta.text} onChange={(e) => handleHomeInputChange('cta', 'text', e.target.value)} className="form-control text-sm" rows="2"></textarea>
              </div>
            </div>
          </div>

          <button onClick={handleSaveHome} disabled={savingHome} className="btn btn-primary w-full py-3 text-lg mt-6">
            {savingHome ? 'Sauvegarde...' : 'Sauvegarder les modifications de l\'accueil'}
          </button>
        </div>
      </div>
    );
  };

  const renderAboutEditor = () => {
    if (!homeData) return <div>Chargement...</div>;

    const handleAboutInputChange = (section, field, value) => {
      setHomeData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    };

    const handleValueChange = (index, field, value) => {
      setHomeData(prev => {
        const newValues = [...prev.aboutSections.values];
        newValues[index] = { ...newValues[index], [field]: value };
        return {
          ...prev,
          aboutSections: {
            ...prev.aboutSections,
            values: newValues
          }
        };
      });
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-light max-w-4xl">
        <h2 className="text-xl font-bold mb-6 text-primary border-b pb-2">Modifier la page À Propos</h2>
        
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <h3 className="font-bold mb-4 text-lg">Bannière de la page À Propos</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="form-label text-sm">Titre</label>
                <input type="text" value={homeData.aboutHero?.title || ''} onChange={(e) => handleAboutInputChange('aboutHero', 'title', e.target.value)} className="form-control text-sm py-2" />
              </div>
              <div>
                <label className="form-label text-sm">Sous-titre</label>
                <textarea value={homeData.aboutHero?.subtitle || ''} onChange={(e) => handleAboutInputChange('aboutHero', 'subtitle', e.target.value)} className="form-control text-sm" rows="2"></textarea>
              </div>
              <div>
                <label className="form-label text-sm">Image de fond</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleAboutInputChange('aboutHero', 'backgroundImage', filename))} className="form-control text-sm py-2" />
                {homeData.aboutHero?.backgroundImage && <p className="text-sm mt-1 text-gray-dark italic">Actuel : {homeData.aboutHero.backgroundImage}</p>}
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <h3 className="font-bold mb-4 text-lg">Section 1 : Notre Histoire</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label text-sm">Titre</label>
                <input type="text" value={homeData.aboutSections?.storyTitle || ''} onChange={(e) => handleHomeInputChange('aboutSections', 'storyTitle', e.target.value)} className="form-control text-sm py-2" />
              </div>
              <div>
                <label className="form-label text-sm">Texte</label>
                <textarea value={homeData.aboutSections?.storyText || ''} onChange={(e) => handleHomeInputChange('aboutSections', 'storyText', e.target.value)} className="form-control text-sm" rows="5"></textarea>
              </div>
              <div>
                <label className="form-label text-sm">Image</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('aboutSections', 'storyImage', filename))} className="form-control text-sm py-2" />
                {homeData.aboutSections?.storyImage && <p className="text-sm mt-1 text-gray-dark italic">Actuel : {homeData.aboutSections.storyImage}</p>}
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <h3 className="font-bold mb-4 text-lg">Section 2 : Nos Valeurs</h3>
            <div className="space-y-6">
              <div>
                <label className="form-label text-sm">Titre de la section</label>
                <input type="text" value={homeData.aboutSections?.valuesTitle || ''} onChange={(e) => handleHomeInputChange('aboutSections', 'valuesTitle', e.target.value)} className="form-control text-sm py-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(homeData.aboutSections?.values || []).map((value, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-gray-light">
                    <h4 className="font-bold text-xs mb-2 text-primary">Valeur {index + 1}</h4>
                    <input type="text" placeholder="Titre" value={value.title} onChange={(e) => handleValueChange(index, 'title', e.target.value)} className="form-control text-xs mb-2" />
                    <textarea placeholder="Description" value={value.text} onChange={(e) => handleValueChange(index, 'text', e.target.value)} className="form-control text-xs" rows="3"></textarea>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quality Commitment */}
          <div className="p-4 bg-gray-50 rounded border border-gray-medium">
            <h3 className="font-bold mb-4 text-lg">Section 3 : Engagement Qualité</h3>
            <div className="space-y-4">
              <div>
                <label className="form-label text-sm">Titre</label>
                <input type="text" value={homeData.aboutSections?.qualityTitle || ''} onChange={(e) => handleHomeInputChange('aboutSections', 'qualityTitle', e.target.value)} className="form-control text-sm py-2" />
              </div>
              <div>
                <label className="form-label text-sm">Texte</label>
                <textarea value={homeData.aboutSections?.qualityText || ''} onChange={(e) => handleHomeInputChange('aboutSections', 'qualityText', e.target.value)} className="form-control text-sm" rows="5"></textarea>
              </div>
              <div>
                <label className="form-label text-sm">Image</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => handleHomeInputChange('aboutSections', 'qualityImage', filename))} className="form-control text-sm py-2" />
                {homeData.aboutSections?.qualityImage && <p className="text-sm mt-1 text-gray-dark italic">Actuel : {homeData.aboutSections.qualityImage}</p>}
              </div>
            </div>
          </div>

          <button onClick={handleSaveHome} disabled={savingHome} className="btn btn-primary w-full py-3 text-lg mt-6">
            {savingHome ? 'Sauvegarde...' : 'Sauvegarder les modifications de "À Propos"'}
          </button>
        </div>
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      unit: product.unit || 'kilo',
      category: product.category || categories[0],
      image: product.image || '',
      popular: product.popular || false,
      hidden: product.hidden || false,
      available: product.available !== undefined ? product.available : true,
      inStock: product.inStock !== undefined ? product.inStock : true,
      onSale: product.onSale || false,
      discountPercentage: product.discountPercentage || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0
    };

    const url = isEditing ? `/api/products/${currentId}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchProducts();
        handleCancel();
        alert(isEditing ? "Produit modifié avec succès." : "Produit ajouté avec succès.");
      } else {
        alert("Erreur lors de l'enregistrement.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: 'kilo',
      category: 'Céréales & Dérivés',
      image: '',
      popular: false,
      hidden: false,
      available: true,
      inStock: true,
      onSale: false,
      discountPercentage: 0
    });
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-dark">Tableau de bord Administrateur</h1>
          <Link href="/" className="text-primary hover:underline">
            &larr; Retour au site
          </Link>
        </div>

        {renderTabs()}

        {activeTab === 'home' && renderHomeEditor()}
        {activeTab === 'about' && renderAboutEditor()}
        {activeTab === 'products' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-light sticky top-24">
                <h2 className="text-xl font-bold mb-6 text-primary border-b pb-2">
                  {isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="form-label text-sm">Nom du produit</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control text-sm py-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label text-sm">Prix ($)</label>
                      <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="form-control text-sm py-2" />
                    </div>
                    <div>
                      <label className="form-label text-sm">Unité (kilo, litre, ...)</label>
                      <input required type="text" name="unit" value={formData.unit} onChange={handleInputChange} className="form-control text-sm py-2" />
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-sm">Catégorie</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="form-control text-sm py-2">
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="form-label text-sm">Image du produit</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (filename) => setFormData(prev => ({...prev, image: filename})))} className="form-control text-sm py-2" />
                    {formData.image && <p className="text-sm mt-1 text-gray-dark">Fichier actuel : {formData.image}</p>}
                  </div>

                  <div>
                    <label className="form-label text-sm">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control text-sm" rows="3"></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="popular" name="popular" checked={formData.popular} onChange={handleInputChange} className="w-4 h-4 cursor-pointer" />
                      <label htmlFor="popular" className="cursor-pointer text-xs font-medium">Populaire</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="hidden" name="hidden" checked={formData.hidden} onChange={handleInputChange} className="w-4 h-4 cursor-pointer" />
                      <label htmlFor="hidden" className="cursor-pointer text-xs font-medium">Masquer</label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="available" name="available" checked={formData.available} onChange={handleInputChange} className="w-4 h-4 cursor-pointer" />
                      <label htmlFor="available" className="cursor-pointer text-xs font-medium">Disponible</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="inStock" name="inStock" checked={formData.inStock} onChange={handleInputChange} className="w-4 h-4 cursor-pointer" />
                      <label htmlFor="inStock" className="cursor-pointer text-xs font-medium">En stock</label>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded border border-gray-medium">
                    <div className="flex items-center gap-2 mb-2">
                      <input type="checkbox" id="onSale" name="onSale" checked={formData.onSale} onChange={handleInputChange} className="w-4 h-4 cursor-pointer" />
                      <label htmlFor="onSale" className="cursor-pointer text-xs font-bold text-primary">En PROMO</label>
                    </div>
                    {formData.onSale && (
                      <div>
                        <label className="form-label text-xs">Remise (%)</label>
                        <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleInputChange} className="form-control text-sm py-1" />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button type="submit" className="btn btn-primary flex-1 py-2 text-sm">
                      {isEditing ? 'Enregistrer' : 'Ajouter'}
                    </button>
                    {isEditing && (
                      <button type="button" onClick={handleCancel} className="btn bg-gray-medium hover:bg-gray-dark text-white flex-1 py-2 text-sm">
                        Annuler
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Product List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold bg-white p-4 rounded-lg shadow-sm border border-gray-light flex justify-between items-center">
                <span>Produits Actuels</span>
                <span className="text-sm font-normal bg-primary text-white rounded-full px-3 py-1">{products.length}</span>
              </h2>

              {loading ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">Chargement des produits...</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {products.map(product => (
                    <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-light flex flex-col">
                      <div className="flex gap-4 items-start mb-4 flex-grow">
                        <div className="w-16 h-16 bg-gray-light flex-shrink-0 rounded overflow-hidden">
                          <img 
                            src={`/site amal/${product.image}`} 
                            alt="" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="font-bold text-lg truncate" title={product.name}>{product.name}</h3>
                          <p className="text-sm text-gray-dark truncate">{product.category}</p>
                          <p className="font-bold text-primary mt-1">{product.price} $ / {product.unit}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-3 border-t border-gray-light mt-auto">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="flex-1 py-1.5 text-sm font-semibold rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        >
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="flex-1 py-1.5 text-sm font-semibold rounded bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import fs from 'fs/promises';
import path from 'path';

export async function getHomeData() {
  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'home.json');
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading home data:', error);
    // Fallback default data
    return {
      hero: {
        title: "Les Trésors de l'Arisanat Sénégalais",
        subtitle: "Des produits 100% naturels, authentiques et préparés avec passion.",
        buttonText: "Découvrir les produits",
        backgroundImage: "Background.png"
      },
      presentation: {
        title: "Bienvenue chez Amal",
        text: "Amal est née de notre amour pour les traditions et les saveurs uniques de l'Afrique."
      },
      sections: {
        popular: "Nos produits populaires",
        categories: "Parcourir par catégories",
        cereals: "🌾 Céréales & Dérivés",
        peanuts: "🥜 Produits à base d’arachide",
        drinks: "🌺 Boissons & poudres naturelles",
        incense: "⛩ Encens et produits traditionnels",
        reviews: "Ce que disent nos clients"
      },
      cta: {
        title: "Vous avez une demande spéciale ?",
        text: "N'hésitez pas à nous contacter.",
        buttonContact: "Nous contacter",
        buttonCatalog: "Voir le catalogue"
      },
      categoryImages: {
        cereals: "araw2.png",
        peanuts: "patte d'arachide a jour.png",
        drinks: "bissap rouge1.png",
        incense: "encens poudre1.jpg",
        traditional: "tous les autres produits1.jpeg"
      }
    };
  }
}

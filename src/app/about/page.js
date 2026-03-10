import Hero from '../../components/Hero';
import { getHomeData } from '../lib/home';
import './About.css';

export default async function AboutPage() {
  const homeData = await getHomeData();
  const data = homeData.aboutSections;

  return (
    <div className="about-page">
      {/* Hero Section */}
      <Hero data={homeData.aboutHero} showButton={false} />

      {/* Section 1: Our Story */}
      <section className="about-section py-16 bg-light">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-container shadow-2xl">
              <img 
                src={`/site amal/${data.storyImage}`} 
                alt="Notre histoire" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="about-content">
              <h2 className="section-title mb-6">{data.storyTitle}</h2>
              <p className="text-lg leading-relaxed text-dark opacity-90">
                {data.storyText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Our Values */}
      <section className="values-section py-16 bg-dark text-white">
        <div className="container">
          <div className="section-header text-center mb-12">
            <h2 className="section-title text-white">{data.valuesTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {data.values.map((value, index) => (
              <div key={index} className="value-card p-8 rounded-xl">
                <div className="text-primary text-3xl mb-4 font-bold">0{index + 1}</div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-white/80">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Commitment */}
      <section className="commitment-section py-16 bg-light">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <h2 className="section-title mb-6">{data.qualityTitle}</h2>
              <p className="text-lg leading-relaxed text-dark opacity-90">
                {data.qualityText}
              </p>
            </div>
            <div className="about-image-container shadow-2xl">
              <img 
                src={`/site amal/${data.qualityImage}`} 
                alt="Notre engagement" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (Reusing design from homepage) */}
      <section className="cta-section py-16 bg-white">
        <div className="container text-center">
          <div className="cta-box max-w-2xl mx-auto p-12 bg-light rounded-2xl shadow-sm border border-gray-medium">
            <h2 className="text-3xl mb-6">Rejoignez l'aventure Amal</h2>
            <p className="mb-8 text-lg">Découvrez tous nos produits naturels et profitez du meilleur du terroir sénégalais livré chez vous.</p>
            <div className="flex justify-center">
              <a href="/products" className="btn btn-primary px-10 py-4 text-lg">Voir le catalogue</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

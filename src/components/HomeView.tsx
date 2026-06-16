import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Sparkles, Star } from 'lucide-react';
import { Product } from '../types';
import { products } from '../data/products';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onAddToCart: (product: Product) => void;
  onAddToShelf: (product: Product) => void;
  isSavedOnShelf: (product: Product) => boolean;
  onOpenQuiz: () => void;
}

export default function HomeView({
  onNavigate,
  onAddToCart,
  onAddToShelf,
  isSavedOnShelf,
  onOpenQuiz
}: HomeViewProps) {
  // Take first 4 items as New Launches
  const newLaunches = products.slice(0, 4);

  // Category navigation helper
  const handleCategoryClick = (category: string) => {
    // For simplicity, we can pass category parameter to filter in Catalog
    onNavigate('catalog');
  };

  return (
    <div className="animate-fade-in space-y-16 md:space-y-24">
      
      {/* 1. Hero Banner */}
      <section className="relative h-[80vh] md:h-[85vh] overflow-hidden flex items-center px-4 md:px-8">
        <div className="absolute inset-0 z-0 rounded-[40px] overflow-hidden m-4 md:m-6 shadow-2xl">
          <img 
            className="w-full h-full object-cover object-center brightness-90 transition-transform duration-700 hover:scale-105" 
            alt="Frascos de sueros de vidrio minimalistas dispuestos estéticamente bajo la luz del amanecer" 
            src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=1600&q=80"
          />
          <div className="absolute inset-0 bg-stone-900/40" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
          <div className="max-w-xl text-left space-y-6 bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-[40px] border border-white/50 shadow-xl ml-4">
            <span className="text-[10px] text-[#5A5A40] tracking-[0.3em] font-semibold uppercase block animate-fade-in-up">
              BIENESTAR CIENTÍFICO Y SENSORIAL
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-stone-850 leading-tight italic animate-fade-in-up">
              La Belleza del <br />
              <span className="not-italic font-sans text-stone-800 tracking-wide font-light">Lujo Silencioso</span>
            </h1>
            <p className="text-sm md:text-base text-stone-600 max-w-md leading-relaxed animate-fade-in-up font-light">
              Skincare de alta eficacia formulado con precisión clínica y pureza botánica para guiar tu ritual de meditación diario.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 animate-fade-in-up">
              <button 
                onClick={() => onNavigate('catalog')}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#5A5A40] text-white font-semibold text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-all duration-300 shadow-md"
                id="hero-shop-btn"
              >
                Descubrir Catálogo
              </button>
              <button 
                onClick={onOpenQuiz}
                className="inline-flex items-center justify-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-stone-200 text-[#5A5A40] font-semibold text-xs uppercase tracking-widest rounded-full hover:bg-white transition-all duration-300"
                id="hero-quiz-btn"
              >
                Skin Quiz AI →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Promociones Exclusivas */}
      <section className="bg-white/40 backdrop-blur-md rounded-full max-w-4xl mx-auto py-4 px-8 border border-white/30 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
          <span className="px-3 py-1 bg-[#5A5A40] text-white rounded-full font-label-sm text-[10px] uppercase tracking-widest font-bold">
            Promoción Exclusiva
          </span>
          <p className="text-xs md:text-sm text-stone-700 font-medium">
            Disfruta de un <span className="font-bold">15% de descuento</span> en tu primer pedido con el código <span className="underline decoration-stone-400 font-bold tracking-widest bg-white/60 px-2 py-0.5 rounded">AURA15</span>
          </p>
        </div>
      </section>

      {/* 3. Nuevos Lanzamientos */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop" id="new-launches">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12">
          <div>
            <span className="text-[10px] text-stone-400 tracking-widest uppercase block mb-1">ALTA EFICACIA</span>
            <h2 className="font-serif italic text-3xl md:text-4xl text-stone-800 font-light">Nuevos Lanzamientos</h2>
            <p className="text-stone-500 font-light text-sm mt-2 max-w-md">Nuestras últimas formulaciones botánicas enriquecidas para revivir la piel estresada.</p>
          </div>
          <button 
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#5A5A40] hover:text-stone-800 border-b border-[#5A5A40]/30 pb-1 mt-4 md:mt-0 transition-all font-bold"
            id="home-view-all-launches"
          >
            Ver Todos los Productos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel Grid layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
          {newLaunches.map((product) => {
            const saved = isSavedOnShelf(product);
            return (
              <div 
                key={product.id} 
                className="group relative flex flex-col justify-between bg-white/40 backdrop-blur-md rounded-[32px] border border-white/50 p-4 hover:bg-white/80 transition-all duration-350 shadow-sm"
              >
                <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-[24px]">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={product.name} 
                    src={product.imageUrl}
                  />
                  {/* Floating heart icon */}
                  <button 
                    onClick={() => onAddToShelf(product)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-full text-stone-700 hover:bg-[#5A5A40] hover:text-white transition-all duration-300 animate-fade-in"
                    aria-label="Añadir a mi estantería"
                  >
                    <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current text-[#5A5A40]' : 'text-stone-700'}`} />
                  </button>
                </div>

                <div className="space-y-1 px-1">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block italic font-serif">
                    {product.category}
                  </span>
                  <h3 className="font-sans text-xs md:text-sm text-stone-800 leading-tight font-medium group-hover:text-[#5A5A40] transition-colors cursor-pointer" onClick={() => onNavigate('catalog')}>
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 py-0.5">
                    <div className="flex text-[#C5A880]">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {product.rating.toFixed(1)} ({product.reviewsCount})
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <p className="font-sans text-xs md:text-sm text-stone-950 font-bold">
                      ${product.price.toFixed(2)}
                    </p>
                    <button 
                      onClick={() => onAddToCart(product)}
                      className="text-[9px] uppercase tracking-widest font-bold text-[#5A5A40] border border-[#5A5A40]/30 hover:bg-[#5A5A40] hover:text-white px-2.5 py-1.5 rounded-full transition-all"
                    >
                      + Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Categorías Grid */}
      <section className="py-16 md:py-24 bg-white/20 backdrop-blur-sm border-y border-white/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-12 md:mb-16">
            <span className="text-[10px] text-stone-400 tracking-[0.2em] uppercase block font-semibold">APOTHECARY BIENESTAR</span>
            <h2 className="font-serif italic text-3xl md:text-4xl text-stone-800 font-light">Comprar por Categoría</h2>
            <p className="text-stone-500 text-sm font-light max-w-md mx-auto">Soluciones botánicas de alta concentración específicamente curadas para tu piel.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {[
              { id: 'cleansers', label: 'Limpiadores', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80', desc: 'Preservan la flora dérmica natural.' },
              { id: 'serums', label: 'Sueros Hidratantes', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80', desc: 'Concentrados moleculares de restauración.' },
              { id: 'moisturizers', label: 'Cremas Protectoras', image: 'https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?auto=format&fit=crop&w=600&q=80', desc: 'Emulsiones ricas en lípidos naturales.' },
              { id: 'sunscreen', label: 'Protección Solar', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80', desc: 'Fluidización mineral ligera de amplio espectro.' }
            ].map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => handleCategoryClick(cat.id)}
                className="group text-left bg-white/40 backdrop-blur-md rounded-[32px] border border-white/50 p-5 transition-all duration-300 hover:bg-white/80 hover:shadow-md focus:outline-none"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-stone-100">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={cat.label} 
                    src={cat.image}
                  />
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-all" />
                </div>
                <div className="space-y-1.5 mt-4">
                  <h3 className="font-serif text-lg text-stone-850 flex items-center gap-1 group-hover:text-[#5A5A40] transition-colors">
                    {cat.label} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="text-xs text-stone-400 font-light leading-relaxed">{cat.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Diario Aura - The Aura Journal */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] text-[#5A5A40] tracking-widest uppercase block font-semibold">DIARIO DE AUTOCUIDADO</span>
            <h2 className="font-serif italic text-3xl md:text-4xl text-stone-800 font-light leading-tight">Rituales para una Mente y Piel Conscientes</h2>
            <p className="text-stone-500 text-sm md:text-base font-light leading-relaxed max-w-lg">
              Exploramos la longevidad dérmica, la nutrición botánica y el arte ancestral de los rituales del amanecer. En AURA SKIN, creemos que el cuidado de tu piel es un momento consagrado al silencio y la introspección.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => onNavigate('catalog')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#5A5A40] border-b border-[#5A5A40]/30 pb-1 group transition-all font-bold"
                id="read-journal-btn"
              >
                <span>Explorar Colección de Rituales</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-[40px] overflow-hidden shadow-xl border border-white/55">
              <img 
                className="w-full h-full object-cover" 
                alt="Taza rústica de té de manzanilla caliente junto a un cuaderno bajo la luz reconfortante de la mañana" 
                src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

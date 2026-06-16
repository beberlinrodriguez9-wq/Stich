import React, { useState } from 'react';
import { Sparkles, Trash2, Heart, Share2, ShoppingBag, X, Check, Copy } from 'lucide-react';
import { Product } from '../types';

interface ShelfViewProps {
  shelfItems: Product[];
  onRemoveFromShelf: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onMoveAllToCart: () => void;
  onNavigate: (view: string) => void;
  onOpenQuiz: () => void;
}

export default function ShelfView({
  shelfItems,
  onRemoveFromShelf,
  onAddToCart,
  onMoveAllToCart,
  onNavigate,
  onOpenQuiz
}: ShelfViewProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleShareRoutine = () => {
    // Generate simple routine share link
    const itemIds = shelfItems.map(item => item.id).join(',');
    const shareUrl = `${window.location.origin}/?routine=${itemIds}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="animate-fade-in max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 space-y-12">
      
      {/* 1. Header with custom collection overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/20 pb-6 text-left">
        <div className="space-y-1">
          <span className="text-[10px] text-stone-450 tracking-widest uppercase block font-semibold">COLECCIÓN PERSONAL</span>
          <h1 className="font-serif italic text-3xl md:text-5xl text-stone-850 font-light">My Skin Shelf</h1>
          <p className="text-stone-500 font-light text-sm max-w-lg mt-2">
            Tu estantería de cuidado personalizada. Aquí descansan las elipsis recomendadas e inteligentes ideales para tu piel.
          </p>
        </div>

        {shelfItems.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleShareRoutine}
              className="inline-flex items-center gap-2 text-xs px-6 py-3 border border-stone-350 text-stone-700 bg-white/60 hover:bg-[#5A5A40] hover:text-white transition-all duration-300 rounded-full font-bold uppercase tracking-wider shadow-sm"
              id="share-rutina-btn"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-secondary" />
                  <span>¡Enlace Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir Rutina</span>
                </>
              )}
            </button>
            <button 
              onClick={onMoveAllToCart}
              className="inline-flex items-center gap-2 text-xs px-6 py-3 bg-[#5A5A40] text-white hover:bg-stone-800 transition-all duration-300 rounded-full font-bold uppercase tracking-wider shadow-md"
              id="move-all-cart-btn"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-secondary" />
              <span>Mover Todo al Carrito</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Empty state */}
      {shelfItems.length === 0 ? (
        <section className="py-20 flex flex-col items-center text-center space-y-6 max-w-xl mx-auto">
          <div className="w-48 h-48 opacity-30 rounded-[30px] overflow-hidden">
            <img 
              alt="Estantería vacía esperando fórmulas" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1590156546746-c2240999f280?auto=format&fit=crop&w=400&q=80"
            />
          </div>
          <h2 className="font-serif italic text-2xl text-stone-800">Tu estantería espera sus fórmulas</h2>
          <p className="text-stone-500 font-light text-sm leading-relaxed">
            Explora nuestra botica digital de skincare premium y guarda los productos preferidos con el corazón para estructurar tu rutina diaria.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full">
            <button 
              onClick={() => onNavigate('catalog')}
              className="flex-1 py-4 bg-[#5A5A40] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-transform shadow-md"
            >
              Explorar el Catálogo
            </button>
            <button 
              onClick={onOpenQuiz}
              className="flex-1 py-4 border border-stone-300 bg-white/60 text-stone-700 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white transition-colors"
            >
              Hacer el Skin Quiz AI
            </button>
          </div>
        </section>
      ) : (
        /* 3. Skin Shelf items list grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {shelfItems.map((product) => (
            <div key={product.id} className="group bg-white/40 backdrop-blur-md border border-white/50 rounded-[32px] p-5 hover:bg-white/80 transition-all duration-300 flex flex-col justify-between shadow-sm">
              <div>
                <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-stone-100 mb-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Remove cross button */}
                  <button 
                    onClick={() => onRemoveFromShelf(product)}
                    className="absolute top-3 right-3 p-1.5 bg-white/70 backdrop-blur-md rounded-full text-stone-700 hover:bg-[#5A5A40] hover:text-white transition-all shadow-sm"
                    aria-label="Remover de mi estantería"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 px-1 text-left">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-stone-400 font-sans uppercase tracking-widest block font-bold">
                      {product.category}
                    </span>
                    <span className="font-bold text-stone-900 text-sm">${product.price.toFixed(2)}</span>
                  </div>
                  <h3 className="font-sans text-base text-stone-850 leading-tight font-medium group-hover:text-[#5A5A40] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/20 pt-4 space-y-4 px-1">
                {/* Benefits / Skin Types Chips */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 bg-white/70 border border-white/30 rounded-full text-[9px] uppercase font-bold tracking-wider text-stone-500">
                    {product.skinType}
                  </span>
                  {product.benefits.slice(0, 1).map((b, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white/70 border border-white/30 rounded-full text-[9px] uppercase font-bold tracking-wider text-stone-500">
                      {b}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => onAddToCart(product)}
                  className="w-full py-2.5 border border-[#5A5A40]/30 text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white transition-all duration-300 text-xs font-bold uppercase tracking-widest rounded-full"
                >
                  Mover al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Complete Routine Advices Block */}
      {shelfItems.length > 0 && (
        <section className="bg-white/40 backdrop-blur-md rounded-[40px] border border-white/50 p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="text-[10px] text-[#5A5A40] tracking-widest uppercase font-bold flex items-center gap-1.5 leading-none">
                <Sparkles className="w-4 h-4 text-[#5A5A40] animate-pulse" /> COMPLETA TU RITUAL MENTAL
              </span>
              <h3 className="font-serif italic text-2xl md:text-3xl text-stone-800 font-light leading-tight">Consigue una Calibración de Piel Inteligente</h3>
              <p className="text-stone-500 font-light text-sm leading-relaxed">
                Nuestros dermatólogos formulan soluciones específicas basadas en tu selección actual de elipsis. Consigue consejos personalizados y un ritual adaptado a tu estilo de vida en segundos con nuestra inteligencia artificial integrada.
              </p>
              <div className="pt-2">
                <button 
                  onClick={onOpenQuiz}
                  className="px-8 py-3.5 bg-[#5A5A40] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-colors shadow-md"
                  id="start-skin-quiz-shelf"
                >
                  Tomar el Skin Quiz AI
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 relative hidden md:block">
              <div className="aspect-[4/3] rounded-[30px] overflow-hidden border border-white/50 shadow-sm">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Dedo tocando una gota pura de suero sobre azulejos blancos" 
                  src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80"
                />
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

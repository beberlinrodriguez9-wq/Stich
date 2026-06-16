import React, { useState, useMemo } from 'react';
import { Filter, X, Heart, Star, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';
import { products } from '../data/products';

interface CatalogViewProps {
  onAddToCart: (product: Product) => void;
  onAddToShelf: (product: Product) => void;
  isSavedOnShelf: (product: Product) => boolean;
  searchQuery: string;
  onClearSearch: () => void;
}

export default function CatalogView({
  onAddToCart,
  onAddToShelf,
  isSavedOnShelf,
  searchQuery,
  onClearSearch
}: CatalogViewProps) {
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(140);
  const [mobileFiltersOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Memoized filter and search results
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Search Match
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // 2. Category Match
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Skin Type Match
      if (selectedSkinType !== 'all') {
        const pType = product.skinType.toLowerCase();
        const targetType = selectedSkinType.toLowerCase();
        // matches 'sensitive', 'dry', 'oily'
        if (targetType === 'dry' && !pType.includes('dry')) return false;
        if (targetType === 'oily' && !pType.includes('oily')) return false;
        if (targetType === 'sensitive' && !pType.includes('sensitive')) return false;
      }

      // 4. Price Match
      if (product.price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, selectedSkinType, maxPrice, searchQuery]);

  const categories = [
    { id: 'all', label: 'Ver Todos' },
    { id: 'cleansers', label: 'Limpiadores' },
    { id: 'serums', label: 'Sueros Hidratantes' },
    { id: 'moisturizers', label: 'Cremas' },
    { id: 'sunscreen', label: 'Bloqueadores Solar' },
    { id: 'masks', label: 'Mascarillas y Tratamientos' }
  ];

  const skinTypes = [
    { id: 'all', label: 'Cualquier Piel' },
    { id: 'dry', label: 'Piel Seca' },
    { id: 'oily', label: 'Piel Grasa' },
    { id: 'sensitive', label: 'Piel Sensible' }
  ];

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSkinType('all');
    setMaxPrice(140);
    onClearSearch();
  };

  return (
    <div className="animate-fade-in max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
      
      {/* 1. Header description panel */}
      <div className="mb-10 text-left border-b border-white/20 pb-6">
        <h1 className="font-serif italic text-3xl md:text-5xl text-stone-850 font-light mb-3">Colección de Fórmulas</h1>
        <p className="text-stone-500 font-light text-sm max-w-2xl leading-relaxed">
          Nuestra botica digital ofrece elipsis moleculares desarrolladas clínicamente. Libres de siliconas, sulfatos y aditivos que interrumpan la respiración celular nativa.
        </p>
        
        {searchQuery && (
          <div className="mt-4 flex items-center gap-3 bg-white/60 backdrop-blur-md border border-white/40 w-fit px-4 py-2 rounded-full text-xs">
            <span className="text-stone-600">Búsqueda: <strong className="text-[#5A5A40]">"{searchQuery}"</strong></span>
            <button onClick={onClearSearch} className="text-[#5A5A40] font-bold hover:scale-110 transition-transform">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Top toolbar chips / triggers */}
      <div className="flex justify-between items-center mb-8 bg-white/40 backdrop-blur-md p-4 rounded-[24px] border border-white/40 shadow-sm">
        <div className="flex items-center gap-4 text-xs uppercase tracking-widest font-bold text-[#5A5A40] px-2">
          <span>{filteredProducts.length} Fórmulas</span>
          <span className="text-stone-400 font-light lowercase">mostradas</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="flex lg:hidden items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-white/30 text-stone-700 rounded-full text-xs uppercase tracking-widest hover:bg-white transition-colors shadow-sm"
          id="mobile-filters-trigger"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filtros</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 3. DESKTOP SIDEBAR PANEL */}
        <aside className="hidden lg:col-span-3 lg:block space-y-8 sticky top-28 bg-white/40 backdrop-blur-md rounded-[32px] border border-white/50 p-6 shadow-sm">
          
          <div className="flex justify-between items-center border-b border-white/20 pb-4">
            <h3 className="font-serif italic text-base text-stone-800 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#5A5A40]" /> Filtros
            </h3>
            <button 
              onClick={handleResetFilters}
              className="text-[9px] font-bold uppercase tracking-widest text-[#5A5A40] hover:text-stone-800 transition-colors hover:underline"
            >
              Restablecer
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-wider uppercase text-stone-400 font-bold">Categoría</h4>
            <div className="flex flex-col gap-2.5">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`text-left text-xs uppercase tracking-wider py-1 transition-all ${
                    selectedCategory === c.id 
                      ? 'text-[#5A5A40] font-bold border-l-2 border-[#5A5A40] pl-2' 
                      : 'text-stone-500 hover:text-[#5A5A40] pl-0'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Type Filter */}
          <div className="space-y-3 border-t border-white/20 pt-6">
            <h4 className="text-[10px] tracking-wider uppercase text-stone-400 font-bold">Tipo de Piel</h4>
            <div className="flex flex-wrap gap-2">
              {skinTypes.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSkinType(s.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-all ${
                    selectedSkinType === s.id 
                      ? 'bg-[#5A5A40] text-white font-bold shadow-sm' 
                      : 'bg-white/60 hover:bg-white text-stone-600 border border-white/30'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-4 border-t border-white/20 pt-6">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-stone-500">
              <span>Presupuesto Máx</span>
              <span className="text-[#5A5A40]">${maxPrice} USD</span>
            </div>
            <input 
              type="range"
              min={30}
              max={140}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-[#5A5A40] h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-stone-400">
              <span>$30</span>
              <span>$140</span>
            </div>
          </div>

          {/* Premium Quiz recommendation widget */}
          <div className="bg-white/60 backdrop-blur-sm p-5 rounded-[24px] border border-white/40 shadow-sm space-y-3 text-center">
            <Sparkles className="w-5 h-5 text-[#5A5A40] mx-auto animate-pulse" />
            <h4 className="font-serif italic text-sm text-stone-800 leading-tight">¿No sabes qué fórmula elegir?</h4>
            <p className="text-xs text-stone-400 font-light leading-relaxed">Nuestro análisis virtual te guiará hacia la receta perfecta de ingredientes.</p>
          </div>

        </aside>

        {/* 4. PRODUCT CARDS GRID */}
        <section className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[32px] border border-white/50 p-8 space-y-4">
              <span className="font-serif italic text-xl text-stone-800 block">No encontramos coincidencias</span>
              <p className="text-stone-400 text-sm font-light max-w-md mx-auto">
                No hay productos en nuestra botica que coincidan exactamente con tu criterio de filtros.
              </p>
              <button 
                onClick={handleResetFilters}
                className="px-6 py-3 bg-[#5A5A40] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-colors shadow-sm"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-gutter gap-y-12">
              {filteredProducts.map((product) => {
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
                      {/* Floating heart toggle */}
                      <button 
                        onClick={() => onAddToShelf(product)}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-full text-stone-700 hover:bg-[#5A5A40] hover:text-white transition-all duration-300"
                        aria-label="Añadir a mi estantería de piel"
                      >
                        <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current text-[#5A5A40]' : 'text-stone-700'}`} />
                      </button>
                    </div>

                    <div className="space-y-1.5 px-1 text-left">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest block italic font-serif">
                        {product.category}
                      </span>
                      <h3 className="font-sans text-xs md:text-sm text-stone-850 leading-tight font-medium group-hover:text-[#5A5A40] transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 py-0.5 font-sans">
                        <div className="flex text-[#C5A880]">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span className="text-[10px] text-stone-400">
                          {product.rating.toFixed(1)} ({product.reviewsCount})
                        </span>
                      </div>
                      <p className="text-[10px] uppercase font-sans tracking-wider text-stone-400 font-bold leading-none">
                        {product.skinType}
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <p className="font-sans text-xs md:text-sm text-stone-900 font-bold">
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
          )}
        </section>

      </div>

      {/* 5. MOBILE DRAWER FILTER DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-primary/20 backdrop-blur-md flex justify-end animate-fade-in">
          <div className="bg-background w-4/5 max-w-sm h-full p-6 flex flex-col justify-between shadow-2xl relative border-l border-outline-variant/30">
            <div className="space-y-8 overflow-y-auto pr-2">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                <h3 className="font-headline-sm text-xl text-primary">Filtros de Búsqueda</h3>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-primary p-1 hover:bg-surface-container rounded-full"
                  aria-label="Cerrar filtros"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category selector */}
              <div className="space-y-3">
                <span className="font-label-sm text-xs tracking-wider uppercase text-primary font-bold">Categoría</span>
                <div className="flex flex-col gap-2">
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`text-left text-sm py-2 px-3 rounded-md transition-colors ${
                        selectedCategory === c.id 
                          ? 'bg-primary text-on-primary font-bold' 
                          : 'bg-surface-container text-primary hover:bg-surface-container-high'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin type */}
              <div className="space-y-3">
                <span className="font-label-sm text-xs tracking-wider uppercase text-primary font-bold">Tipo de Piel</span>
                <div className="flex flex-wrap gap-2">
                  {skinTypes.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSkinType(s.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-label-md transition-all ${
                        selectedSkinType === s.id 
                          ? 'bg-primary text-on-primary' 
                          : 'bg-surface-container text-primary'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-label-sm uppercase">
                  <span>Presupuesto Máx</span>
                  <span className="font-bold">${maxPrice} USD</span>
                </div>
                <input 
                  type="range"
                  min={30}
                  max={140}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-primary h-1 bg-surface-container rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="border-t border-outline-variant/30 pt-6 space-y-3">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 bg-primary text-on-primary rounded-md font-label-md text-sm uppercase tracking-widest hover:opacity-90"
              >
                Aplicar Filtros
              </button>
              <button 
                onClick={() => {
                  handleResetFilters();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 border border-outline-variant text-outline rounded-md font-label-md text-sm uppercase tracking-widest hover:bg-surface-container"
              >
                Restablecer
              </button>
            </div>
          </div>
          
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

    </div>
  );
}

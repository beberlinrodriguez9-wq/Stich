import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, User, Heart, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  shelfCount: number;
  onSearch: (query: string) => void;
  onOpenQuiz: () => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  cartCount,
  shelfCount,
  onSearch,
  onOpenQuiz
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onNavigate('catalog');
    setSearchOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'catalog', label: 'Catálogo' },
    { id: 'shelf', label: 'My Skin Shelf' },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl transition-all duration-300 border-b border-white/20 shadow-sm">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex justify-between items-center h-16 md:h-20">
          
          {/* Left panel: Hamburger menu (mobile) and Navigation links (desktop) */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-stone-600 p-1 hover:opacity-75 transition-opacity"
              aria-label="Abrir menú"
              id="hamburger-btn"
            >
              <Menu className="w-6 h-6" />
            </button>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`text-xs font-medium uppercase tracking-widest relative pb-1 transition-all ${
                    currentView === item.id 
                      ? 'text-primary border-b border-primary font-semibold' 
                      : 'text-stone-500 hover:text-primary_accent hover:text-[#5A5A40]'
                  }`}
                >
                  {item.label}
                  {item.id === 'shelf' && shelfCount > 0 && (
                    <span className="ml-1 bg-primary text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full">
                      {shelfCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Brand Logo - Centered */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center select-none"
          >
            <span className="text-2xl tracking-[0.2em] font-light text-[#5A5A40] uppercase relative">
              Aura Skin
            </span>
          </button>

          {/* Right actions: Search, Profile, AI Quiz trigger, Shopping shopping_bag */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-stone-600 p-2 hover:opacity-75 transition-opacity relative"
              aria-label="Buscar"
              id="search-toggle-btn"
            >
              <Search className="w-5 h-5" />
            </button>

            <button 
              onClick={onOpenQuiz}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-[#EFECE8] border border-transparent rounded-full text-xs font-medium text-stone-700 hover:bg-stone-200 transition-all"
              id="quiz-nav-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span>Skin Quiz AI</span>
            </button>

            <button 
              onClick={() => onNavigate('shelf')}
              className="text-stone-600 p-2 hover:opacity-75 transition-opacity relative"
              aria-label="Biblioteca de rutinas"
              id="shelf-badge-btn"
            >
              <Heart className={`w-5 h-5 ${currentView === 'shelf' ? 'fill-current text-primary' : ''}`} />
              {shelfCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {shelfCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => onNavigate('cart')}
              className="text-stone-600 p-2 hover:opacity-75 transition-opacity relative"
              aria-label="Carrito de compras"
              id="cart-badge-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Sliding search shelf */}
        {searchOpen && (
          <div className="bg-background border-t border-outline-variant/10 p-4 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center gap-3 border-b border-primary py-1">
              <Search className="w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Busca serums, limpiadores, cremas para el ritual..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-body-md text-primary focus:ring-0 placeholder:text-outline/50 p-1"
                autoFocus
              />
              <button 
                type="button" 
                onClick={() => setSearchOpen(false)}
                className="text-outline hover:text-primary text-xs font-label-md uppercase tracking-widest"
              >
                Cerrar
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-primary/20 backdrop-blur-md flex justify-start animate-fade-in">
          <div className="bg-background w-4/5 max-w-sm h-full p-6 flex flex-col justify-between shadow-2xl relative border-r border-outline-variant/20">
            <div>
              <div className="flex justify-between items-center mb-12">
                <span className="font-headline-sm text-xl tracking-widest text-primary font-bold">AURA SKIN</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-primary p-1 hover:bg-surface-container rounded-full"
                  aria-label="Cerrar menú"
                  id="close-mobile-menu-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`font-headline-sm text-2xl text-left transition-all ${
                      currentView === item.id 
                        ? 'text-primary font-bold italic translate-x-2' 
                        : 'text-outline hover:text-primary'
                    }`}
                  >
                    {item.label}
                    {item.id === 'shelf' && shelfCount > 0 && (
                      <span className="ml-2 bg-secondary text-primary font-bold text-xs px-2 py-0.5 rounded-full">
                        {shelfCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 border-t border-outline-variant/30 pt-6">
              <button 
                onClick={() => {
                  onOpenQuiz();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-4 bg-primary text-on-primary rounded-md font-label-md text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
                id="mobile-quiz-btn"
              >
                <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                <span>Skin Quiz AI</span>
              </button>

              <div className="flex flex-col gap-2 text-sm text-outline">
                <p className="font-label-sm uppercase tracking-widest text-primary text-xs">AURA APOTHECARY</p>
                <p className="font-body-md">Lunes a Sábado: 9:00 — 20:00</p>
                <p className="font-body-md text-xs italic">"Skincare designed for quiet moments."</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import ShelfView from './components/ShelfView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import QuizModal from './components/QuizModal';
import { Product, CartItem } from './types';
import { products } from './data/products';
import { Sparkles, Check, Info, Lock } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shelfItems, setShelfItems] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  
  // Custom toast notification structure
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | null }>({
    message: '',
    type: null
  });

  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast.type) {
      const timer = setTimeout(() => setToast({ message: '', type: null }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load shared routine on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const routineIds = params.get('routine');
    if (routineIds) {
      const ids = routineIds.split(',');
      const selectedProducts = products.filter(p => ids.includes(p.id));
      if (selectedProducts.length > 0) {
        setShelfItems(selectedProducts);
        setCurrentView('shelf');
        triggerToast('¡Ritual compartido cargado con éxito!', 'success');
        // Clear search params to keep clean address bar
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        triggerToast(`Cantidad de "${product.name}" actualizada en el carrito`, 'info');
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      triggerToast(`"${product.name}" añadido al carrito`, 'success');
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => item.product.id === productId ? { ...item, quantity } : item)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => {
      const target = prev.find(item => item.product.id === productId);
      if (target) {
        triggerToast(`"${target.product.name}" eliminado del carrito`, 'info');
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const handleAddToShelf = (product: Product) => {
    setShelfItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        triggerToast(`"${product.name}" removido de tu Skin Shelf`, 'info');
        return prev.filter(item => item.id !== product.id);
      }
      triggerToast(`"${product.name}" guardado en tu Skin Shelf`, 'success');
      return [...prev, product];
    });
  };

  const handleMoveAllToCart = () => {
    if (shelfItems.length === 0) return;
    
    setCartItems(prev => {
      let updated = [...prev];
      shelfItems.forEach(shelfProd => {
        const existing = updated.find(item => item.product.id === shelfProd.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          updated.push({ product: shelfProd, quantity: 1 });
        }
      });
      return updated;
    });

    triggerToast('¡Toda tu estantería se ha movido al carrito!', 'success');
    setCurrentView('cart');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const isSavedOnShelf = (product: Product) => {
    return shelfItems.some(item => item.id === product.id);
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'catalog':
        return (
          <CatalogView 
            onAddToCart={handleAddToCart}
            onAddToShelf={handleAddToShelf}
            isSavedOnShelf={isSavedOnShelf}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        );
      case 'shelf':
        return (
          <ShelfView 
            shelfItems={shelfItems}
            onRemoveFromShelf={handleAddToShelf}
            onAddToCart={handleAddToCart}
            onMoveAllToCart={handleMoveAllToCart}
            onNavigate={setCurrentView}
            onOpenQuiz={() => setIsQuizOpen(true)}
          />
        );
      case 'cart':
        return (
          <CartView 
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onNavigate={setCurrentView}
            onAddToShelf={handleAddToShelf}
            isSavedOnShelf={isSavedOnShelf}
          />
        );
      case 'checkout':
        return (
          <CheckoutView 
            cartItems={cartItems}
            onClearCart={handleClearCart}
            onNavigate={setCurrentView}
          />
        );
      case 'home':
      default:
        return (
          <HomeView 
            onNavigate={setCurrentView}
            onAddToCart={handleAddToCart}
            onAddToShelf={handleAddToShelf}
            isSavedOnShelf={isSavedOnShelf}
            onOpenQuiz={() => setIsQuizOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between font-sans relative antialiased transition-colors duration-300">
      
      {/* 1. Global Navigation header */}
      <Navbar 
        currentView={currentView}
        onNavigate={setCurrentView}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        shelfCount={shelfItems.length}
        onSearch={setSearchQuery}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* Toast Notification HUD */}
      {toast.type && (
        <div className="fixed bottom-6 right-6 z-50 py-3.5 px-6 bg-white/70 backdrop-blur-md text-stone-850 rounded-full shadow-sm border border-white/60 flex items-center gap-3 animate-fade-in-up max-w-sm text-left font-sans">
          {toast.type === 'success' ? (
            <Check className="w-4 h-4 text-[#5A5A40] flex-shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-[#5A5A40] flex-shrink-0" />
          )}
          <span className="text-xs font-light text-stone-600">{toast.message}</span>
        </div>
      )}

      {/* 2. Main Content area with safe spacing */}
      <main className="flex-1 pt-24 pb-16 md:pt-28 md:pb-24">
        {renderActiveView()}
      </main>

      {/* 3. Smart skin diagnostic simulator */}
      <QuizModal 
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onAddToCart={handleAddToCart}
        onAddToShelf={handleAddToShelf}
        isSavedOnShelf={isSavedOnShelf}
      />

      {/* 4. Elegant footer */}
      <footer className="bg-white/45 backdrop-blur-md py-16 border-t border-white/60 text-left font-sans">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          <div className="space-y-4">
            <span className="font-serif italic text-xl tracking-widest text-stone-850 block">AURA SKIN</span>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Fórmulas puras y honestas para guiar tu ritual de autocuidado diario hacia un bienestar consciente de piel y espíritu.
            </p>
            <div className="flex items-center gap-2 text-[9px] text-stone-400 uppercase tracking-widest font-bold">
              <Lock className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Cero aditivos dañinos</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#5A5A40]">Aura Apothecary</h4>
            <ul className="space-y-2 text-xs text-stone-550 font-light">
              <li><button onClick={() => setCurrentView('catalog')} className="hover:text-stone-850 duration-200 transition-colors">Limpiadores</button></li>
              <li><button onClick={() => setCurrentView('catalog')} className="hover:text-stone-850 duration-200 transition-colors">Sueros Moleculares</button></li>
              <li><button onClick={() => setCurrentView('catalog')} className="hover:text-stone-850 duration-200 transition-colors">Cremas Hidratantes</button></li>
              <li><button onClick={() => setCurrentView('catalog')} className="hover:text-stone-850 duration-200 transition-colors">Filtros Solares</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#5A5A40]">Autocuidado</h4>
            <ul className="space-y-2 text-xs text-stone-550 font-light">
              <li><button onClick={() => setIsQuizOpen(true)} className="hover:text-stone-850 duration-200 transition-colors flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#5A5A40] animate-pulse" /> Skin Quiz AI</button></li>
              <li><button onClick={() => setCurrentView('shelf')} className="hover:text-stone-850 duration-200 transition-colors">My Skin Shelf</button></li>
              <li><button onClick={() => setCurrentView('home')} className="hover:text-stone-850 duration-200 transition-colors">Diario de Belleza</button></li>
              <li><a href="#" className="hover:text-stone-850 duration-200 transition-colors">Sostenibilidad</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#5A5A40]">Suscribirse al Diario</h4>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Recibe guías de bienestar botánico, rituales curativos y promociones exclusivas en tu correo.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); triggerToast('¡Gracias por unirse al Diario AURA!', 'success'); }} className="flex gap-2 border-b border-stone-200 pb-1">
              <input 
                type="email" 
                placeholder="Ingresa tu correo..."
                required
                className="w-full bg-transparent border-none text-xs p-1 focus:ring-0 placeholder:text-stone-350 text-stone-700"
              />
              <button type="submit" className="text-[10px] uppercase font-bold text-[#5A5A40] hover:text-stone-900 tracking-wider">Unirme</button>
            </form>
          </div>

        </div>

        <div className="max-w-[1240px] mx-auto px-6 mt-12 pt-8 border-t border-white/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] text-stone-400 font-bold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} AURA SKIN APOTHECARY. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-stone-800 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-stone-800 transition-colors">Condiciones</a>
            <a href="#" className="hover:text-stone-800 transition-colors">Soporte</a>
          </div>
        </div>
      </footer>

    </div>
  );
}


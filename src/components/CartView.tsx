import React from 'react';
import { Trash2, ShieldCheck, Heart, ArrowRight, Truck, RefreshCw, Undo2 } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onNavigate: (view: string) => void;
  onAddToShelf: (product: Product) => void;
  isSavedOnShelf: (product: Product) => boolean;
}

export default function CartView({
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onNavigate,
  onAddToShelf,
  isSavedOnShelf
}: CartViewProps) {
  
  // Calculate pricing state
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const freeShippingThreshold = 150;
  const shippingFee = subtotal === 0 ? 0 : (subtotal >= freeShippingThreshold ? 0 : 15.00);
  const total = subtotal + shippingFee;

  return (
    <div className="animate-fade-in max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 space-y-12">
      
      {/* 1. Page Header */}
      <div className="border-b border-white/20 pb-6 text-left">
        <h1 className="font-serif italic text-3xl md:text-5xl text-stone-850 font-light">Bolsa de Compra</h1>
        <p className="text-stone-500 font-light text-sm max-w-md mt-2">
          Revisa las elipsis y fluidos seleccionados para tu ritual antes de consolidar el pedido.
        </p>
      </div>

      {cartItems.length === 0 ? (
        /* 2. Empty state style */
        <section className="py-20 text-center max-w-md mx-auto space-y-6">
          <div className="w-48 h-48 opacity-30 mx-auto rounded-[30px] overflow-hidden shadow-sm">
            <img 
              alt="Bolsa de shopping vacía" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80"
            />
          </div>
          <h2 className="font-serif italic text-2xl text-stone-850">Tu bolsa de compra está vacía</h2>
          <p className="text-stone-500 font-light text-sm leading-relaxed">
            Añade fórmulas restauradoras de piel desde nuestra sección de catálogos para iniciar tu transformación sensorial.
          </p>
          <div className="pt-4">
            <button 
              onClick={() => onNavigate('catalog')}
              className="w-full py-4 bg-[#5A5A40] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-colors shadow-md"
            >
              Explorar Catálogo
            </button>
          </div>
        </section>
      ) : (
        /* 3. Columns list and totals check panels */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Cart items list column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Free shipping banner */}
            <div className="bg-white/40 backdrop-blur-md py-4 px-6 rounded-[24px] flex items-center gap-3.5 text-left border border-white/50">
              <Truck className="w-5 h-5 text-[#5A5A40] animate-bounce" />
              <div className="flex-1">
                {subtotal >= freeShippingThreshold ? (
                  <p className="text-xs uppercase tracking-wider text-stone-800 font-bold">
                    ¡Calificas para <span className="text-[#5A5A40]">Envío Express Gratis</span>!
                  </p>
                ) : (
                  <p className="text-xs text-stone-500 font-light">
                    Agrega <strong className="text-stone-800 font-bold">${(freeShippingThreshold - subtotal).toFixed(2)} USD</strong> más para conseguir <span className="font-bold text-[#5A5A40]">Envío Express Gratis</span>.
                  </p>
                )}
                <div className="w-full bg-stone-200/60 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className="bg-[#5A5A40] h-full transition-all duration-300"
                    style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* List block */}
            <div className="space-y-4">
              {cartItems.map((item) => {
                const saved = isSavedOnShelf(item.product);
                return (
                  <div key={item.product.id} className="bg-white/30 backdrop-blur-md border border-white/50 rounded-[32px] p-5 flex gap-4 md:gap-6 text-left shadow-sm">
                    <div className="w-24 md:w-28 aspect-[4/5] rounded-[20px] overflow-hidden bg-stone-100 flex-shrink-0">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-sans text-sm md:text-base text-stone-850 leading-tight font-medium">
                            {item.product.name}
                          </h3>
                          <button 
                            onClick={() => onRemoveFromCart(item.product.id)}
                            className="p-1 hover:text-red-500 transition-colors text-stone-400"
                            aria-label="Quitar producto"
                            id={`trash-btn-${item.product.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] uppercase text-stone-400 font-sans tracking-widest italic font-serif">
                          {item.product.category}
                        </p>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                          Piel: {item.product.skinType}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        {/* Quantity controls */}
                        <div className="flex items-center bg-white/60 backdrop-blur-md border border-white/40 rounded-full h-9 overflow-hidden">
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-9 h-full flex items-center justify-center text-stone-700 hover:bg-white disabled:opacity-25 transition-colors font-bold text-xs"
                          >
                            —
                          </button>
                          <span className="px-2 text-[11px] font-bold text-stone-850">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-9 h-full flex items-center justify-center text-stone-700 hover:bg-white transition-colors font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Save to shelf heart & pricing */}
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => onAddToShelf(item.product)}
                            className={`hidden sm:flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest transition-colors ${
                              saved ? 'text-[#5A5A40]' : 'text-stone-450 hover:text-[#5A5A40]'
                            }`}
                          >
                            <Heart className={`w-3 h-3 ${saved ? 'fill-current' : ''}`} />
                            <span>{saved ? 'Guardado' : 'A mi Shelf'}</span>
                          </button>
                          <span className="font-sans text-sm md:text-base font-bold text-stone-900">${(item.product.price * item.quantity).toFixed(2)} USD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back button */}
            <button 
              onClick={() => onNavigate('catalog')}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-stone-800 transition-all pb-1 border-b border-transparent hover:border-stone-500/30"
            >
              <Undo2 className="w-3.5 h-3.5" /> Continuar Comprando
            </button>

          </div>

          {/* Pricing detail order summary sticky card */}
          <div className="lg:col-span-4 bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/50 space-y-6 sticky top-28 text-left shadow-sm">
            <h2 className="font-serif italic text-lg text-stone-800 border-b border-white/20 pb-4">Detalles del Ritual</h2>
            
            <div className="space-y-4 text-xs font-sans tracking-wide border-b border-white/20 pb-4">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span className="text-stone-800 font-bold">${subtotal.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Envío Express</span>
                <span className="text-[#5A5A40] font-bold">{shippingFee === 0 ? 'Gratis' : `$${shippingFee.toFixed(2)} USD`}</span>
              </div>
            </div>

            <div className="flex justify-between items-end pb-2">
              <span className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Total Estimado</span>
              <span className="font-sans text-xl text-stone-900 font-bold">${total.toFixed(2)} USD</span>
            </div>

            {/* Proceed buttons */}
            <div className="pt-2">
              <button 
                onClick={() => onNavigate('checkout')}
                className="w-full py-4 bg-[#5A5A40] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md"
                id="cart-proceed-checkout-btn"
              >
                <span>Proceder al Pago</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Secure trust labels */}
            <div className="space-y-3 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-[10px] text-stone-400 font-sans tracking-wide">
                <ShieldCheck className="w-4 h-4 text-[#5A5A40]" />
                <span>Pago 100% encriptado de forma segura SSL.</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-stone-400 font-sans tracking-wide">
                <Truck className="w-4 h-4 text-[#5A5A40]" />
                <span>Entregas rápidas de 1 a 3 días laborables en cajas ecológicas.</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-stone-400 font-sans tracking-wide">
                <RefreshCw className="w-4 h-4 text-[#5A5A40]" />
                <span>Políticas de devolución sin preguntas por 14 días.</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

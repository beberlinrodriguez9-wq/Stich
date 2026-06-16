import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Check, ChevronRight, Lock, Loader2, ArrowLeft, Heart, Sparkle } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutViewProps {
  cartItems: CartItem[];
  onClearCart: () => void;
  onNavigate: (view: string) => void;
}

export default function CheckoutView({
  cartItems,
  onClearCart,
  onNavigate
}: CheckoutViewProps) {
  const [step, setStep] = useState<number>(1); // 1 = Shipping, 2 = Payment, 3 = Success Order
  const [loading, setLoading] = useState<boolean>(false);
  const [orderId] = useState<string>(() => `AURA-${Math.floor(100000 + Math.random() * 900000)}`);
  
  // Form details state
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    telefono: '',
    tarjetaNombre: '',
    tarjetaNumero: '',
    tarjetaVence: '',
    tarjetaCVV: '',
    metodoPago: 'tarjeta' // tarjeta, paypal, apple
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate premium payment processing
    setTimeout(() => {
      setLoading(false);
      setStep(3); // success
      onClearCart();
    }, 2500);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const freeShippingThreshold = 150;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 15.00;
  const total = subtotal + shippingFee;

  return (
    <div className="animate-fade-in max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 space-y-12">
      
      {/* Step Indicators */}
      {step < 3 && (
        <div className="flex justify-center items-center gap-6 max-w-xl mx-auto py-3 border-b border-white/20 mb-8 font-sans">
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-[#5A5A40] text-white shadow-sm' : 'bg-white/60 text-stone-400 border border-white/40'}`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </span>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= 1 ? 'text-[#5A5A40]' : 'text-stone-405'}`}>Envío</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-300" />
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-[#5A5A40] text-white shadow-sm' : 'bg-white/60 text-stone-400 border border-white/40'}`}>
              2
            </span>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= 2 ? 'text-[#5A5A40]' : 'text-stone-405'}`}>Pago</span>
          </div>
        </div>
      )}

      {step === 3 ? (
        /* SUCCESS SCREEN */
        <div className="max-w-2xl mx-auto py-16 text-center space-y-8 animate-fade-in bg-white/40 backdrop-blur-md rounded-[40px] border border-white/50 p-8 md:p-12 shadow-sm text-stone-850">
          <div className="w-16 h-16 bg-white/60 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center mx-auto text-[#5A5A40] animate-pulse shadow-sm">
            <Sparkle className="w-8 h-8" />
          </div>
          
          <div className="space-y-3">
            <span className="text-[10px] text-[#5A5A40] tracking-widest uppercase block font-semibold">Ritual Consolidado</span>
            <h1 className="font-serif italic text-3xl md:text-5xl text-stone-800">Tu pedido ha sido recibido</h1>
            <p className="text-stone-550 text-sm max-w-md mx-auto leading-relaxed">
              Código de Transacción: <strong className="text-stone-850 font-mono text-xs bg-white/70 px-3 py-1 rounded-full border border-white/30">{orderId}</strong>
            </p>
          </div>

          <div className="p-8 bg-white/50 backdrop-blur-sm rounded-[30px] border border-white/60 space-y-4 text-left max-w-md mx-auto relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#5A5A40]/10 rounded-bl-full pointer-events-none" />
            <h3 className="font-serif italic text-lg text-stone-800">Preparación en la Botica</h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Tus elipsis y fluidos moleculares están siendo envueltos meticulosamente a mano en nuestra boticaria de origen sostenible. Recibirás guías de tránsito por correo para monitorear tu pedido.
            </p>
            <div className="text-[10px] tracking-wide uppercase font-bold text-stone-400 pt-2 border-t border-white/20">
              <p>Envío estimado: 1-3 días laborables</p>
              <p className="mt-1">Destinatario: {formData.nombre || 'Aura Client'}</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 max-w-xs mx-auto">
            <button 
              onClick={() => onNavigate('home')}
              className="flex-1 py-4 bg-[#5A5A40] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-colors shadow-md"
            >
              Volver al Inicio
            </button>
            <button 
              onClick={() => onNavigate('catalog')}
              className="flex-1 py-4 border border-stone-300 bg-white/60 text-stone-700 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white transition-colors"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      ) : (
        /* CHECKOUT FORM LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-left">
          
          {/* Main Form Fields */}
          <div className="lg:col-span-8 bg-white/40 backdrop-blur-md p-6 md:p-10 rounded-[32px] border border-white/50 shadow-sm space-y-8">
            
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <h2 className="font-serif italic text-2xl text-stone-850 border-b border-white/20 pb-3">01. Destino del Ritual (Envío)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-stone-400 tracking-wider block font-bold">Nombre Completo</label>
                    <input 
                      type="text" 
                      name="nombre" 
                      required
                      value={formData.nombre} 
                      onChange={handleInputChange}
                      className="w-full bg-white/40 border border-white/60 rounded-full focus:ring-1 focus:ring-[#5A5A40]/30 focus:border-[#5A5A40]/40 text-xs py-3 px-4 shadow-inner" 
                      placeholder="Ej. Sofía Valenzuela"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-stone-400 tracking-wider block font-bold">Correo Electrónico</label>
                    <input 
                      type="email" 
                      name="email" 
                      required
                      value={formData.email} 
                      onChange={handleInputChange}
                      className="w-full bg-white/40 border border-white/60 rounded-full focus:ring-1 focus:ring-[#5A5A40]/30 focus:border-[#5A5A40]/40 text-xs py-3 px-4 shadow-inner" 
                      placeholder="Ej. sofia@aura.com"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] uppercase text-stone-400 tracking-wider block font-bold">Dirección de Envío</label>
                    <input 
                      type="text" 
                      name="direccion" 
                      required
                      value={formData.direccion} 
                      onChange={handleInputChange}
                      className="w-full bg-white/40 border border-white/60 rounded-full focus:ring-1 focus:ring-[#5A5A40]/30 focus:border-[#5A5A40]/40 text-xs py-3 px-4 shadow-inner" 
                      placeholder="Ej. Av. de la Reforma 345, Depto 4B"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-stone-400 tracking-wider block font-bold">Ciudad</label>
                    <input 
                      type="text" 
                      name="ciudad" 
                      required
                      value={formData.ciudad} 
                      onChange={handleInputChange}
                      className="w-full bg-white/40 border border-white/60 rounded-full focus:ring-1 focus:ring-[#5A5A40]/30 focus:border-[#5A5A40]/40 text-xs py-3 px-4 shadow-inner" 
                      placeholder="Ej. Ciudad de México"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-stone-400 tracking-wider block font-bold">Código Postal</label>
                    <input 
                      type="text" 
                      name="codigoPostal" 
                      required
                      value={formData.codigoPostal} 
                      onChange={handleInputChange}
                      className="w-full bg-white/40 border border-white/60 rounded-full focus:ring-1 focus:ring-[#5A5A40]/30 focus:border-[#5A5A40]/40 text-xs py-3 px-4 shadow-inner" 
                      placeholder="Ej. 11560"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-stone-400 tracking-wider block font-bold">Teléfono</label>
                    <input 
                      type="text" 
                      name="telefono" 
                      required
                      value={formData.telefono} 
                      onChange={handleInputChange}
                      className="w-full bg-white/40 border border-white/60 rounded-full focus:ring-1 focus:ring-[#5A5A40]/30 focus:border-[#5A5A40]/40 text-xs py-3 px-4 shadow-inner" 
                      placeholder="Ej. +52 55 1234 5678"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/20 flex justify-between items-center font-sans">
                  <button 
                    type="button" 
                    onClick={() => onNavigate('cart')}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-stone-850 transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Volver a la Bolsa
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3.5 bg-[#5A5A40] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-colors shadow-md animate-fade-in"
                    id="checkout-shipping-submit"
                  >
                    Ir al Pago
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <h2 className="font-serif italic text-2xl text-stone-850 border-b border-white/20 pb-3">02. Método de Pago</h2>
                
                {/* Method selector buttons */}
                <div className="grid grid-cols-3 gap-3 font-sans text-[10px] uppercase font-bold tracking-wider">
                  {[
                    { id: 'tarjeta', label: 'Tarjeta' },
                    { id: 'paypal', label: 'PayPal' },
                    { id: 'apple', label: 'Apple Pay' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, metodoPago: m.id }))}
                      className={`py-3 text-center rounded-full border transition-all ${
                        formData.metodoPago === m.id 
                          ? 'border-[#5A5A40] bg-white/80 font-bold text-[#5A5A40] shadow-sm' 
                          : 'border-white/40 bg-white/20 hover:border-[#5A5A40]/35 text-stone-500 hover:text-[#5A5A40]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {formData.metodoPago === 'tarjeta' ? (
                  <div className="space-y-5 font-sans">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase text-stone-400 tracking-wider block font-bold">Tarjetahabiente (Nombre)</label>
                      <input 
                        type="text" 
                        name="tarjetaNombre" 
                        required
                        value={formData.tarjetaNombre} 
                        onChange={handleInputChange}
                        className="w-full bg-white/40 border border-white/60 rounded-full focus:ring-1 focus:ring-[#5A5A40]/30 focus:border-[#5A5A40]/40 text-xs py-3 px-4 shadow-inner" 
                        placeholder="SOFIA VALENZUELA"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase text-stone-400 tracking-wider block font-bold">Número de Tarjeta</label>
                      <input 
                        type="text" 
                        name="tarjetaNumero" 
                        required
                        value={formData.tarjetaNumero} 
                        onChange={handleInputChange}
                        maxLength={16}
                        className="w-full bg-white/40 border border-white/60 rounded-full focus:ring-1 focus:ring-[#5A5A40]/30 focus:border-[#5A5A40]/40 text-xs py-3 px-4 shadow-inner font-mono" 
                        placeholder="•••• •••• •••• ••••"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase text-stone-400 tracking-wider block font-bold">Vencimiento</label>
                        <input 
                          type="text" 
                          name="tarjetaVence" 
                          required
                          value={formData.tarjetaVence} 
                          onChange={handleInputChange}
                          maxLength={5}
                          className="w-full bg-white/40 border border-white/60 rounded-full focus:ring-1 focus:ring-[#5A5A40]/30 focus:border-[#5A5A40]/40 text-xs py-3 px-4 shadow-inner font-mono" 
                          placeholder="MM/AA"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase text-stone-400 tracking-wider block font-bold">Código CVV</label>
                        <input 
                          type="password" 
                          name="tarjetaCVV" 
                          required
                          value={formData.tarjetaCVV} 
                          onChange={handleInputChange}
                          maxLength={3}
                          className="w-full bg-white/40 border border-white/60 rounded-full focus:ring-1 focus:ring-[#5A5A40]/30 focus:border-[#5A5A40]/40 text-xs py-3 px-4 shadow-inner font-mono" 
                          placeholder="•••"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-white/60 backdrop-blur-md rounded-[20px] border border-white/50 text-center font-sans text-xs text-stone-500 leading-relaxed shadow-inner">
                    {formData.metodoPago === 'paypal' ? (
                      <p>Serás redirigido brevemente a la pasarela cifrada de PayPal para autenticar de forma segura.</p>
                    ) : (
                      <p>Utiliza tu huella o reconocimiento facial de Apple en tu dispositivo de forma automática.</p>
                    )}
                  </div>
                )}

                <div className="pt-6 border-t border-white/20 flex justify-between items-center font-sans">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-stone-850 transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Métodos de Envío
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-3.5 bg-[#5A5A40] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-md animate-fade-in"
                    id="checkout-payment-submit"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-white" />
                        <span>Pagar Pedido (${total.toFixed(2)} USD)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Sticky checkout order summary sidebar */}
          <div className="lg:col-span-4 bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/50 space-y-6 sticky top-28 shadow-sm">
            <h3 className="font-serif italic text-lg text-stone-800 border-b border-white/20 pb-4">Artículos del Ritual</h3>
            
            <div className="divide-y divide-white/10 max-h-60 overflow-y-auto pr-1">
              {cartItems.map(item => (
                <div key={item.product.id} className="py-3 flex gap-3 first:pt-0 text-left">
                  <div className="w-12 h-15 rounded-[12px] bg-stone-100 overflow-hidden flex-shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-xs font-sans min-w-0">
                    <h4 className="font-medium text-stone-800 truncate">{item.product.name}</h4>
                    <p className="text-stone-405 mt-0.5">Cant: {item.quantity}</p>
                    <p className="font-bold text-[#5A5A40] tracking-wide mt-0.5">${item.product.price.toFixed(2)} USD</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 font-sans text-xs border-y border-white/20 py-4">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Envío Express</span>
                <span>{shippingFee === 0 ? 'Gratis' : `$${shippingFee.toFixed(2)} USD`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-stone-850 pt-1 border-t border-white/20">
                <span>Total Final</span>
                <span>${total.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Shield and lock lock icons */}
            <div className="flex items-center gap-2 justify-center text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              <Lock className="w-3 h-3 text-[#5A5A40]" />
              <span>Transacciones Cifradas SSL</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

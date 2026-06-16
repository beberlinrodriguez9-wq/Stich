import React, { useState } from 'react';
import { Sparkles, Loader2, X, Sun, Moon, Sparkle, Heart } from 'lucide-react';
import { QuizAnswers, QuizResult, Product } from '../types';
import { products } from '../data/products';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToShelf: (product: Product) => void;
  isSavedOnShelf: (product: Product) => boolean;
}

export default function QuizModal({
  isOpen,
  onClose,
  onAddToCart,
  onAddToShelf,
  isSavedOnShelf
}: QuizModalProps) {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    skinType: 'Seca',
    primaryConcern: 'Deshidratación',
    sensitivities: '',
    routineCommitment: 'Minimalista (2-3 pasos esenciales)',
    ageGroup: '30s'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleSelectOption = (key: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al procesar tu análisis.');
      }
      setResult(data);
      setStep(6); // Move to results step
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({
      skinType: 'Seca',
      primaryConcern: 'Deshidratación',
      sensitivities: '',
      routineCommitment: 'Minimalista (2-3 pasos esenciales)',
      ageGroup: '30s'
    });
    setResult(null);
    setError('');
  };

  // Find recommendations from our database based on concern
  const getRecommendedProducts = (): Product[] => {
    const concernLower = answers.primaryConcern.toLowerCase();
    const typeLower = answers.skinType.toLowerCase();

    // Basic matching logic
    return products.filter(p => {
      const pConcern = p.description.toLowerCase() + p.longDescription.toLowerCase() + p.category.toLowerCase();
      const pType = p.skinType.toLowerCase();
      
      // Match key terms
      const matchesConcern = 
        (concernLower.includes('deshidratación') && (pConcern.includes('hydrat') || pConcern.includes('milk') || p.category === 'serums')) ||
        (concernLower.includes('acné') && (pConcern.includes('clay') || pConcern.includes('clarify') || pConcern.includes('toner'))) ||
        (concernLower.includes('envejecimiento') && (pConcern.includes('recovery') || pConcern.includes('repair') || pConcern.includes('vitamin'))) ||
        (concernLower.includes('manchas') && (pConcern.includes('vitamin') || pConcern.includes('radiance') || pConcern.includes('elixir'))) ||
        (concernLower.includes('sensibilidad') && (pConcern.includes('barrier') || pConcern.includes('velvet') || pConcern.includes('sooth')));
        
      return matchesConcern;
    }).slice(0, 3); // top 3 matching
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-900/15 backdrop-blur-md animate-fade-in">
      <div className="bg-white/40 backdrop-blur-md w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-sm relative flex flex-col sm:border border-white/60">
        
        {/* Header toolbar */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="p-2 text-stone-600 hover:bg-white/50 rounded-full transition-all"
            id="close-quiz-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 md:p-12 flex-1">
          {step <= 5 && (
            <div className="max-w-xl mx-auto py-4">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest block mb-2 font-sans text-center md:text-left">
                ESTUDIO DE DERMATOLOGÍA VIRTUAL — PASO {step} DE 5
              </span>
              <div className="w-full bg-stone-200/60 h-1.5 mb-8 rounded-full overflow-hidden">
                <div 
                  className="bg-[#5A5A40] h-full transition-all duration-350"
                  style={{ width: `${(step / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="max-w-xl mx-auto">
              <h2 className="font-serif italic text-2xl md:text-3xl text-stone-850 mb-4 text-left">¿Cuál es tu tipo de piel habitual?</h2>
              <p className="text-stone-500 font-light text-sm mb-6 text-left">Determinar el temperamento de tu capa externa nos ayuda a calibrar los vehículos idóneos para la absorción.</p>
              
              <div className="space-y-4 text-left">
                {[
                  { id: 'Seca', title: 'Piel Seca', desc: 'Sientes tirantez constante, descamación sutil o falta de brillo natural.' },
                  { id: 'Grasa', title: 'Piel Grasa', desc: 'Brillo persistente, poros visibles y tendencia a acumulaciones sebáceas.' },
                  { id: 'Mixta', title: 'Piel Mixta', desc: 'Zona T (frente, nariz) oleosa, mientras las mejillas permanecen secas o normales.' },
                  { id: 'Sensible', title: 'Piel Sensible', desc: 'Enrojecimiento al contacto, susceptibilidad a fragancias y reacciones rápidas.' },
                  { id: 'Normal', title: 'Piel Balanceada', desc: 'Textura suave, sin oleosidad excesiva ni sequedad molesta.' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption('skinType', opt.id)}
                    className={`w-full text-left p-5 border transition-all rounded-[24px] flex justify-between items-center group shadow-sm ${
                      answers.skinType === opt.id 
                        ? 'border-[#5A5A40] bg-white/80' 
                        : 'border-white/40 bg-white/20 hover:border-[#5A5A40]/30 mr-1'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif italic text-base md:text-lg text-stone-850">{opt.title}</h4>
                      <p className="text-xs text-stone-500 font-light mt-1">{opt.desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-4 ${
                      answers.skinType === opt.id ? 'border-[#5A5A40] bg-[#5A5A40]' : 'border-stone-300'
                    }`}>
                      {answers.skinType === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-xl mx-auto">
              <h2 className="font-serif italic text-2xl md:text-3xl text-stone-850 mb-4 text-left">¿Cuál es tu mayor preocupación hoy?</h2>
              <p className="text-stone-500 font-light text-sm mb-6 text-left">Selecciona el foco principal que deseas tratar con fórmulas activas enriquecidas.</p>
              
              <div className="space-y-4 text-left">
                {[
                  { id: 'Deshidratación', title: 'Deshidratación y Líneas Finas', desc: 'Falta de volumen y elasticidad, arrugas secas temporales.' },
                  { id: 'Acné y Poros Congestionados', title: 'Poros Congestionados y Brillos', desc: 'Espinillas, poros agrandados que atrapan suciedad.' },
                  { id: 'Envejecimiento y Pérdida de Firmeza', title: 'Pérdida de Firmeza y Elasticidad', desc: 'Líneas de expresión profundas, piel con menos tono.' },
                  { id: 'Manchas y Tono Irregular', title: 'Hiperpigmentación y Opacidad', desc: 'Manchas solares, marcas de acné antiguas, tono apagado.' },
                  { id: 'Sensibilidad y Enrojecimiento', title: 'Enrojecimiento e Irritación', desc: 'Vasos frágiles, comezón, intolerancia climática.' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption('primaryConcern', opt.id)}
                    className={`w-full text-left p-5 border transition-all rounded-[24px] flex justify-between items-center group shadow-sm ${
                      answers.primaryConcern === opt.id 
                        ? 'border-[#5A5A40] bg-white/80' 
                        : 'border-white/40 bg-white/20 hover:border-[#5A5A40]/30 mr-1'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif italic text-base md:text-lg text-stone-850">{opt.title}</h4>
                      <p className="text-xs text-stone-500 font-light mt-1">{opt.desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-4 ${
                      answers.primaryConcern === opt.id ? 'border-[#5A5A40] bg-[#5A5A40]' : 'border-stone-300'
                    }`}>
                      {answers.primaryConcern === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-xl mx-auto">
              <h2 className="font-serif italic text-2xl md:text-3xl text-stone-850 mb-4 text-left">¿Posees alergias o sensibilidades connues?</h2>
              <p className="text-stone-500 font-light text-sm mb-6 text-left">Por ejemplo: aceites esenciales, fragancias de síntesis, ácidos fuertes, etc. Dejar en blanco si no tienes.</p>
              
              <div className="relative mt-8 text-left">
                <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-2">Sensibilidades o Comentarios</label>
                <textarea
                  value={answers.sensitivities}
                  onChange={(e) => handleSelectOption('sensitivities', e.target.value)}
                  className="w-full bg-white/40 border border-white/60 rounded-[20px] py-4 px-5 focus:ring-1 focus:ring-[#5A5A40]/35 focus:border-[#5A5A40]/40 text-xs shadow-inner"
                  placeholder="Escribe aquí si evitas algún ingrediente específico..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-xl mx-auto">
              <h2 className="font-serif italic text-2xl md:text-3xl text-stone-850 mb-4 text-left">¿Cuál es tu filosofía de ritual de belleza?</h2>
              <p className="text-stone-500 font-light text-sm mb-6 text-left">Adaptamos el número de pasos a las costumbres realistas de tu agenda diaria.</p>
              
              <div className="space-y-4 text-left">
                {[
                  { id: 'Minimalista (2-3 pasos esenciales)', title: 'Filosofía Minimalista', desc: '2-3 pasos fundamentales por la mañana y noche. Efectivo, rápido y pragmático.' },
                  { id: 'Completo (Ritual de 5-6 pasos indulgentes)', title: 'Ritual Completo e Indulgente', desc: '5-6 capas de bienestar. Disfrutas el momento de automasaje como una meditación guiada.' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption('routineCommitment', opt.id)}
                    className={`w-full text-left p-5 border transition-all rounded-[24px] flex justify-between items-center group shadow-sm ${
                      answers.routineCommitment === opt.id 
                        ? 'border-[#5A5A40] bg-white/80' 
                        : 'border-white/40 bg-white/20 hover:border-[#5A5A40]/30 mr-1'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif italic text-base md:text-lg text-stone-850">{opt.title}</h4>
                      <p className="text-xs text-stone-500 font-light mt-1">{opt.desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-4 ${
                      answers.routineCommitment === opt.id ? 'border-[#5A5A40] bg-[#5A5A40]' : 'border-stone-300'
                    }`}>
                      {answers.routineCommitment === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="max-w-xl mx-auto text-left">
              <h2 className="font-serif italic text-2xl md:text-3xl text-stone-850 mb-4 text-left">Por último, ¿cuál es tu grupo de edad generacional?</h2>
              <p className="text-stone-500 font-light text-sm mb-6 text-left">Alineamos la densidad y velocidad celular media estimulante de los ingredientes con tu madurez dérmica.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-sans">
                {['Menos de 20', '20s', '30s', '40s', '50s+'].map((ageOpt) => (
                  <button
                    key={ageOpt}
                    onClick={() => handleSelectOption('ageGroup', ageOpt)}
                    className={`p-5 border transition-all text-center rounded-[20px] shadow-sm ${
                      answers.ageGroup === ageOpt
                        ? 'border-[#5A5A40] bg-white/80 font-bold text-[#5A5A40]'
                        : 'border-white/40 bg-white/20 hover:border-[#5A5A40]/35 text-stone-550'
                    }`}
                  >
                    <span className="text-sm block">{ageOpt}</span>
                  </button>
                ))}
              </div>

              {error && (
                <div className="mt-8 p-4 bg-red-50 text-red-600 text-xs rounded-full border border-red-100 text-center">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step buttons footer */}
          {step <= 5 && (
            <div className="max-w-xl mx-auto mt-12 flex justify-between items-center border-t border-white/20 pt-6 font-sans">
              <button
                onClick={handlePrev}
                disabled={step === 1 || loading}
                className="text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-stone-800 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                Volver
              </button>
              
              {step < 5 ? (
                <button
                  onClick={handleNext}
                  className="bg-[#5A5A40] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-stone-855 transition-colors shadow-md"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#5A5A40] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-stone-855 transition-colors shadow-md flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Analizando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Obtener Análisis AI</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Results Step */}
          {step === 6 && result && (
            <div className="animate-fade-in space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <Sparkle className="w-8 h-8 text-[#5A5A40] mx-auto animate-pulse" />
                <span className="text-[10px] text-[#5A5A40] tracking-widest uppercase font-bold">Tu Receta de Piel Exclusiva</span>
                <h2 className="font-serif italic text-3xl md:text-4xl text-stone-850 leading-tight">Ritual Personalizado de Bienestar</h2>
                <p className="text-stone-400 font-light text-xs italic">"Un diálogo entre el rigor clínico y el lujo del silencio."</p>
              </div>

              {/* Summary card */}
              <div className="bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-[32px] border border-white/60 text-left shadow-sm">
                <h3 className="font-serif italic text-lg text-stone-800 mb-3 border-b border-white/20 pb-2">Diagnóstico de la Esencia</h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">{result.summary}</p>
              </div>

              {/* Tab layout of Morning and night routine */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                
                {/* Morning Routine */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-stone-800 border-b border-white/20 pb-3">
                    <Sun className="w-5 h-5 text-[#5A5A40]" />
                    <h3 className="font-serif italic text-xl">Ritual del Alba (Mañana)</h3>
                  </div>

                  <div className="space-y-6">
                    {result.dailyRoutine.morning.map((mStep, i) => (
                      <div key={i} className="p-5 bg-white/35 backdrop-blur-sm border border-white/40 rounded-[24px] space-y-2 shadow-sm">
                        <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">PASO 0{i + 1}</span>
                        <h4 className="font-serif italic text-base text-stone-850">{mStep.stepName}</h4>
                        <p className="text-xs font-bold text-[#5A5A40]/80 italic mt-1">{mStep.purpose}</p>
                        <p className="text-xs text-stone-500 font-light leading-relaxed mt-2">{mStep.instructions}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Night Routine */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-stone-800 border-b border-white/20 pb-3">
                    <Moon className="w-5 h-5 text-[#5A5A40]" />
                    <h3 className="font-serif italic text-xl">Ritual de la Penumbra (Noche)</h3>
                  </div>

                  <div className="space-y-6">
                    {result.dailyRoutine.night.map((nStep, i) => (
                      <div key={i} className="p-5 bg-white/35 backdrop-blur-sm border border-white/40 rounded-[24px] space-y-2 shadow-sm">
                        <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">PASO 0{i + 1}</span>
                        <h4 className="font-serif italic text-base text-stone-850">{nStep.stepName}</h4>
                        <p className="text-xs font-bold text-[#5A5A40]/80 italic mt-1">{nStep.purpose}</p>
                        <p className="text-xs text-stone-500 font-light leading-relaxed mt-2">{nStep.instructions}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Lifestyle Habits */}
              <div className="bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-[32px] border border-white/60">
                <h3 className="font-serif italic text-xl text-stone-800 text-center mb-6">Hábitos Consagrados</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {result.lifestyleAdvice.map((advice, index) => (
                    <div key={index} className="p-5 bg-white/40 rounded-[20px] border border-white/50 relative text-left">
                      <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/85 shadow-sm border border-white/50 flex items-center justify-center font-bold text-xs text-[#5A5A40]">
                        {index + 1}
                      </span>
                      <p className="text-stone-500 font-light text-xs leading-relaxed pr-2 pt-2">{advice}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Recommendations directly linking shop products */}
              <div>
                <h3 className="font-serif italic text-xl text-stone-800 text-center mb-8">Fórmulas Recomendadas para tu Rutina</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getRecommendedProducts().map((recommended) => (
                    <div key={recommended.id} className="p-4 border border-white/50 rounded-[28px] bg-white/30 backdrop-blur-sm flex flex-col hover:bg-white/40 transition-all shadow-sm">
                      <div className="aspect-[4/3] rounded-[20px] overflow-hidden bg-stone-100 mb-4">
                        <img 
                          src={recommended.imageUrl} 
                          alt={recommended.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between text-left font-sans">
                        <div className="space-y-1">
                          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest block">
                            {recommended.category}
                          </span>
                          <h4 className="font-serif italic text-base text-stone-850 leading-tight">{recommended.name}</h4>
                          <p className="text-xs text-stone-500 font-light mt-2 line-clamp-2">
                            {recommended.description}
                          </p>
                        </div>
                        <div className="space-y-3 mt-4">
                          <p className="font-bold text-sm text-stone-900">${recommended.price.toFixed(2)} USD</p>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                onAddToCart(recommended);
                              }}
                              className="w-full py-2.5 bg-[#5A5A40] text-white rounded-full font-bold text-[10px] uppercase tracking-wider hover:bg-stone-800 transition-colors shadow-sm"
                            >
                              Añadir
                            </button>
                            <button
                              onClick={() => {
                                onAddToShelf(recommended);
                              }}
                              className={`w-full py-2.5 border rounded-full font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                                isSavedOnShelf(recommended)
                                  ? 'bg-white border-[#5A5A40] text-[#5A5A40]'
                                  : 'border-white/50 bg-white/20 text-stone-500 hover:text-[#5A5A40]'
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${isSavedOnShelf(recommended) ? 'fill-current' : ''}`} />
                              <span>{isSavedOnShelf(recommended) ? 'Sí' : 'Shelf'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset Quiz button */}
              <div className="text-center pt-8 border-t border-[#5A5A40]/10 font-sans">
                <button
                  onClick={resetQuiz}
                  className="font-bold text-[10px] text-stone-400 hover:text-stone-800 uppercase tracking-widest transition-colors"
                >
                  Repetir Análisis Virtual
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

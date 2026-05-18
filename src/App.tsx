/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Radar, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  History, 
  RefreshCcw, 
  Sparkles,
  Youtube,
  Instagram,
  Linkedin,
  Clock,
  ChevronRight,
  Plus,
  Search,
  LayoutDashboard,
  BarChart3,
  Smartphone,
  Copy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AnalysisResult } from './types';

const platforms = [
  { id: 'tiktok', name: 'TikTok', icon: Smartphone, color: 'text-pink-500' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-purple-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-500' },
];

export default function App() {
  const [idea, setIdea] = useState('');
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState<'analyzer' | 'history' | 'trends'>('analyzer');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('luxor_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleAnalyze = async () => {
    if (!idea) return;
    setIsAnalyzing(true);
    try {
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, platform, niche }),
      });
      const data = await resp.json();
      const finalResult = { ...data, timestamp: Date.now(), idea };
      setResult(finalResult);
      const newHistory = [finalResult, ...history.slice(0, 49)];
      setHistory(newHistory);
      localStorage.setItem('luxor_history', JSON.stringify(newHistory));
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen flex text-white overflow-hidden bg-[#050505]">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-white/10 bg-luxor-sidebar z-50 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-luxor-accent rounded-lg flex items-center justify-center font-display font-black text-black text-xs">LX</div>
          <span className="hidden md:block font-display font-bold text-xl tracking-tight">LUXOR</span>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {[
            { id: 'analyzer', name: 'Analizador IA', icon: Radar },
            { id: 'history', name: 'Historial', icon: History },
            { id: 'trends', name: 'Radar Tendencias', icon: TrendingUp },
          ].map((tab) => (
            <button
              id={`tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === tab.id ? 'bg-white/5 text-luxor-accent font-medium' : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <tab.icon size={20} />
              <span className="hidden md:block">{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/10">
          <div className="hidden md:flex flex-col gap-1 p-4 bg-luxor-accent/10 rounded-xl border border-luxor-accent/20">
            <p className="text-[10px] text-luxor-accent font-bold uppercase tracking-widest">Plan Agency</p>
            <p className="text-xs text-white/70">Créditos ilimitados</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative luxor-gradient">
        <header className="sticky top-0 h-16 border-b border-white/10 bg-luxor-black/50 backdrop-blur-xl z-40 flex items-center justify-between px-8">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Panel de Estrategia</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Análisis en tiempo real • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10 transition-all">
               <ShieldCheck size={14} />
               <span>Importar Ideas</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 luxor-button-primary rounded-lg text-xs font-bold transition-all">
               <Plus size={14} />
               <span>Nuevo Análisis</span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {activeTab === 'analyzer' && (
            <AnimatePresence mode="wait">
              {!result || isAnalyzing ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12 py-12"
                >
                  <div className="space-y-4 text-center">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="mx-auto w-24 h-24 rounded-full bg-luxor-accent/10 border border-luxor-accent/20 flex items-center justify-center mb-6"
                    >
                      <Radar className="text-luxor-accent" size={40} />
                    </motion.div>
                    <h1 className="text-5xl font-display font-black tracking-tight">Potencia tus Ideas</h1>
                    <p className="text-white/40 text-lg max-w-2xl mx-auto">Detecta el potencial viral de tu contenido antes de publicarlo.</p>
                  </div>

                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="luxor-card p-2 group focus-within:border-luxor-accent/30 transition-all duration-500">
                      <textarea
                        id="idea-input"
                        placeholder="Escribe tu idea estratégica de contenido..."
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        className="w-full h-32 bg-transparent p-4 outline-none resize-none text-xl placeholder:text-white/20 font-medium"
                      />
                      <div className="flex items-center justify-between p-2 border-t border-white/10">
                        <div className="flex gap-2">
                          {platforms.map(p => (
                            <button
                              id={`select-platform-${p.id}`}
                              key={p.id}
                              onClick={() => setPlatform(p.id)}
                              className={`p-2 rounded-lg transition-all ${platform === p.id ? 'bg-luxor-accent/10 text-luxor-accent' : 'text-white/20 hover:text-white/40'}`}
                              title={p.name}
                            >
                              <p.icon size={18} />
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                             <Target size={14} className="text-white/40" />
                             <input 
                               id="niche-input"
                               placeholder="Nicho/Industria"
                               value={niche}
                               onChange={(e) => setNiche(e.target.value)}
                               className="bg-transparent outline-none text-xs w-32 placeholder:text-white/20"
                             />
                           </div>
                           <button
                             id="analyze-button"
                             onClick={handleAnalyze}
                             disabled={!idea || isAnalyzing}
                             className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${
                               !idea || isAnalyzing ? 'bg-white/5 text-white/20' : 'bg-white text-black hover:scale-105 active:scale-95'
                             }`}
                           >
                             {isAnalyzing ? (
                               <RefreshCcw size={18} className="animate-spin" />
                             ) : (
                               <>
                                 <span>Analizar</span>
                                 <Plus size={18} />
                               </>
                             )}
                           </button>
                        </div>
                      </div>
                    </div>

                    {isAnalyzing && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-4 py-8"
                      >
                         <div className="flex justify-center gap-1">
                            {[0,1,2].map(i => (
                              <motion.div
                                key={i}
                                animate={{ height: [8, 24, 8] }}
                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                className="w-1 bg-luxor-accent rounded-full"
                              />
                            ))}
                         </div>
                         <p className="text-luxor-accent font-mono text-sm tracking-widest uppercase">Radar IA Activo...</p>
                         <p className="text-white/40 text-[10px] uppercase font-bold italic tracking-tighter">Evaluando retención psicológica...</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 pb-20"
                >
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setResult(null)}
                      className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                    >
                      <ArrowRight className="rotate-180" size={18} />
                      <span>Volver al Analizador</span>
                    </button>
                    <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                      <Clock size={12} />
                      <span>{new Date(result.timestamp!).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Header Result - Bento Style */}
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 lg:col-span-8 luxor-card p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-luxor-gray to-black">
                       <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] pointer-events-none rotate-12">
                          <Radar size={300} className="text-luxor-accent" strokeWidth={0.5} />
                       </div>
                       <div className="relative z-10 space-y-4">
                         <span className="inline-block px-2 py-1 bg-luxor-accent text-black text-[10px] font-bold rounded uppercase tracking-wider">Análisis Completado</span>
                         <h2 className="text-4xl font-display font-black leading-tight max-w-2xl">{result.idea}</h2>
                         <div className="flex items-center gap-4 text-white/40 text-xs font-mono">
                           <p>NICHO: <span className="text-white">{niche || 'Digital'}</span></p>
                           <p>PLATAFORMA: <span className="text-white uppercase">{platform}</span></p>
                         </div>
                       </div>
                       <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                         {[
                           { label: 'Viralidad', val: result.analysis.viralPotential, icon: Zap },
                           { label: 'Autoridad', val: result.analysis.authorityPotential, icon: ShieldCheck },
                           { label: 'Conversión', val: result.analysis.conversionPotential, icon: Target },
                           { label: 'Retención Est.', val: result.analysis.retentionPotential, icon: TrendingUp },
                         ].map(m => (
                           <div key={m.label} className="space-y-1">
                             <span className="text-[10px] uppercase font-bold text-white/40 tracking-tighter block">{m.label}</span>
                             <p className="text-4xl font-black">{m.val * 10}<span className="text-lg opacity-20">/100</span></p>
                             <div className="h-0.5 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${m.val * 10}%` }}
                                 className="h-full bg-luxor-accent luxor-shadow"
                               />
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>

                    <div className="col-span-12 lg:col-span-4 luxor-card p-8 flex flex-col items-center justify-center text-center space-y-4 border-luxor-accent/20 bg-luxor-accent/[0.02]">
                      <div className="relative w-48 h-48">
                         <svg className="w-full h-full transform -rotate-90">
                           <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                           <motion.circle 
                             cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={528} 
                             initial={{ strokeDashoffset: 528 }}
                             animate={{ strokeDashoffset: 528 - (528 * result.score) / 100 }}
                             className="text-luxor-accent" 
                             strokeLinecap="round"
                           />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-display font-black leading-none">{result.score}</span>
                            <span className="text-[10px] uppercase text-white/40 font-bold tracking-widest mt-1">Radar Score</span>
                         </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold uppercase tracking-widest text-luxor-accent">Potencial Maravilloso</p>
                        <p className="text-xs text-white/40 max-w-[180px]">Esta idea se encuentra en el top 5% de las analizadas en tu nicho.</p>
                      </div>
                    </div>

                    {/* Bento row 2 */}
                    <div className="col-span-12 md:col-span-6 lg:col-span-7 luxor-card p-8 space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 underline underline-offset-8 decoration-luxor-accent/50">
                           Explosive Hooks
                        </h3>
                        <div className="space-y-4">
                           {result.improvements.strongerHooks.map((h, i) => (
                             <div key={i} className="group relative">
                               <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-sm leading-relaxed pr-12 font-medium">
                                  {h}
                               </div>
                               <button 
                                 onClick={() => copyToClipboard(h, `hook-${i}`)}
                                 className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-luxor-accent transition-colors"
                               >
                                  {copiedId === `hook-${i}` ? <CheckCircle2 size={16} className="text-luxor-accent" /> : <Copy size={16} />}
                               </button>
                             </div>
                           ))}
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-6 lg:col-span-5 luxor-card p-8 space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 underline underline-offset-8 decoration-luxor-accent/50">
                           Diagnóstico IA
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                           {Object.entries(result.diagnosis).slice(0, 3).map(([key, data]: [string, any]) => (
                             <div key={key} className="flex gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                               <div className={`mt-1 shrink-0 ${data.status === 'fuerte' || data.status === 'alta' ? 'text-luxor-accent' : 'text-amber-500'}`}>
                                  {data.status === 'fuerte' || data.status === 'alta' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                               </div>
                               <div>
                                 <p className="text-[10px] uppercase font-bold text-white/20 tracking-wider font-mono">{key}</p>
                                 <p className="text-xs text-white/70 font-medium leading-relaxed">{data.detail}</p>
                               </div>
                             </div>
                           ))}
                        </div>
                    </div>

                    {/* Bento row 3 */}
                    <div className="col-span-12 lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                       {(Object.entries(result.titles) as [string, string][]).map(([key, val]) => (
                         <div key={key} className="luxor-card p-6 space-y-3 flex flex-col justify-between group h-full hover:bg-luxor-accent/[0.03]">
                            <div>
                              <span className="text-[10px] uppercase font-black text-luxor-accent tracking-widest block mb-2">{key}</span>
                              <p className="text-sm font-bold leading-tight group-hover:text-white transition-colors">{val}</p>
                            </div>
                            <button 
                              onClick={() => copyToClipboard(val, `title-${key}`)}
                              className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-luxor-accent hover:text-black transition-all"
                            >
                               {copiedId === `title-${key}` ? 'Copiado' : 'Copiar Título'}
                            </button>
                         </div>
                       ))}
                    </div>

                    {/* Bento row 4 */}
                    <div className="col-span-12 md:col-span-7 luxor-card p-8">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Multi-Channel Transformation</h3>
                           <span className="px-2 py-0.5 bg-luxor-accent/10 text-luxor-accent text-[10px] rounded-full uppercase font-bold">Smart Export Ready</span>
                        </div>
                        <div className="space-y-3">
                           {(Object.entries(result.adaptation) as [string, string][]).map(([key, val]) => (
                              <details key={key} className="group overflow-hidden rounded-xl border border-white/5 bg-white/[0.01]">
                                 <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.03] transition-all">
                                    <div className="flex items-center gap-3">
                                       {key === 'tiktok' && <Smartphone size={16} className="text-emerald-400" />}
                                       {key === 'youtube' && <Youtube size={16} className="text-emerald-400" />}
                                       {key === 'linkedin' && <Linkedin size={16} className="text-emerald-400" />}
                                       {key === 'instagram' && <Instagram size={16} className="text-emerald-400" />}
                                       <span className="capitalize font-bold text-sm tracking-tight">{key} Content</span>
                                    </div>
                                    <ChevronRight className="group-open:rotate-90 transition-transform opacity-30" size={16} />
                                 </summary>
                                 <div className="p-5 bg-black/40 text-xs text-white/50 leading-relaxed font-mono whitespace-pre-wrap border-t border-white/5">
                                    {val}
                                 </div>
                              </details>
                           ))}
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
                       <div className="flex-1 luxor-card p-8 bg-luxor-accent/[0.05] border-luxor-accent/20 flex flex-col justify-center gap-4 text-center">
                          <p className="text-xs uppercase font-black tracking-widest text-luxor-accent underline underline-offset-4">Retención de Audiencia</p>
                          <div className="flex items-end justify-center gap-2 h-20">
                             {[0.4, 0.7, 0.5, 0.9, 0.8, 1, 0.9].map((h, i) => (
                               <motion.div 
                                 key={i}
                                 initial={{ height: 0 }}
                                 animate={{ height: `${h * 100}%` }}
                                 className={`w-4 rounded-t-sm ${i === 5 ? 'bg-luxor-accent' : 'bg-white/10'}`}
                               />
                             ))}
                          </div>
                          <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Predicción: Alta Retribución</p>
                       </div>
                       <button 
                         onClick={() => setResult(null)}
                         className="w-full py-5 rounded-2xl luxor-button-primary font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
                       >
                         Nuevo Escaneo IA
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {activeTab === 'history' && (
             <div className="space-y-8 py-8">
                <div className="flex items-center justify-between">
                   <h2 className="text-3xl font-display font-bold">Historial de Radar</h2>
                   <button 
                     onClick={() => { setHistory([]); localStorage.removeItem('luxor_history'); }}
                     className="text-xs text-white/20 hover:text-red-500 transition-colors uppercase tracking-widest font-bold"
                   >
                     Limpiar todo
                   </button>
                </div>
                {history.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {history.map((item, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => { setResult(item); setActiveTab('analyzer'); }}
                        className="luxor-card p-6 cursor-pointer hover:border-luxor-gold/30 transition-all group"
                      >
                         <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-mono text-white/40">{new Date(item.timestamp!).toLocaleDateString()}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-lg font-display font-black text-luxor-accent">{item.score}</span>
                               <ArrowRight size={14} className="text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                            </div>
                         </div>
                         <p className="font-bold line-clamp-2 leading-snug group-hover:text-luxor-accent transition-colors">{item.idea}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center luxor-card border-dashed border-white/10 bg-transparent">
                     <p className="text-white/20">No hay ideas analizadas todavía.</p>
                  </div>
                )}
             </div>
          )}

          {activeTab === 'trends' && (
             <div className="space-y-8 py-8">
                <h2 className="text-3xl font-display font-bold">Radar de Tendencias 2026</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                     { title: 'AI UGC + Avatars', growth: '+90%', desc: 'Contenido generado con IA para anuncios masivos.', tags: ['Marketing', 'Ecom'] },
                     { title: 'Hiper-Autenticidad', growth: '+120%', desc: 'Valoración del error real y detrás de cámaras.', tags: ['Personal Brand'] },
                     { title: 'Long Form Returns', growth: '+45%', desc: 'YouTube recuperando fuerza por autoridad.', tags: ['Edutainment'] },
                     { title: 'Faceless Hubs', growth: '+200%', desc: 'Narraciones automáticas con storytelling IA.', tags: ['Niches'] },
                     { title: 'Micro-Comunidades', growth: '+75%', desc: 'Intereses hiper-específicos dominan el feed.', tags: ['Community'] },
                     { title: 'AI Multimodal', growth: '+310%', desc: 'Una idea genera 10 formatos instantáneamente.', tags: ['Future'] },
                   ].map((t, idx) => (
                      <div key={idx} className="luxor-card p-6 space-y-4">
                         <div className="flex items-center justify-between">
                            <h4 className="font-black text-sm uppercase tracking-tight">{t.title}</h4>
                            <span className="text-[10px] font-mono text-luxor-accent font-bold px-2 py-0.5 bg-luxor-accent/10 rounded-full">{t.growth}</span>
                         </div>
                         <p className="text-[10px] text-white/40 leading-relaxed font-medium uppercase tracking-tighter">{t.desc}</p>
                         <div className="flex gap-2">
                            {t.tags.map(tag => (
                              <span key={tag} className="text-[8px] uppercase tracking-tighter font-black px-2 py-0.5 bg-white/5 rounded-full border border-white/5 text-white/40">{tag}</span>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

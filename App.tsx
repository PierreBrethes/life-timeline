
import React, { useState, useCallback, useRef } from 'react';
import { AppState, Subject, Milestone } from './types';
import { SUBJECTS } from './constants';
import { fetchTimelineData, generateMilestoneImage } from './services/geminiService';
import { storageService } from './services/storageService';
import Header from './components/Header';
import SubjectCard from './components/SubjectCard';
import TimelineItem from './components/TimelineItem';
import { Loader2, ChevronRight, ChevronLeft, Download, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SELECTING);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const startGeneration = async (subject: Subject) => {
    setState(AppState.LOADING);
    setIsFromCache(false);
    setError(null);
    try {
      const data = await fetchTimelineData(subject.label);
      setMilestones(data);
      setState(AppState.VIEWING);
      
      data.forEach(async (milestone, index) => {
        const url = await generateMilestoneImage(milestone.imagePrompt);
        setMilestones(prev => {
          const updated = prev.map((m, i) => i === index ? { ...m, imageUrl: url } : m);
          storageService.saveTimeline(subject.id, updated);
          return updated;
        });
      });
    } catch (err) {
      setError("Erreur lors de la génération. Réessayez.");
      setState(AppState.ERROR);
    }
  };

  const handleSelectSubject = useCallback(async (subject: Subject) => {
    setSelectedSubject(subject);
    const cached = storageService.loadTimeline(subject.id);
    
    if (cached) {
      setMilestones(cached);
      setIsFromCache(true);
      setState(AppState.VIEWING);
    } else {
      await startGeneration(subject);
    }
  }, []);

  const handleUpdateMilestone = (index: number, updated: Milestone) => {
    setMilestones(prev => {
      const next = prev.map((m, i) => i === index ? updated : m);
      if (selectedSubject) storageService.saveTimeline(selectedSubject.id, next);
      return next;
    });
  };

  const handleRegenerate = () => {
    if (selectedSubject && confirm("Voulez-vous vraiment écraser cette timeline ?")) {
      startGeneration(selectedSubject);
    }
  };

  const handleExport = () => {
    if (selectedSubject) storageService.exportToJSON(selectedSubject.label, milestones);
  };

  const handleBack = useCallback(() => {
    setState(AppState.SELECTING);
    setSelectedSubject(null);
    setMilestones([]);
    setError(null);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -500 : 500;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#020617] text-white overflow-hidden">
      <Header showBack={state !== AppState.SELECTING} onBack={handleBack} />

      <main className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
        {state === AppState.SELECTING && (
          <div className="flex-1 overflow-y-auto px-6 py-12">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                  SCI<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">TIME</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
                  Une odyssée temporelle à travers les découvertes qui ont façonné l'humanité.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SUBJECTS.map((s) => (
                  <SubjectCard key={s.id} subject={s} onClick={handleSelectSubject} />
                ))}
              </div>
            </div>
          </div>
        )}

        {state === AppState.LOADING && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-md z-50">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-t-2 border-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-b-2 border-indigo-500 animate-spin-reverse" />
              </div>
            </div>
            <div className="mt-8 text-center space-y-2">
              <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white">Initialisation</h2>
              <p className="text-slate-500 font-mono text-sm">Compilation des données pour {selectedSubject?.label}...</p>
            </div>
          </div>
        )}

        {state === AppState.VIEWING && selectedSubject && (
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Navigation & Controls */}
            <div className="absolute top-6 left-12 right-12 flex justify-between items-end z-40 pointer-events-none">
              <div className="pointer-events-auto space-y-2">
                <div className="flex items-center gap-4">
                  <h2 className={`text-5xl font-black bg-gradient-to-r ${selectedSubject.color} bg-clip-text text-transparent tracking-tighter uppercase`}>
                    {selectedSubject.label}
                  </h2>
                  {isFromCache && (
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-blue-400 border border-blue-500/20 font-black uppercase tracking-widest">Archive</span>
                  )}
                </div>
                <div className="flex gap-4">
                  <button onClick={handleRegenerate} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all group">
                    <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" /> Régénérer
                  </button>
                  <button onClick={handleExport} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
                    <Download className="w-3 h-3" /> Exporter
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 pointer-events-auto">
                <button onClick={() => scroll('left')} className="p-4 rounded-full bg-slate-900/80 backdrop-blur border border-white/5 text-slate-400 hover:text-white hover:scale-110 transition-all active:scale-95">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={() => scroll('right')} className="p-4 rounded-full bg-slate-900/80 backdrop-blur border border-white/5 text-slate-400 hover:text-white hover:scale-110 transition-all active:scale-95">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Timeline Core */}
            <div className="flex-1 flex items-center relative overflow-hidden">
              {/* Ligne d'Axe Centrale */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-slate-700 to-transparent z-10" />
              <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[60px] bg-gradient-to-r ${selectedSubject.color} opacity-5 blur-[40px] z-0`} />

              <div 
                ref={scrollContainerRef}
                className="flex-1 h-full overflow-x-auto overflow-y-hidden px-[15vw] flex items-center scroll-smooth no-scrollbar"
              >
                <div className="flex h-full items-center">
                  {milestones.map((m, idx) => (
                    <TimelineItem 
                      key={`${m.year}-${idx}`} 
                      milestone={m} 
                      index={idx} 
                      color={selectedSubject.color}
                      onUpdate={(updated) => handleUpdateMilestone(idx, updated)}
                    />
                  ))}
                  <div className="w-[400px] flex-shrink-0" /> {/* Spacer fin */}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

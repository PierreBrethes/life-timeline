
import React, { useState, useCallback, useRef } from 'react';
import { AppState, Subject, Milestone } from './types';
import { SUBJECTS } from './constants';
import { fetchTimelineData, generateMilestoneImage } from './services/geminiService';
import { storageService } from './services/storageService';
import Header from './components/Header';
import SubjectCard from './components/SubjectCard';
import TimelineItem from './components/TimelineItem';
import { Loader2, AlertCircle, ChevronRight, ChevronLeft, Download, RefreshCw, Save } from 'lucide-react';

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
    if (selectedSubject && confirm("Voulez-vous vraiment écraser cette timeline par une nouvelle génération IA ?")) {
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
      const amount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header showBack={state !== AppState.SELECTING} onBack={handleBack} />

      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {state === AppState.SELECTING && (
          <div className="max-w-7xl mx-auto w-full px-4 py-12 space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                Chroniques de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Science</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Explorez l'histoire, peaufinez les découvertes et sauvegardez votre bibliothèque de connaissances.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SUBJECTS.map((s) => (
                <SubjectCard key={s.id} subject={s} onClick={handleSelectSubject} />
              ))}
            </div>
          </div>
        )}

        {state === AppState.LOADING && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Consultation des archives...</h2>
              <p className="text-slate-400">L'IA rédige la chronologie pour {selectedSubject?.label}</p>
            </div>
          </div>
        )}

        {state === AppState.VIEWING && selectedSubject && (
          <div className="flex-1 flex flex-col h-full relative group">
            <div className="pt-8 pb-4 px-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className={`text-4xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r ${selectedSubject.color}`}>
                    {selectedSubject.label}
                  </h2>
                  {isFromCache && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 border border-slate-700 font-bold uppercase tracking-widest">Bibliothèque</span>
                  )}
                </div>
                <div className="flex gap-4">
                  <button onClick={handleRegenerate} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
                    <RefreshCw className="w-3 h-3" /> Régénérer l'IA
                  </button>
                  <button onClick={handleExport} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
                    <Download className="w-3 h-3" /> Exporter JSON
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => scroll('left')} className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => scroll('right')} className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center relative overflow-hidden">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-slate-800/50 z-0" />
              <div 
                ref={scrollContainerRef}
                className="flex-1 h-full overflow-x-auto overflow-y-hidden px-24 flex items-center scroll-smooth no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex items-center">
                  {milestones.map((m, idx) => (
                    <TimelineItem 
                      key={`${m.year}-${m.title}`} 
                      milestone={m} 
                      index={idx} 
                      color={selectedSubject.color}
                      onUpdate={(updated) => handleUpdateMilestone(idx, updated)}
                    />
                  ))}
                  <div className="flex-shrink-0 w-80 flex flex-col items-center opacity-20">
                    <div className="w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-700" />
                  </div>
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

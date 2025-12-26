
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AppState, Subject, Milestone } from './types';
import { SUBJECTS } from './constants';
import { fetchTimelineData, generateMilestoneImage } from './services/geminiService';
import Header from './components/Header';
import SubjectCard from './components/SubjectCard';
import TimelineItem from './components/TimelineItem';
import { Loader2, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SELECTING);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectSubject = useCallback(async (subject: Subject) => {
    setSelectedSubject(subject);
    setState(AppState.LOADING);
    setError(null);

    try {
      const data = await fetchTimelineData(subject.label);
      setMilestones(data);
      setState(AppState.VIEWING);
      
      // Start generating images in background after timeline is shown
      data.forEach(async (milestone, index) => {
        const url = await generateMilestoneImage(milestone.imagePrompt);
        setMilestones(prev => prev.map((m, i) => 
          i === index ? { ...m, imageUrl: url } : m
        ));
      });
      
    } catch (err) {
      console.error(err);
      setError("Failed to generate timeline. Please check your connection.");
      setState(AppState.ERROR);
    }
  }, []);

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
      <Header 
        showBack={state !== AppState.SELECTING} 
        onBack={handleBack} 
      />

      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {state === AppState.SELECTING && (
          <div className="max-w-7xl mx-auto w-full px-4 py-12 space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                Chronicle of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Human Discovery</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                A visually-driven exploration of the monumental milestones that have shaped our scientific history.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SUBJECTS.map((s) => (
                <SubjectCard 
                  key={s.id} 
                  subject={s} 
                  onClick={handleSelectSubject} 
                />
              ))}
            </div>
          </div>
        )}

        {state === AppState.LOADING && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl opacity-20 bg-blue-500 rounded-full animate-pulse"></div>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Architecting Timeline...</h2>
              <p className="text-slate-400 animate-pulse">Scanning the history of {selectedSubject?.label}</p>
            </div>
          </div>
        )}

        {state === AppState.ERROR && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-red-500/10 rounded-full mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Connection Failed</h2>
            <p className="text-slate-400 mb-8 max-w-md">{error}</p>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Return Home
            </button>
          </div>
        )}

        {state === AppState.VIEWING && selectedSubject && (
          <div className="flex-1 flex flex-col h-full relative group">
            <div className="pt-12 pb-6 px-12 flex justify-between items-end">
              <div>
                <h2 className={`text-4xl md:text-5xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r ${selectedSubject.color}`}>
                  {selectedSubject.label}
                </h2>
                <p className="text-slate-500 mt-2 font-medium">Scroll horizontally to travel through time</p>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => scroll('left')} className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={() => scroll('right')} className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Timeline Container */}
            <div className="flex-1 flex items-center relative overflow-hidden">
              {/* Horizontal Axis Line */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-slate-800/50 z-0" />
              <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r ${selectedSubject.color} opacity-30 blur-sm z-0`} />

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
                    />
                  ))}
                  
                  {/* Final Spacer */}
                  <div className="flex-shrink-0 w-80 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-700" />
                    <div className="mt-4 text-[10px] uppercase font-bold text-slate-700 tracking-[0.2em]">The Future Awaits</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hint Overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-slate-600 pointer-events-none">
              <div className="w-12 h-1 bg-slate-900 rounded-full overflow-hidden">
                 <div className={`h-full bg-gradient-to-r ${selectedSubject.color} animate-progress`} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Chronological Stream</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

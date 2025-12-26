
import React, { useState } from 'react';
import { Milestone } from '../types';
import { Loader2, Edit3, Check, Star } from 'lucide-react';

interface TimelineItemProps {
  milestone: Milestone;
  index: number;
  color: string;
  onUpdate: (updated: Milestone) => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ milestone, index, color, onUpdate }) => {
  const isTop = index % 2 === 0;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(milestone.title);
  const [editedDesc, setEditedDesc] = useState(milestone.description);

  const handleSave = () => {
    onUpdate({ ...milestone, title: editedTitle, description: editedDesc });
    setIsEditing(false);
  };

  const YearDisplay = (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`text-5xl font-black mono tracking-tighter bg-gradient-to-b from-white to-slate-600 bg-clip-text text-transparent select-none`}>
        {milestone.year}
      </div>
      <div className={`w-12 h-1.5 mt-2 rounded-full bg-gradient-to-r ${color} shadow-[0_0_15px_rgba(255,255,255,0.3)]`} />
    </div>
  );

  const CardDisplay = (
    <div className="w-[340px] bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl hover:border-slate-500 transition-all duration-300 group/card">
      <div className="relative h-44 bg-slate-950 flex items-center justify-center overflow-hidden">
        {milestone.imageUrl ? (
          <img 
            src={milestone.imageUrl} 
            alt={milestone.title} 
            className="w-full h-full object-cover opacity-70 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-700" 
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500/50 animate-spin" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black">Syncing Visuals</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase border border-white/10 tracking-widest">
          {milestone.category}
        </div>

        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white backdrop-blur-md border border-white/10 transition-all"
        >
          {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-5 space-y-3">
        {isEditing ? (
          <div className="space-y-3">
            <input 
              value={editedTitle} 
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <textarea 
              value={editedDesc} 
              onChange={(e) => setEditedDesc(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 h-20 resize-none focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-white leading-tight">{milestone.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 font-medium">{milestone.description}</p>
            <div className="flex items-center gap-2 pt-1">
              <Star className={`w-3 h-3 text-gradient bg-gradient-to-r ${color}`} />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-3 h-1 rounded-full ${i < milestone.impactScore ? `bg-gradient-to-r ${color}` : 'bg-slate-800'}`} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-shrink-0 w-[450px] h-full relative flex flex-col items-center justify-center">
      {/* Ligne verticale de connexion */}
      <div className={`absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-slate-800 to-transparent opacity-50`} />
      
      {/* Point d'ancrage central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="relative w-6 h-6 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${color} blur-md opacity-20 animate-pulse`} />
          <div className={`w-4 h-4 rounded-full bg-slate-950 border-2 border-slate-500 flex items-center justify-center shadow-2xl`}>
            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color} shadow-[0_0_10px_white]`} />
          </div>
        </div>
      </div>

      {/* Zone Haut */}
      <div className="absolute bottom-1/2 mb-12 w-full flex flex-col items-center z-20">
        {isTop ? CardDisplay : YearDisplay}
      </div>

      {/* Zone Bas */}
      <div className="absolute top-1/2 mt-12 w-full flex flex-col items-center z-20">
        {!isTop ? CardDisplay : YearDisplay}
      </div>
    </div>
  );
};

export default TimelineItem;


import React, { useState } from 'react';
import { Milestone } from '../types';
import { Loader2, Edit3, Check } from 'lucide-react';

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

  return (
    <div className="flex-shrink-0 w-80 md:w-96 relative flex flex-col items-center group/item">
      <div className={`absolute left-1/2 -translate-x-1/2 w-px h-24 bg-slate-700 ${isTop ? 'bottom-0' : 'top-0'}`} />
      
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 z-20 flex items-center justify-center">
        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color} shadow-[0_0_10px_rgba(255,255,255,0.5)]`} />
      </div>

      <div className={`relative w-full p-4 transition-all duration-500 ${isTop ? 'mb-24' : 'mt-24'}`}>
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl group-hover/item:border-slate-600 transition-colors">
          <div className="relative h-44 bg-slate-950 flex items-center justify-center overflow-hidden">
            {milestone.imageUrl ? (
              <img src={milestone.imageUrl} alt={milestone.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-slate-700 animate-spin" />
                <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Génération Image...</span>
              </div>
            )}
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 text-[10px] font-bold text-white uppercase">{milestone.category}</div>
            
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white backdrop-blur-sm transition-all"
            >
              {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-5 space-y-3">
            <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold mono bg-gradient-to-r ${color} text-white`}>
              {milestone.year}
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <input 
                  value={editedTitle} 
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <textarea 
                  value={editedDesc} 
                  onChange={(e) => setEditedDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 h-20 resize-none focus:outline-none focus:border-blue-500"
                />
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-white leading-tight line-clamp-1">{milestone.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{milestone.description}</p>
              </>
            )}
            
            <div className="pt-2 flex items-center justify-between">
               <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className={`w-2 h-1 rounded-full ${i < milestone.impactScore ? `bg-gradient-to-r ${color}` : 'bg-slate-800'}`} />
                 ))}
               </div>
               <span className="text-[9px] uppercase font-bold text-slate-600">Impact</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;

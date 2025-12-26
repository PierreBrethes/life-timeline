
import React from 'react';
import { Milestone } from '../types';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface TimelineItemProps {
  milestone: Milestone;
  index: number;
  color: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ milestone, index, color }) => {
  const isTop = index % 2 === 0;

  return (
    <div className="flex-shrink-0 w-80 md:w-96 relative flex flex-col items-center">
      {/* Connector Line to Central Axis */}
      <div className={`absolute left-1/2 -translate-x-1/2 w-px h-24 bg-slate-700 ${isTop ? 'bottom-0' : 'top-0'}`} />
      
      {/* Node Dot */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 z-20 flex items-center justify-center">
        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color} shadow-[0_0_10px_rgba(255,255,255,0.5)]`} />
      </div>

      {/* Card Content */}
      <div className={`relative w-full p-4 transition-all duration-500 transform hover:scale-[1.03] ${isTop ? 'mb-24' : 'mt-24'}`}>
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Image Header */}
          <div className="relative h-44 bg-slate-950 flex items-center justify-center overflow-hidden">
            {milestone.imageUrl ? (
              <img 
                src={milestone.imageUrl} 
                alt={milestone.title} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-slate-700 animate-spin" />
                <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Visualizing...</span>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
              {milestone.category}
            </div>
          </div>

          <div className="p-5 space-y-3">
            <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold mono bg-gradient-to-r ${color} text-white`}>
              {milestone.year}
            </div>
            
            <h3 className="text-lg font-bold text-white leading-tight line-clamp-1">{milestone.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
              {milestone.description}
            </p>
            
            <div className="pt-2 flex items-center justify-between">
               <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => (
                   <div 
                     key={i} 
                     className={`w-2 h-1 rounded-full ${i < milestone.impactScore ? `bg-gradient-to-r ${color}` : 'bg-slate-800'}`} 
                   />
                 ))}
               </div>
               <span className="text-[9px] uppercase font-bold text-slate-600">Impact Score</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;

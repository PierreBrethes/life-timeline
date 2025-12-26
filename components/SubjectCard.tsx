
import React from 'react';
import { Subject } from '../types';
import { ICON_MAP } from '../constants';

interface SubjectCardProps {
  subject: Subject;
  onClick: (subject: Subject) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick }) => {
  return (
    <button
      onClick={() => onClick(subject)}
      className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 transition-all hover:border-slate-600 hover:scale-[1.02] text-left"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${subject.color} transition-opacity duration-300`} />
      
      <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${subject.color} shadow-lg shadow-black/40`}>
        {ICON_MAP[subject.icon]}
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
        {subject.label}
      </h3>
      
      <p className="text-slate-400 text-sm leading-relaxed">
        {subject.description}
      </p>

      <div className="mt-6 flex items-center text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-slate-200 transition-colors">
        Explore Timeline
        <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </button>
  );
};

export default SubjectCard;


import React from 'react';
import { Atom, Rocket, Binary, Microscope, Dna, FlaskConical } from 'lucide-react';
import { Subject } from './types';

export const SUBJECTS: Subject[] = [
  {
    id: 'quantum-physics',
    label: 'Quantum Physics',
    icon: 'Atom',
    color: 'from-cyan-500 to-blue-600',
    description: 'The study of matter and energy at its most fundamental level.'
  },
  {
    id: 'space-exploration',
    label: 'Space',
    icon: 'Rocket',
    color: 'from-purple-500 to-indigo-600',
    description: 'Humanitys journey beyond Earth into the vast cosmos.'
  },
  {
    id: 'mathematics',
    label: 'Mathematics',
    icon: 'Binary',
    color: 'from-amber-500 to-orange-600',
    description: 'The language of logic, patterns, and the universe.'
  },
  {
    id: 'biology-genetics',
    label: 'Biology & Genetics',
    icon: 'Dna',
    color: 'from-emerald-500 to-teal-600',
    description: 'The complex mechanisms of life and inheritance.'
  },
  {
    id: 'chemistry',
    label: 'Chemistry',
    icon: 'FlaskConical',
    color: 'from-rose-500 to-pink-600',
    description: 'The science of matter, its properties, and how it changes.'
  },
  {
    id: 'medicine',
    label: 'Medicine',
    icon: 'Microscope',
    color: 'from-blue-400 to-cyan-600',
    description: 'Advancements in healing and understanding the human body.'
  }
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  Atom: <Atom className="w-6 h-6" />,
  Rocket: <Rocket className="w-6 h-6" />,
  Binary: <Binary className="w-6 h-6" />,
  Dna: <Dna className="w-6 h-6" />,
  FlaskConical: <FlaskConical className="w-6 h-6" />,
  Microscope: <Microscope className="w-6 h-6" />,
};


export interface Milestone {
  year: string;
  title: string;
  description: string;
  impactScore: number; // 1-5
  category: string;
  imagePrompt: string;
  imageUrl?: string;
  isImageLoading?: boolean;
}

export interface Subject {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export enum AppState {
  SELECTING = 'SELECTING',
  LOADING = 'LOADING',
  VIEWING = 'VIEWING',
  ERROR = 'ERROR'
}

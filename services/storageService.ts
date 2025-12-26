
import { Milestone } from "../types";

const STORAGE_PREFIX = "scitime_v1_";

export const storageService = {
  saveTimeline: (subjectId: string, milestones: Milestone[]) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${subjectId}`, JSON.stringify(milestones));
    } catch (e) {
      console.warn("Storage full or unavailable", e);
    }
  },

  loadTimeline: (subjectId: string): Milestone[] | null => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${subjectId}`);
    return data ? JSON.parse(data) : null;
  },

  exportToJSON: (subjectLabel: string, milestones: Milestone[]) => {
    const data = JSON.stringify({ subject: subjectLabel, milestones, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `timeline-${subjectLabel.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  clearTimeline: (subjectId: string) => {
    localStorage.removeItem(`${STORAGE_PREFIX}${subjectId}`);
  }
};

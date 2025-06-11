import { create } from "zustand";

export type SourceType = "document" | "text" | "qna" | "website";

export interface SourceItem {
  type: SourceType;
  title?: string;
  content?: string;
  fileUrl?: string;
  metadata?: Record<string, any>;
  sourcesArray?: any;
}

interface SourceStore {
  sources: SourceItem[];
  setSources: (sources: SourceItem[]) => void;
  addSource: (source: SourceItem) => void;
  clearSources: () => void;
}

export const useSourceStore = create<SourceStore>((set) => ({
  sources: [],
  setSources: (sources) => set({ sources }),
  addSource: (source) =>
    set((state) => {
      const filteredSources = state.sources.filter(
        (s) => s.type !== source.type
      );
      return { sources: [...filteredSources, source] };
    }),
  clearSources: () => set({ sources: [] }),
}));

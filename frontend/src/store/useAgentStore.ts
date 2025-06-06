// src/store/useAgentStore.ts
import { create } from "zustand";

interface Agent {
  _id: string;
  userId: string;
  name: string;
  aimodel: "gpt-4" | "claude-3" | "custom";
  systemPrompt: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface AgentStore {
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent) => void;
  clearSelectedAgent: () => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  selectedAgent: null,
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  clearSelectedAgent: () => set({ selectedAgent: null }),
}));

import { create } from 'zustand';

interface useActiveBrandInterface {
  id?: string;
  set: (id: string) => void;
  reset: () => void;
}

export const useActiveBrand = create<useActiveBrandInterface>((set) => ({
  id: undefined,
  set: (id: string) => set({ id }),
  reset: () => set({ id: undefined }),
}));

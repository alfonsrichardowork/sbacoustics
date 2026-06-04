import { create } from 'zustand';

interface useBrandModalBrand {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useBrandModal = create<useBrandModalBrand>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

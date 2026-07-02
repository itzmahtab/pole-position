'use client';

import { create } from 'zustand';
import type { ModalState, Toast } from '@/types/ui';

interface UIState {
  modal: ModalState;
  toasts: Toast[];
  searchOpen: boolean;
  settingsOpen: boolean;

  openModal: (type: ModalState['type'], data?: Record<string, unknown>) => void;
  closeModal: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  modal: { isOpen: false, type: null },
  toasts: [],
  searchOpen: false,
  settingsOpen: false,

  openModal: (type, data) => set({ modal: { isOpen: true, type, data } }),
  closeModal: () => set({ modal: { isOpen: false, type: null } }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Math.random().toString(36).substring(7) },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

import { create } from 'zustand';
export interface Toast { id: number; message: string }
interface ToastState { toasts: Toast[]; show: (message: string) => number; dismiss: (id: number) => void }
export const useToast = create<ToastState>((set) => ({ toasts: [], show: (message) => { const id = Date.now(); set((state) => ({ toasts: [...state.toasts, { id, message }] })); return id; }, dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })) }));

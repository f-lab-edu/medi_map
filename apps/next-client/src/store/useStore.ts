import { create } from 'zustand';

interface StoreState {
  message: string;
  setMessage: (msg: string) => void;
}

const useStore = create<StoreState>((set) => ({
  message: 'TEST',  
  setMessage: (newMessage: string) => set({ message: newMessage }),
}));

export default useStore;
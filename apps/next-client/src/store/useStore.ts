import { create } from 'zustand';

const useStore = create((set) => ({
  message: '하하하하하하',
  setMessage: (newMessage: string) => set({ message: newMessage }),
}));

export default useStore;
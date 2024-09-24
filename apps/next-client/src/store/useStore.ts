import { create } from 'zustand';

<<<<<<< HEAD
interface PokemonState {
  pokemon: string[];
  fetchPokemon: () => Promise<void>;
}

interface PokemonResult {
  name: string;
  url: string;
}

const useStore = create<PokemonState>((set) => ({
  pokemon: [],
  fetchPokemon: async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
    const data = await response.json();
    set({ pokemon: data.results.map((pokemon: PokemonResult) => pokemon.name) });
  },
=======
interface StoreState {
  message: string;
  setMessage: (msg: string) => void;
}

const useStore = create<StoreState>((set) => ({
  message: 'TEST',  
  setMessage: (newMessage: string) => set({ message: newMessage }),
>>>>>>> 23c8e14 (reractor: 타입스크립트 인터페이스 타입 추가)
}));

export default useStore;
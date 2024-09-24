import { create } from 'zustand';

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
}));

export default useStore;

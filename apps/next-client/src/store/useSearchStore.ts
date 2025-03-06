import { create } from 'zustand';

interface SearchFilters {
  medicineSearchTerm: string;
  companySearchTerm: string;
  selectedColors: string[];
  selectedShapes: string[];
  selectedForms: string[];
}

interface SearchState {
  currentFilters: SearchFilters;
  appliedFilters: SearchFilters;
  isSearchExecuted: boolean;
  totalResults: number;
  warning: string | null;

  setCurrentFilters: (filters: Partial<SearchFilters>) => void;
  applyFilters: () => void;
  setIsSearchExecuted: (value: boolean) => void;
  setTotalResults: (count: number) => void;
  setWarning: (warning: string | null) => void;
  resetAll: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  currentFilters: {
    medicineSearchTerm: '',
    companySearchTerm: '',
    selectedColors: [],
    selectedShapes: [],
    selectedForms: [],
  },
  appliedFilters: {
    medicineSearchTerm: '',
    companySearchTerm: '',
    selectedColors: [],
    selectedShapes: [],
    selectedForms: [],
  },

  isSearchExecuted: false,
  totalResults: 0,
  warning: null,

  setCurrentFilters: (updates) => {
    set((state) => ({
      currentFilters: {
        ...state.currentFilters,
        ...updates,
      },
    }));
  },

  applyFilters: () => {
    set((state) => ({
      appliedFilters: { ...state.currentFilters },
    }));
  },

  setIsSearchExecuted: (value) => set({ isSearchExecuted: value }),
  setTotalResults: (count) => set({ totalResults: count }),
  setWarning: (warning) => set({ warning }),
  resetAll: () =>
    set({
      currentFilters: {
        medicineSearchTerm: '',
        companySearchTerm: '',
        selectedColors: [],
        selectedShapes: [],
        selectedForms: [],
      },
      appliedFilters: {
        medicineSearchTerm: '',
        companySearchTerm: '',
        selectedColors: [],
        selectedShapes: [],
        selectedForms: [],
      },
      isSearchExecuted: false,
      totalResults: 0,
      warning: null,
    }),
}));
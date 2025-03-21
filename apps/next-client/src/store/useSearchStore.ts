import { create } from 'zustand';

interface SearchFilters {
  medicineSearchTerm: string;
  companySearchTerm: string;
  selectedColors: string[];
  selectedShapes: string[];
  selectedForms: string[];
}

interface SearchState {
  appliedFilters: SearchFilters;
  isSearchExecuted: boolean;
  totalResults: number;
  warning: string | null;

  setAppliedFilters: (filters: SearchFilters) => void;
  setIsSearchExecuted: (value: boolean) => void;
  setTotalResults: (count: number) => void;
  setWarning: (warning: string | null) => void;
  resetAll: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
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

  setAppliedFilters: (filters) => set({ appliedFilters: filters }),
  setIsSearchExecuted: (value) => set({ isSearchExecuted: value }),
  setTotalResults: (count) => set({ totalResults: count }),
  setWarning: (warning) => set({ warning }),

  resetAll: () =>
    set({
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
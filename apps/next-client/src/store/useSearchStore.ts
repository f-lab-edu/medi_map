import { create } from 'zustand';

interface SearchState {
  medicineSearchTerm: string;
  companySearchTerm: string;
  selectedColors: string[];
  selectedShapes: string[];
  selectedForms: string[];
  page: number;
  totalResults: number;
  warning: string | null;
  isSearchExecuted: boolean;

  setMedicineSearchTerm: (term: string) => void;
  setCompanySearchTerm: (term: string) => void;
  setSelectedColors: (colors: string[] | ((prev: string[]) => string[])) => void;
  setSelectedShapes: (shapes: string[] | ((prev: string[]) => string[])) => void;
  setSelectedForms: (forms: string[] | ((prev: string[]) => string[])) => void;
  setPage: (page: number | ((prev: number) => number)) => void;
  setTotalResults: (count: number) => void;
  setWarning: (warning: string | null) => void;
  setIsSearchExecuted: (executed: boolean) => void;

  resetResults: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  medicineSearchTerm: '',
  companySearchTerm: '',
  selectedColors: [],
  selectedShapes: [],
  selectedForms: [],
  page: 1,
  totalResults: 0,
  warning: null,
  isSearchExecuted: false,

  setMedicineSearchTerm: (term) => set({ medicineSearchTerm: term }),
  setCompanySearchTerm: (term) => set({ companySearchTerm: term }),
  setSelectedColors: (colors) => set((state) => ({
    selectedColors: typeof colors === 'function' ? colors(state.selectedColors) : colors
  })),
  setSelectedShapes: (shapes) => set((state) => ({
    selectedShapes: typeof shapes === 'function' ? shapes(state.selectedShapes) : shapes
  })),
  setSelectedForms: (forms) => set((state) => ({
    selectedForms: typeof forms === 'function' ? forms(state.selectedForms) : forms
  })),
  setPage: (page) => set((state) => ({
    page: typeof page === 'function' ? page(state.page) : page
  })),
  setTotalResults: (count) => set({ totalResults: count }),
  setWarning: (warning) => set({ warning }),
  setIsSearchExecuted: (executed) => set({ isSearchExecuted: executed }),

  resetResults: () => set({
    page: 1,
    warning: null,
    isSearchExecuted: false,
  }),
}));
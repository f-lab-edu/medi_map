import { create } from 'zustand';
import { MedicineResultDto } from '@/dto/MedicineResultDto';

interface SearchState {
  medicineSearchTerm: string;
  companySearchTerm: string;
  selectedColors: string[];
  selectedShapes: string[];
  selectedForms: string[];
  page: number;
  results: MedicineResultDto[];
  totalResults: number;
  loading: boolean;
  error: string | null;
  warning: string | null;
  isSearchExecuted: boolean;
  hasMore: boolean;

  setMedicineSearchTerm: (term: string) => void;
  setCompanySearchTerm: (term: string) => void;
  setSelectedColors: (colors: string[] | ((prev: string[]) => string[])) => void;
  setSelectedShapes: (shapes: string[] | ((prev: string[]) => string[])) => void;
  setSelectedForms: (forms: string[] | ((prev: string[]) => string[])) => void;
  setPage: (page: number | ((prev: number) => number)) => void;
  setResults: (results: MedicineResultDto[]) => void;
  setTotalResults: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setWarning: (warning: string | null) => void;
  setIsSearchExecuted: (executed: boolean) => void;
  setHasMore: (hasMore: boolean) => void;

  resetResults: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  medicineSearchTerm: '',
  companySearchTerm: '',
  selectedColors: [],
  selectedShapes: [],
  selectedForms: [],
  page: 1,
  results: [],
  totalResults: 0,
  loading: false,
  error: null,
  warning: null,
  isSearchExecuted: false,
  hasMore: false,

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
  setResults: (results) => set({ results }),
  setTotalResults: (count) => set({ totalResults: count }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setWarning: (warning) => set({ warning }),
  setIsSearchExecuted: (executed) => set({ isSearchExecuted: executed }),
  setHasMore: (hasMore) => set({ hasMore }),

  resetResults: () => set({
    results: [],
    totalResults: 0,
    hasMore: true,
    error: null
  }),
}));
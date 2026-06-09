import { create } from "zustand";

type SortField = "name" | "price" | "stock" | "createdAt";
type SortOrder = "asc" | "desc";

interface UIState {
  searchQuery: string;
  selectedCategoryId: string | null;
  sortBy: SortField;
  sortOrder: SortOrder;
  sidebarOpen: boolean;
  setSearchQuery: (q: string) => void;
  selectCategory: (id: string | null) => void;
  setSortBy: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSidebar: () => void;
  resetFilters: () => void;
}

export const initialUIState = {
  searchQuery: "",
  selectedCategoryId: null,
  sortBy: "createdAt" as SortField,
  sortOrder: "desc" as SortOrder,
  sidebarOpen: true
};

export const useUIStore = create<UIState>((set) => ({
  ...initialUIState,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  selectCategory: (selectedCategoryId) => set({ selectedCategoryId }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  resetFilters: () =>
    set({
      searchQuery: initialUIState.searchQuery,
      selectedCategoryId: initialUIState.selectedCategoryId,
      sortBy: initialUIState.sortBy,
      sortOrder: initialUIState.sortOrder
    })
}));

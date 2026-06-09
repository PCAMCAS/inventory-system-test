import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { initialUIState, useUIStore } from "@/stores/ui-store";

describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState(initialUIState);
  });

  it("el estado inicial tiene searchQuery vacío y ninguna categoría seleccionada", () => {
    const { result } = renderHook(() => useUIStore());

    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedCategoryId).toBeNull();
  });

  it("resetFilters devuelve todos los filtros a sus valores iniciales", () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.selectCategory("cat-maderas");
      result.current.setSearchQuery("roble");
      result.current.setSortBy("name");
      result.current.setSortOrder("asc");
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedCategoryId).toBeNull();
    expect(result.current.sortBy).toBe("createdAt");
    expect(result.current.sortOrder).toBe("desc");
  });

  it("toggleSidebar invierte el estado del sidebar", () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(false);
  });
});

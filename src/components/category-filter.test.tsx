import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CategoryFilter } from "@/components/CategoryFilter";

const categories = [
  { id: "cat-maderas", name: "Maderas y tableros" },
  { id: "cat-herrajes", name: "Herrajes" },
  { id: "cat-acabados", name: "Acabados" },
];

describe("CategoryFilter", () => {
  it("muestra todas las categorías disponibles", () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategoryId={null}
        onSelectCategory={() => {}}
      />
    );

    expect(screen.getByRole("option", { name: "Todas las categorías" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Maderas y tableros" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Herrajes" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Acabados" })).toBeInTheDocument();
  });

  it("marca como seleccionada la categoría recibida por props", () => {
    render(
      <CategoryFilter
        categories={categories}
        selectedCategoryId="cat-herrajes"
        onSelectCategory={() => {}}
      />
    );

    expect(screen.getByLabelText("Filtrar por categoría")).toHaveValue("cat-herrajes");
  });

  it("llama a onSelectCategory al seleccionar una categoría", async () => {
    const user = userEvent.setup();
    const onSelectCategory = vi.fn();

    render(
      <CategoryFilter
        categories={categories}
        selectedCategoryId={null}
        onSelectCategory={onSelectCategory}
      />
    );

    await user.selectOptions(screen.getByLabelText("Filtrar por categoría"), "cat-maderas");

    expect(onSelectCategory).toHaveBeenCalledWith("cat-maderas");
  });

  it("llama a onSelectCategory con null al seleccionar todas las categorías", async () => {
    const user = userEvent.setup();
    const onSelectCategory = vi.fn();

    render(
      <CategoryFilter
        categories={categories}
        selectedCategoryId="cat-herrajes"
        onSelectCategory={onSelectCategory}
      />
    );

    await user.selectOptions(screen.getByLabelText("Filtrar por categoría"), "");

    expect(onSelectCategory).toHaveBeenCalledWith(null);
  });
});

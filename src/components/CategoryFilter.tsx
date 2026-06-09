"use client";

type Category = {
  id: string;
  name: string;
};

type CategoryFilterProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
};

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div>
      <label htmlFor="category-filter">Filtrar por categoría</label>

      <select
        id="category-filter"
        value={selectedCategoryId ?? ""}
        onChange={(event) => {
          onSelectCategory(event.target.value || null);
        }}
      >
        <option value="">Todas las categorías</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

import type { Product, SortField, SortOrder } from "@/types/product";

export function filterProducts(products: Product[], searchQuery: string): Product[] {
  const query = searchQuery.trim().toLowerCase();

  if (!query) {
    return products;
  }

  return products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );
}

export function sortProducts(
  products: Product[],
  sortBy: SortField,
  sortOrder: SortOrder
): Product[] {
  const direction = sortOrder === "asc" ? 1 : -1;

  return [...products].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (sortBy === "price") {
      return (Number(aValue) - Number(bValue)) * direction;
    }

    if (sortBy === "stock") {
      return (Number(aValue) - Number(bValue)) * direction;
    }

    return String(aValue).localeCompare(String(bValue)) * direction;
  });
}

export function isLowStock(product: Product, threshold: number): boolean {
  return product.stock <= threshold;
}

export function formatPrice(price: number | string): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
  }).format(Number(price));
}

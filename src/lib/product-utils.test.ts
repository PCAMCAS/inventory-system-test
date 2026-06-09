import { describe, expect, it } from "vitest";
import { filterProducts, formatPrice, isLowStock, sortProducts } from "@/lib/product-utils";
import type { Product } from "@/types/product";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Tablero roble macizo 40 mm",
    price: 89.5,
    stock: 4,
    categoryId: "cat-maderas",
    createdAt: "2024-01-01"
  },
  {
    id: "2",
    name: "Bisagra cazoleta 35 mm",
    price: 2.4,
    stock: 0,
    categoryId: "cat-herrajes",
    createdAt: "2024-01-02"
  },
  {
    id: "3",
    name: "Barniz mate incoloro 1 L",
    price: 18.75,
    stock: 22,
    categoryId: "cat-acabados",
    createdAt: "2024-01-03"
  }
];

describe("filterProducts", () => {
  it("devuelve todos los productos con searchQuery vacío", () => {
    expect(filterProducts(mockProducts, "")).toHaveLength(3);
  });

  it("filtra por nombre de forma insensible a mayúsculas", () => {
    const result = filterProducts(mockProducts, "bisagra");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Bisagra cazoleta 35 mm");
  });

  it("devuelve array vacío cuando no hay coincidencias", () => {
    expect(filterProducts(mockProducts, "taladro")).toHaveLength(0);
  });

  it("devuelve array vacío con array de entrada vacío", () => {
    expect(filterProducts([], "roble")).toHaveLength(0);
  });

  it("no filtra por nombre de categoría si la utilidad solo busca en el nombre del producto", () => {
    expect(filterProducts(mockProducts, "Herrajes")).toHaveLength(0);
  });
});

describe("sortProducts", () => {
  it("ordena por precio ascendente", () => {
    const result = sortProducts(mockProducts, "price", "asc");

    expect(result.map((product) => product.name)).toEqual([
      "Bisagra cazoleta 35 mm",
      "Barniz mate incoloro 1 L",
      "Tablero roble macizo 40 mm"
    ]);
  });

  it("ordena por precio descendente", () => {
    const result = sortProducts(mockProducts, "price", "desc");

    expect(result[0].name).toBe("Tablero roble macizo 40 mm");
    expect(result[2].name).toBe("Bisagra cazoleta 35 mm");
  });

  it("ordena por stock descendente", () => {
    const result = sortProducts(mockProducts, "stock", "desc");

    expect(result.map((product) => product.stock)).toEqual([22, 4, 0]);
  });

  it("ordena por nombre ascendente", () => {
    const result = sortProducts(mockProducts, "name", "asc");

    expect(result[0].name).toBe("Barniz mate incoloro 1 L");
  });
});

describe("isLowStock", () => {
  it("devuelve true cuando el stock está por debajo del umbral", () => {
    expect(isLowStock(mockProducts[0], 10)).toBe(true);
  });

  it("devuelve true cuando el stock es exactamente cero", () => {
    expect(isLowStock(mockProducts[1], 5)).toBe(true);
  });

  it("devuelve false cuando el stock supera el umbral", () => {
    expect(isLowStock(mockProducts[2], 10)).toBe(false);
  });

  it("con umbral 0 solo marca productos agotados", () => {
    expect(isLowStock(mockProducts[1], 0)).toBe(true);
    expect(isLowStock(mockProducts[0], 0)).toBe(false);
  });
});

describe("formatPrice", () => {
  it("formatea el precio con símbolo de euro y dos decimales", () => {
    expect(formatPrice(89.5)).toBe("89,50 €");
  });

  it("maneja correctamente los precios con cero céntimos", () => {
    expect(formatPrice(20)).toBe("20,00 €");
  });
});

"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/product-utils";
import type { Product } from "@/types/product";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  async function loadProducts() {
    setStatus("loading");

    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Error al cargar productos");
      }

      const data = (await response.json()) as Product[];
      setProducts(data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  if (status === "loading") {
    return <div role="progressbar">Cargando productos...</div>;
  }

  if (status === "error") {
    return (
      <div>
        <p>Error al cargar productos.</p>
        <button onClick={loadProducts}>Reintentar</button>
      </div>
    );
  }

  return (
    <section>
      {products.map((product) => (
        <article key={product.id} data-testid="product-card">
          <h3>{product.name}</h3>
          <p>{formatPrice(product.price)}</p>
          <p>Stock: {product.stock}</p>
          <p data-testid="product-category">{product.category?.name ?? product.categoryId}</p>
        </article>
      ))}
    </section>
  );
}

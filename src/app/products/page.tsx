"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: string | number;
  stock: number;
  categoryId: string;
  category: { id: string; name: string };
};

type Category = {
  id: string;
  name: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("1");
  const [stock, setStock] = useState("0");

  async function loadData() {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);

    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`/api/products?${params.toString()}`),
      fetch("/api/categories"),
    ]);

    setProducts(await productsRes.json());
    setCategories(await categoriesRes.json());
  }

  useEffect(() => {
    loadData();
  }, [search, categoryId]);

  async function createProduct() {
    const selectedCategory = categoryId || categories[0]?.id;
    if (!selectedCategory || !name) return;

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Number(price),
        stock: Number(stock),
        categoryId: selectedCategory,
      }),
    });

    setName("");
    setPrice("1");
    setStock("0");
    loadData();
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadData();
  }

  async function updateStock(product: Product, nextStock: number) {
    const previous = products;

    setProducts((current) =>
      current.map((item) =>
        item.id === product.id ? { ...item, stock: nextStock } : item
      )
    );

    const res = await fetch(`/api/products/${product.id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: nextStock }),
    });

    if (!res.ok) {
      setProducts(previous);
      alert("Error al actualizar stock. Se restaura el valor anterior.");
    } else {
      loadData();
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Productos</h2>
        <p className="text-gray-500">Inventario básico.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        <input className="rounded border p-2" placeholder="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />

        <select className="rounded border p-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <button className="rounded bg-black px-4 py-2 text-white" onClick={() => { setSearch(""); setCategoryId(""); }}>
          Limpiar filtros
        </button>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <input className="rounded border p-2" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded border p-2" placeholder="Precio" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="rounded border p-2" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
        <button className="rounded bg-black px-4 py-2 text-white" onClick={createProduct}>
          Crear producto
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <article key={product.id} className="rounded border p-4">
            <h3 className="font-bold">{product.name}</h3>
            <p>Precio: {Number(product.price).toFixed(2)} €</p>
            <p>Stock: {product.stock}</p>
            <p>Categoría: {product.category.name}</p>

            <div className="mt-3 flex gap-2">
              <button className="rounded border px-3 py-1" onClick={() => updateStock(product, Math.max(0, product.stock - 1))}>-</button>
              <button className="rounded border px-3 py-1" onClick={() => updateStock(product, product.stock + 1)}>+</button>
              <button className="rounded border px-3 py-1" onClick={() => deleteProduct(product.id)}>Borrar</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  description?: string | null;
  _count?: { products: number };
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function loadCategories() {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function createCategory() {
    if (!name) return;

    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    setName("");
    setDescription("");
    loadCategories();
  }

  async function deleteCategory(id: string) {
    const res = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("No se puede borrar una categoría con productos asociados.");
    }

    loadCategories();
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Categorías</h2>
        <p className="text-gray-500">Gestión básica de categorías.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        <input
          className="rounded border p-2"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="rounded border p-2"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          className="rounded bg-black px-4 py-2 text-white"
          onClick={createCategory}
        >
          Crear categoría
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <article key={category.id} className="rounded border p-4">
            <h3 className="font-bold">{category.name}</h3>
            <p>{category.description}</p>
            <p>Productos: {category._count?.products ?? 0}</p>

            <button
              className="mt-3 rounded border px-3 py-1"
              onClick={() => deleteCategory(category.id)}
            >
              Borrar
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

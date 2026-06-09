import { beforeEach, describe, expect, it, vi } from "vitest";

const products = [
  {
    id: "1",
    name: "Test-Tablero roble",
    description: null,
    price: 89.5,
    stock: 12,
    categoryId: "cat-maderas",
    category: { id: "cat-maderas", name: "Maderas y tableros" }
  }
];

const categories = [
  {
    id: "cat-maderas",
    name: "Test-Maderas",
    description: "Categoría de test"
  }
];

vi.mock("@/lib/db", () => {
  return {
    db: {
      product: {
        findMany: vi.fn(async () => products),
        create: vi.fn(async ({ data }) => ({
          id: "created-id",
          ...data,
          category: { id: data.categoryId, name: "Test-Maderas" }
        })),
        deleteMany: vi.fn(async () => ({ count: 1 })),
        update: vi.fn(async ({ where, data }) => {
          if (where.id === "no-existe") {
            throw new Error("Producto no encontrado");
          }

          return {
            ...products[0],
            ...data
          };
        })
      },
      category: {
        upsert: vi.fn(async () => categories[0])
      }
    }
  };
});

import { testApiHandler } from "next-test-api-route-handler";
import * as productsHandler from "@/app/api/products/route";
import * as stockHandler from "@/app/api/products/[id]/stock/route";
import { db } from "@/lib/db";

beforeEach(async () => {
  await db.product.deleteMany({
    where: { name: { startsWith: "Test-" } }
  });
});

describe("GET /api/products", () => {
  it("devuelve 200 con un array", async () => {
    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({ method: "GET" });

        expect(res.status).toBe(200);

        const body = await res.json();
        expect(Array.isArray(body)).toBe(true);
      }
    });
  });

  it("cada producto tiene campos principales", async () => {
    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({ method: "GET" });
        const body = await res.json();

        expect(body[0]).toHaveProperty("id");
        expect(body[0]).toHaveProperty("name");
        expect(body[0]).toHaveProperty("price");
        expect(body[0]).toHaveProperty("stock");
        expect(body[0]).toHaveProperty("category");
      }
    });
  });
});

describe("POST /api/products", () => {
  it("crea un producto y devuelve 201", async () => {
    const category = await db.category.upsert({
      where: { name: "Test-Maderas" },
      update: {},
      create: { name: "Test-Maderas" }
    });

    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test-Listón pino 50x50",
            price: 4.2,
            stock: 20,
            categoryId: category.id
          })
        });

        expect(res.status).toBe(201);

        const body = await res.json();
        expect(body.name).toBe("Test-Listón pino 50x50");
        expect(body.id).toBeDefined();
      }
    });
  });

  it("devuelve 400 si el precio es negativo", async () => {
    const category = await db.category.upsert({
      where: { name: "Test-Maderas" },
      update: {},
      create: { name: "Test-Maderas" }
    });

    await testApiHandler({
      appHandler: productsHandler,
      async test({ fetch }) {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test-X",
            price: -10,
            categoryId: category.id
          })
        });

        expect(res.status).toBe(400);
      }
    });
  });
});

describe("PATCH /api/products/[id]/stock", () => {
  it("stock válido devuelve 200", async () => {
    const response = await stockHandler.PATCH(
      new Request("http://localhost/api/products/1/stock", {
        method: "PATCH",
        body: JSON.stringify({ stock: 8 })
      }),
      { params: Promise.resolve({ id: "1" }) }
    );

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.stock).toBe(8);
  });

  it("stock negativo devuelve 400", async () => {
    const response = await stockHandler.PATCH(
      new Request("http://localhost/api/products/no-existe/stock", {
        method: "PATCH",
        body: JSON.stringify({ stock: -1 })
      }),
      { params: Promise.resolve({ id: "no-existe" }) }
    );

    expect(response.status).toBe(400);
  });

  it("id inexistente devuelve 404", async () => {
    const response = await stockHandler.PATCH(
      new Request("http://localhost/api/products/no-existe/stock", {
        method: "PATCH",
        body: JSON.stringify({ stock: 5 })
      }),
      { params: Promise.resolve({ id: "no-existe" }) }
    );

    expect(response.status).toBe(404);
  });
});

import { beforeEach, describe, expect, it } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import * as productsHandler from "@/app/api/products/route";
import * as stockHandler from "@/app/api/products/[id]/stock/route";
import { db } from "@/lib/db";

async function getOrCreateTestCategory() {
  return db.category.upsert({
    where: { name: "Test-Maderas" },
    update: {},
    create: {
      name: "Test-Maderas",
      description: "Categoría para tests de integración"
    }
  });
}

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

        if (body.length > 0) {
          expect(body[0]).toHaveProperty("id");
          expect(body[0]).toHaveProperty("name");
          expect(body[0]).toHaveProperty("price");
          expect(body[0]).toHaveProperty("stock");
          expect(body[0]).toHaveProperty("category");
        }
      }
    });
  });
});

describe("POST /api/products", () => {
  it("crea un producto y devuelve 201", async () => {
    const category = await getOrCreateTestCategory();

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
    const category = await getOrCreateTestCategory();

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
    const category = await getOrCreateTestCategory();

    const product = await db.product.create({
      data: {
        name: "Test-Tablero stock",
        price: 10,
        stock: 3,
        categoryId: category.id
      }
    });

    const response = await stockHandler.PATCH(
      new Request("http://localhost/api/products/" + product.id + "/stock", {
        method: "PATCH",
        body: JSON.stringify({ stock: 8 })
      }),
      { params: Promise.resolve({ id: product.id }) }
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

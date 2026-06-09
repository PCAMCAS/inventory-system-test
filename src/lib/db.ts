import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const now = new Date().toISOString();

type MockCategory = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count?: {
    products: number;
  };
};

type MockProduct = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
};

const mockCategories: MockCategory[] = [
  {
    id: "cat-electronica",
    name: "Electrónica",
    description: "Productos tecnológicos",
    createdAt: now,
    _count: { products: 2 },
  },
  {
    id: "cat-oficina",
    name: "Oficina",
    description: "Material de oficina",
    createdAt: now,
    _count: { products: 1 },
  },
];

const mockProducts: MockProduct[] = [
  {
    id: "prod-teclado",
    name: "Teclado mecánico",
    description: null,
    price: "49.99",
    stock: 12,
    categoryId: "cat-electronica",
    createdAt: now,
    updatedAt: now,
    category: { id: "cat-electronica", name: "Electrónica" },
  },
  {
    id: "prod-raton",
    name: "Ratón inalámbrico",
    description: null,
    price: "24.99",
    stock: 20,
    categoryId: "cat-electronica",
    createdAt: now,
    updatedAt: now,
    category: { id: "cat-electronica", name: "Electrónica" },
  },
  {
    id: "prod-cuaderno",
    name: "Cuaderno A4",
    description: null,
    price: "3.50",
    stock: 80,
    categoryId: "cat-oficina",
    createdAt: now,
    updatedAt: now,
    category: { id: "cat-oficina", name: "Oficina" },
  },
];

function sortMockProducts(products: MockProduct[], orderBy: any) {
  const key = Object.keys(orderBy ?? { createdAt: "desc" })[0] ?? "createdAt";
  const direction = orderBy?.[key] === "asc" ? 1 : -1;

  return [...products].sort((a: any, b: any) => {
    if (key === "price" || key === "stock") {
      return (Number(a[key]) - Number(b[key])) * direction;
    }

    return String(a[key]).localeCompare(String(b[key])) * direction;
  });
}

function createMockDb() {
  return {
    product: {
      findMany: async (args: any = {}) => {
        let products = [...mockProducts];

        const search = args.where?.name?.contains;
        const categoryId = args.where?.categoryId;

        if (search) {
          products = products.filter((product) =>
            product.name.toLowerCase().includes(String(search).toLowerCase())
          );
        }

        if (categoryId) {
          products = products.filter((product) => product.categoryId === categoryId);
        }

        return sortMockProducts(products, args.orderBy);
      },

      create: async (args: any) => {
        const category =
          mockCategories.find((item) => item.id === args.data.categoryId) ??
          mockCategories[0];

        const product: MockProduct = {
          id: `prod-created-${Date.now()}`,
          name: args.data.name,
          description: args.data.description ?? null,
          price: String(args.data.price),
          stock: Number(args.data.stock ?? 0),
          categoryId: args.data.categoryId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          category: {
            id: category.id,
            name: category.name,
          },
        };

        mockProducts.unshift(product);
        return product;
      },

      update: async (args: any) => {
        const product = mockProducts.find((item) => item.id === args.where.id);

        if (!product) {
          throw new Error("Producto no encontrado");
        }

        Object.assign(product, args.data, {
          updatedAt: new Date().toISOString(),
        });

        return product;
      },

      deleteMany: async () => ({ count: 0 }),
      delete: async () => mockProducts[0],
    },

    category: {
      findMany: async () => mockCategories,
      create: async (args: any) => {
        const category: MockCategory = {
          id: `cat-created-${Date.now()}`,
          name: args.data.name,
          description: args.data.description ?? null,
          createdAt: new Date().toISOString(),
          _count: { products: 0 },
        };

        mockCategories.push(category);
        return category;
      },
      upsert: async (args: any) => {
        const existing = mockCategories.find(
          (category) => category.name === args.where.name
        );

        if (existing) {
          return existing;
        }

        const category: MockCategory = {
          id: `cat-created-${Date.now()}`,
          name: args.create.name,
          description: args.create.description ?? null,
          createdAt: new Date().toISOString(),
          _count: { products: 0 },
        };

        mockCategories.push(category);
        return category;
      },
      deleteMany: async () => ({ count: 0 }),
      delete: async () => mockCategories[0],
    },

    $disconnect: async () => undefined,
  };
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
  mockDb: ReturnType<typeof createMockDb> | undefined;
};

function createPrismaClient() {
  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString: process.env.DATABASE_URL,
    });

  const adapter = new PrismaPg(pool);

  const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
    globalForPrisma.pool = pool;
  }

  return prisma;
}

export const db =
  process.env.E2E_MOCKS === "1"
    ? ((globalForPrisma.mockDb ??= createMockDb()) as any)
    : createPrismaClient();

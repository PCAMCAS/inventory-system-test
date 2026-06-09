import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const electronica = await prisma.category.create({
    data: { name: "Electrónica", description: "Productos tecnológicos" },
  });

  const oficina = await prisma.category.create({
    data: { name: "Oficina", description: "Material de oficina" },
  });

  const almacen = await prisma.category.create({
    data: { name: "Almacén", description: "Material de almacén" },
  });

  await prisma.product.createMany({
    data: [
      { name: "Teclado mecánico", price: 49.99, stock: 12, categoryId: electronica.id },
      { name: "Ratón inalámbrico", price: 24.99, stock: 20, categoryId: electronica.id },
      { name: "Monitor 24 pulgadas", price: 139.99, stock: 6, categoryId: electronica.id },
      { name: "Cuaderno A4", price: 3.5, stock: 80, categoryId: oficina.id },
      { name: "Bolígrafos azules", price: 5.25, stock: 40, categoryId: oficina.id },
      { name: "Carpetas", price: 7.99, stock: 30, categoryId: oficina.id },
      { name: "Caja organizadora", price: 12.99, stock: 15, categoryId: almacen.id },
      { name: "Etiquetas adhesivas", price: 8.75, stock: 25, categoryId: almacen.id }
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

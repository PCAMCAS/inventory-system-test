import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || undefined;
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  const products = await db.product.findMany({
    where: {
      name: search ? { contains: search, mode: "insensitive" } : undefined,
      categoryId,
    },
    include: {
      category: { select: { id: true, name: true } },
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.categoryId || Number(body.price) <= 0) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  try {
    const product = await db.product.create({
      data: {
        name: body.name,
        description: body.description || null,
        price: Number(body.price),
        stock: Number(body.stock || 0),
        categoryId: body.categoryId,
      },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo crear el producto" }, { status: 500 });
  }
}

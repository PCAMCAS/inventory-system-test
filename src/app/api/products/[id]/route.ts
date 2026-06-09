import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json();

  try {
    const product = await db.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description || null,
        price: Number(body.price),
        stock: Number(body.stock),
        categoryId: body.categoryId,
      },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;

  try {
    await db.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}

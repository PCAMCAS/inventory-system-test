import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  const stock = Number(body.stock);

  if (!Number.isInteger(stock) || stock < 0) {
    return NextResponse.json({ error: "Stock inválido" }, { status: 400 });
  }

  try {
    const product = await db.product.update({
      where: { id },
      data: { stock },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}

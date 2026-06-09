import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json();

  try {
    const category = await db.category.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description || null,
      },
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;

  const product = await db.product.findFirst({
    where: { categoryId: id },
  });

  if (product) {
    return NextResponse.json(
      { error: "No se puede borrar una categoría con productos asociados" },
      { status: 409 }
    );
  }

  try {
    await db.category.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  }
}

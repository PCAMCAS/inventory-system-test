# API del sistema de inventario

## Categorías

GET /api/categories
Lista todas las categorías.

POST /api/categories
Crea una categoría.
Cuerpo esperado:
name: string
description: string opcional

PATCH /api/categories/[id]
Edita una categoría.
Cuerpo esperado:
name: string
description: string opcional

DELETE /api/categories/[id]
Borra una categoría si no tiene productos asociados.
Errores:
404 si no existe.
409 si tiene productos asociados.

## Productos

GET /api/products
Lista productos. Admite filtros:
search
categoryId
sortBy
sortOrder

POST /api/products
Crea un producto.
Cuerpo esperado:
name: string
description: string opcional
price: number
stock: number
categoryId: string

PATCH /api/products/[id]
Edita un producto.

DELETE /api/products/[id]
Borra un producto.

PATCH /api/products/[id]/stock
Actualiza solo el stock.
Cuerpo esperado:
stock: number

## Separación del endpoint de stock

El endpoint /api/products/[id]/stock se separa del endpoint general de edición porque tiene una única responsabilidad: modificar el stock. Esto simplifica la validación y permite hacer actualización optimista desde la interfaz.

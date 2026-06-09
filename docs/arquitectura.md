# Arquitectura del sistema

## Capas

Navegador:
- React
- Estado de UI
- Estado del servidor

Servidor:
- Next.js App Router
- Route Handlers en /api

Base de datos:
- Neon PostgreSQL
- Prisma ORM

## Por qué no usamos Express

No se usa Express porque Next.js App Router permite crear endpoints HTTP directamente dentro de src/app/api mediante Route Handlers. Cada archivo route.ts puede exportar métodos como GET, POST, PATCH o DELETE. Así frontend y backend viven en el mismo proyecto.

## Modelo de datos

El sistema tiene dos modelos principales:

- Category: representa una categoría de productos.
- Product: representa un producto con precio, stock y relación con una categoría.

Una categoría puede tener muchos productos. Un producto pertenece a una única categoría.

## Por qué price usa Decimal

El campo price usa Decimal en lugar de Float porque los precios necesitan precisión exacta. Un Float puede producir errores de redondeo en operaciones con decimales. En un inventario esto puede afectar al valor del stock o a cálculos económicos.

## DATABASE_URL y DIRECT_URL

- DATABASE_URL: conexión pooled usada por la aplicación.
- DIRECT_URL: conexión directa usada para sincronizar el schema y trabajar con Prisma CLI.

![Next](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=FFF)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

# 📝 Inventory System

> Sistema básico de inventario con productos, categorías, filtros, API propia y base de datos PostgreSQL.

Aplicación desarrollada con Next.js App Router, Prisma, Neon PostgreSQL y Vercel. Permite gestionar productos y categorías desde una interfaz web sencilla, conectada a una API REST creada dentro del propio proyecto mediante Route Handlers.

Next.js permite crear endpoints HTTP dentro del directorio `app` mediante Route Handlers, usando archivos `route.ts`. Prisma Client se genera a partir del schema del proyecto, y Vercel permite configurar variables de entorno desde el panel del proyecto.

| Despliegue | URL |
|------------|-----|
| Producción | [Vercel](https://inventory-system-r1nx1stgk-pcamcas-projects.vercel.app/products) |
| Productos | [Productos](https://inventory-system-r1nx1stgk-pcamcas-projects.vercel.app/products) |
| Categorías | [Categorías](https://inventory-system-r1nx1stgk-pcamcas-projects.vercel.app/categories) |
| API productos | [API Products](https://inventory-system-r1nx1stgk-pcamcas-projects.vercel.app/api/products) |
| API categorías | [API Categories](https://inventory-system-r1nx1stgk-pcamcas-projects.vercel.app/api/categories) |

---

## Características

- Listado de productos desde base de datos.
- Listado de categorías desde base de datos.
- Creación de productos.
- Creación de categorías.
- Borrado de productos.
- Borrado de categorías con control para evitar borrar categorías con productos asociados.
- Filtro de productos por texto de búsqueda.
- Filtro de productos por categoría.
- Actualización de stock con botones de incremento y decremento.
- API REST propia con Route Handlers de Next.js.
- Conexión a Neon PostgreSQL mediante Prisma.
- Despliegue en Vercel.

---

## Tecnologías

| Frontend | Uso |
|----------|-----|
| Next.js | Framework principal de la aplicación |
| React | Construcción de la interfaz |
| TypeScript | Tipado del proyecto |
| Tailwind CSS | Estilos rápidos y responsive |

| Backend | Uso |
|---------|-----|
| Next.js Route Handlers | Endpoints REST dentro de `src/app/api` |
| Prisma ORM | Acceso a base de datos |
| PostgreSQL | Base de datos relacional |
| Neon | Hosting serverless de PostgreSQL |
| @prisma/adapter-pg | Adaptador PostgreSQL usado por Prisma |

| Auxiliares | Uso |
|------------|-----|
| Vercel | Despliegue de producción |
| GitHub | Repositorio y control de versiones |
| Zod | Validación de datos en endpoints |
| TSX | Ejecución del seed en TypeScript |
| Shadcn UI | Componentes base instalados para la interfaz |

---

## Estructura del proyecto

~~~txt
inventory-system/
├── docs/
│   ├── arquitectura.md
│   ├── api.md
│   └── state-management.md
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── categories/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── products/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           ├── route.ts
│   │   │           └── stock/
│   │   │               └── route.ts
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── db.ts
├── .env.example
├── package.json
├── prisma.config.ts
└── README.md
~~~

---

## Descargar y ejecutar

Clonar el repositorio:

~~~bash
git clone https://github.com/PCAMCAS/inventory-system.git
cd inventory-system
npm install
~~~

Crear un archivo `.env` en la raíz del proyecto:

~~~env
DATABASE_URL="postgresql://usuario:password@host-pooler/neondb?sslmode=verify-full"
DIRECT_URL="postgresql://usuario:password@host-directo/neondb?sslmode=verify-full"
~~~

Generar Prisma Client y sincronizar la base de datos:

~~~bash
npx prisma generate
npx prisma db push
npm run seed
~~~

Ejecutar en desarrollo:

~~~bash
npm run dev
~~~

Abrir en el navegador:

~~~txt
http://localhost:3000/products
~~~

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Ejecuta el servidor de desarrollo |
| `npm run build` | Genera la build de producción |
| `npm run start` | Ejecuta la build de producción |
| `npm run seed` | Inserta datos iniciales en la base de datos |
| `npx prisma generate` | Genera Prisma Client |
| `npx prisma db push` | Sincroniza el schema con la base de datos |

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL pooled de Neon usada por la aplicación |
| `DIRECT_URL` | URL directa de Neon usada por Prisma CLI |

---

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Lista productos |
| POST | `/api/products` | Crea un producto |
| PATCH | `/api/products/[id]` | Edita un producto |
| DELETE | `/api/products/[id]` | Borra un producto |
| PATCH | `/api/products/[id]/stock` | Actualiza el stock |
| GET | `/api/categories` | Lista categorías |
| POST | `/api/categories` | Crea una categoría |
| PATCH | `/api/categories/[id]` | Edita una categoría |
| DELETE | `/api/categories/[id]` | Borra una categoría si no tiene productos |

---

## Desplegar en Vercel

### Aplicación

1. Subir el proyecto a GitHub.
2. Crear proyecto en Vercel e importar el repositorio.
3. Añadir variables de entorno:
   - `DATABASE_URL`
   - `DIRECT_URL`
4. Mantener los comandos por defecto:
   - Build Command: `npm run build`
   - Install Command: `npm install`
5. Desplegar.

### Base de datos

1. Crear proyecto en Neon.
2. Copiar la URL pooled para `DATABASE_URL`.
3. Copiar la URL directa para `DIRECT_URL`.
4. Ejecutar en local:

~~~bash
npx prisma db push
npm run seed
~~~

---

## Documentación adicional

La carpeta `docs/` contiene:

- `docs/arquitectura.md`
- `docs/api.md`
- `docs/state-management.md`

---

## Referencias

- Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
- Prisma Client: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/introduction
- Vercel Environment Variables: https://vercel.com/docs/environment-variables

---

*Desarrollado durante las prácticas en [Corner Estudios](https://www.corner-estudios.com) — Pedro Campos — 2026*

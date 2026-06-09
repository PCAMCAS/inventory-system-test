![Next](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=FFF)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=for-the-badge&logo=testing-library&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![MSW](https://img.shields.io/badge/MSW-FF6A33?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

# 🧪 Inventory System Test

> Práctica de testing aplicada sobre el proyecto de inventario desarrollado en la práctica 8.

Este repositorio parte de clonar la práctica anterior, `inventory-system`, en la que se había construido un sistema de inventario con Next.js, Prisma, Neon PostgreSQL y Vercel.  
Sobre esa base se ha desarrollado una suite de tests completa para validar la lógica de negocio, el estado de UI, los componentes, las API Routes y varios flujos reales de usuario.

La práctica se centra en la pirámide de testing:

- Muchos tests unitarios rápidos.
- Tests de integración para comprobar varias piezas trabajando juntas.
- Pocos tests E2E para validar flujos completos en navegador.

---

## Estado final

| Comando | Resultado |
|---------|-----------|
| `npm test -- --run` | 30 tests passed |
| `npm run test:coverage` | 100% cobertura en `product-utils.ts` |
| `npm run e2e` | 3 tests E2E passed |

---

## Qué se ha hecho en esta práctica

- Configuración de Vitest.
- Configuración de Testing Library.
- Configuración de MSW para simular respuestas HTTP.
- Tests unitarios de lógica de inventario.
- Tests del store de Zustand.
- Tests de componente con una lista de productos.
- Tests de integración sobre API Routes.
- Configuración de Playwright.
- Tests E2E sobre flujos reales de usuario.
- Sistema de mocks E2E con `E2E_MOCKS=1` para no depender de Neon durante los tests de navegador.
- Documentación técnica en `docs/testing/`.

---

## Tecnologías usadas

| Tecnología | Uso |
|-----------|-----|
| Next.js | Base de la aplicación heredada de la práctica 8 |
| React | Interfaz de usuario |
| TypeScript | Tipado del proyecto |
| Prisma | Acceso a datos en la app original |
| Vitest | Tests unitarios e integración |
| Testing Library | Tests de componentes React |
| MSW | Mock de peticiones HTTP en tests |
| Playwright | Tests E2E en navegador |
| V8 Coverage | Informe de cobertura |
| Zustand | Store de estado de UI testeado |

Vitest permite configurar tests, entorno `jsdom`, setup files y cobertura desde `vitest.config.ts`. La cobertura se ha configurado con provider `v8`, que está soportado oficialmente por Vitest.  
Playwright se ha configurado con `webServer` para levantar el servidor de desarrollo antes de ejecutar los E2E.  
MSW se ha usado para interceptar peticiones HTTP en tests de Node mediante `setupServer`.

---

## Estructura principal añadida

~~~txt
inventory-system-test/
├── docs/
│   └── testing/
│       ├── estrategia.md
│       ├── integracion.md
│       └── e2e.md
├── e2e/
│   └── product-management.spec.ts
├── src/
│   ├── components/
│   │   ├── ProductList.tsx
│   │   └── product-list.test.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   ├── product-utils.ts
│   │   └── product-utils.test.ts
│   ├── stores/
│   │   ├── ui-store.ts
│   │   └── ui-store.test.ts
│   ├── test/
│   │   ├── setup.ts
│   │   ├── integration/
│   │   │   └── products-api.test.ts
│   │   └── mocks/
│   │       ├── handlers.ts
│   │       └── server.ts
│   └── types/
│       └── product.ts
├── playwright.config.ts
├── vitest.config.ts
└── README.md
~~~

---

## Tests unitarios

Los tests unitarios se centran en funciones puras de lógica de inventario:

- `filterProducts`
- `sortProducts`
- `isLowStock`
- `formatPrice`

Archivo principal:

~~~txt
src/lib/product-utils.test.ts
~~~

Casos cubiertos:

- Búsqueda vacía.
- Búsqueda por nombre de producto.
- Búsqueda sin coincidencias.
- Búsqueda que coincide con una categoría pero no con el nombre del producto.
- Ordenación por precio.
- Ordenación por stock.
- Ordenación por nombre.
- Stock bajo con umbral configurable.
- Precio formateado en euros.

La cobertura de estas utilidades es del 100%.

---

## Tests del store de UI

Se ha creado y testeado un store de Zustand:

~~~txt
src/stores/ui-store.ts
src/stores/ui-store.test.ts
~~~

Se comprueba:

- Estado inicial.
- Cambio de búsqueda.
- Selección de categoría.
- Reset de filtros.
- Cambio de visibilidad del sidebar.

---

## Tests de componentes

Se ha añadido el componente:

~~~txt
src/components/ProductList.tsx
~~~

Y su test:

~~~txt
src/components/product-list.test.tsx
~~~

Se comprueba:

- Estado de carga.
- Renderizado de productos recibidos desde `/api/products`.
- Estado de error.
- Botón de reintento.

Para estos tests se usa MSW, evitando depender de una API real.

---

## Tests de integración de API

Archivo:

~~~txt
src/test/integration/products-api.test.ts
~~~

Se validan endpoints como:

| Método | Ruta |
|--------|------|
| GET | `/api/products` |
| POST | `/api/products` |
| PATCH | `/api/products/[id]/stock` |

Estos tests comprueban respuestas HTTP, creación de productos y validaciones de datos inválidos.

---

## Tests E2E con Playwright

Archivo:

~~~txt
e2e/product-management.spec.ts
~~~

Flujos cubiertos:

1. Crear un producto y verlo en la lista.
2. Filtrar productos por categoría.
3. Interactuar con el control de stock.

Para que los tests E2E sean estables, se usa:

~~~txt
E2E_MOCKS=1
~~~

Cuando esta variable está activa, la app usa datos mock en lugar de depender de Neon/PostgreSQL. Así los E2E no fallan por conexión externa, latencia o datos cambiantes.

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm test` | Ejecuta Vitest en modo watch |
| `npm test -- --run` | Ejecuta los tests una sola vez |
| `npm run test:coverage` | Ejecuta tests con cobertura |
| `npm run e2e` | Ejecuta Playwright |
| `npm run e2e:ui` | Ejecuta Playwright en modo interfaz |
| `npm run dev` | Levanta la aplicación Next.js |

---

## Cómo ejecutar la práctica

Instalar dependencias:

~~~bash
npm install
~~~

Ejecutar tests unitarios e integración:

~~~bash
npm test -- --run
~~~

Ejecutar cobertura:

~~~bash
npm run test:coverage
~~~

Ejecutar E2E:

~~~bash
npm run e2e
~~~

---

## Resultado obtenido

~~~txt
Test Files  5 passed
Tests       30 passed

Coverage:
product-utils.ts 100%

Playwright:
3 passed
~~~

---

## Documentación incluida

La carpeta `docs/testing/` contiene:

- `estrategia.md`: explicación de la pirámide de testing.
- `integracion.md`: diferencias entre tests unitarios e integración.
- `e2e.md`: explicación de Playwright y Page Object Model.

---

## Referencias

- Vitest Coverage: https://vitest.dev/guide/coverage
- Vitest Config: https://vitest.dev/config
- MSW Node Integration: https://mswjs.io/docs/integrations/node
- MSW setupServer: https://mswjs.io/docs/api/setup-server
- Playwright Web Server: https://playwright.dev/docs/test-webserver
- Playwright Configuration: https://playwright.dev/docs/test-configuration

---

*Práctica de testing realizada a partir del proyecto de inventario de la práctica 8 — Pedro Campos — 2026*

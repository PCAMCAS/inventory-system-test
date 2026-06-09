# Tests de integración

## Diferencia entre test unitario e integración

Un test unitario comprueba una pieza aislada. Por ejemplo, formatPrice recibe 89.5 y devuelve 89,50 €.

Un test de integración comprueba varias piezas funcionando juntas. Por ejemplo, ProductList hace una petición a /api/products y muestra productos recibidos desde una API simulada con MSW.

## Integración de API Routes

Las API Routes de Next.js App Router no son una aplicación Express. Por eso no se usa Supertest directamente.

En este proyecto se usa next-test-api-route-handler para lanzar peticiones contra handlers de Next.js. Esta librería permite importar el handler del archivo route.ts y simular peticiones HTTP reales en los tests.

## Datos de test

Los productos creados por tests empiezan por Test-. Así se pueden limpiar con Prisma antes de cada caso sin borrar datos reales del seed.

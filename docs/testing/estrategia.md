# Estrategia de testing

## Pirámide de tests

La pirámide de tests organiza las pruebas según coste, velocidad y confianza.

## Tests unitarios

Son los tests más rápidos. Comprueban funciones pequeñas sin depender del navegador ni de la base de datos.

Ejemplos del inventario del taller:
- filterProducts busca "roble" y encuentra "Tablero roble macizo 40 mm".
- isLowStock marca "Bisagra cazoleta 35 mm" como bajo stock porque tiene stock 0.
- formatPrice convierte 89.5 en 89,50 €.

## Tests de integración

Comprueban que varias piezas funcionan juntas.

Ejemplos:
- ProductList pide datos a /api/products y muestra "Tablero roble macizo 40 mm".
- El endpoint POST /api/products crea "Test-Listón pino 50x50" en base de datos.
- El endpoint PATCH /api/products/[id]/stock actualiza el stock de un material.

## Tests E2E

Simulan flujos completos de usuario en el navegador.

Ejemplos:
- Crear un nuevo material y verlo en el listado.
- Filtrar por la categoría "Electrónica".
- Pulsar dos veces el botón + y comprobar que el stock aumenta.

## beforeAll, beforeEach, afterEach y afterAll

beforeAll se ejecuta una vez antes de todos los tests de un archivo o suite.

beforeEach se ejecuta antes de cada test. Sirve para preparar datos limpios.

afterEach se ejecuta después de cada test. En esta práctica se usa para resetear los handlers de MSW.

afterAll se ejecuta una vez al final. En esta práctica se usa para cerrar el servidor de MSW.

## MSW

MSW permite interceptar peticiones HTTP reales en los tests. Es más realista que hacer vi.mock de axios o fetch porque el componente sigue usando fetch contra una URL, y el mock responde como si fuera la API.

Con vi.mock se testea más la implementación concreta. Con MSW se testea el comportamiento del componente frente a respuestas HTTP.

# Tests E2E con Playwright

## Qué se prueba

Los tests E2E comprueban flujos completos de usuario en navegador.

En esta práctica se prueban tres flujos:
- Crear un producto y verlo en el listado.
- Filtrar productos por categoría.
- Incrementar el stock de un producto.

## Page Object Model

Page Object Model es un patrón que separa los selectores y acciones de una página en una clase o módulo propio.

Es útil cuando los tests E2E crecen porque evita repetir selectores en muchos archivos. Si cambia un botón o un input, se actualiza en un solo lugar.

## Cuándo preferir E2E

Preferiría un test E2E cuando quiero comprobar el flujo completo tal como lo usa una persona real.

Por ejemplo, crear un producto desde el formulario, guardarlo, pedirlo a la API y verlo en pantalla da más confianza como E2E que como test unitario.

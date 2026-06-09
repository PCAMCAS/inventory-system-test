# Gestión de estado

## Estado de UI

El estado de UI afecta solo a la interfaz.

Ejemplos:
- Texto de búsqueda.
- Categoría seleccionada.
- Ordenación.
- Sidebar abierto o cerrado.

## Estado del servidor

El estado del servidor son datos que vienen de la API y de la base de datos.

Ejemplos:
- Productos.
- Categorías.
- Stock real de cada producto.

## Zustand

En una versión completa se usaría Zustand para centralizar búsqueda, filtros, ordenación y estado del sidebar.

El middleware persist permite guardar parte del estado en el navegador. Se persistiría sidebarOpen porque es una preferencia visual, pero no searchQuery porque es un filtro temporal.

## TanStack Query

En una versión completa se usaría TanStack Query para productos y categorías.

staleTime: tiempo durante el que los datos se consideran recientes.
gcTime: tiempo que los datos inactivos permanecen en caché antes de eliminarse.

## Actualización optimista

Al actualizar stock, la UI cambia antes de recibir respuesta del servidor. Si el servidor falla, se restaura el valor anterior.

En esta práctica se ha implementado esta idea en la página de productos: primero se actualiza el estado local y, si la respuesta del servidor no es correcta, se recupera el snapshot anterior.

## Estados observables

En React Query DevTools se pueden observar estados como:
- fresh: datos recientes.
- stale: datos en caché que pueden actualizarse.
- fetching: datos cargándose desde el servidor.

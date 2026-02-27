# Gestión de Estado (Pinia Stores)

Digital6G utiliza **Pinia** como almacén centralizado para el estado de la aplicación. Pinia es más intuitivo y modular que Vuex, permitiendo una separación clara de responsabilidades por dominios de negocio.

## 📁 Estructura del Directorio

- `auth.js`: Único store principal actualmente, encargado de la autenticación, sesión y perfil de usuario.

## 🚀 Principios de Implementación

1. **Composition API Style**: Los stores están definidos usando `setup stores` (`ref`, `computed`, `function`).
2. **Persistencia Automática**: Se utiliza el plugin `pinia-plugin-persistedstate` para mantener la sesión activa incluso después de recargar la página (`localStorage`).
3. **Reactive State**: El estado es reactivo, lo que significa que cualquier cambio en el store se refleja instantáneamente en todos los componentes que lo utilicen.

---

## 🔗 Referencia Detallada
- [Auth Store (Autenticación)](./AUTH_STORE.md)

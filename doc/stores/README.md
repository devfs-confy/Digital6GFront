# Gestión de Estado (Pinia Stores)

Digital6G utiliza **Pinia** como almacén centralizado para el estado de la aplicación. Pinia es más intuitivo y modular que Vuex, permitiendo una separación clara de responsabilidades por dominios de negocio.

## Estructura del Directorio

```text
src/stores/
└── auth.js          # Store principal de autenticación, sesión y perfil de usuario.

src/composables/
└── useAuth.js       # Composable que expone funciones de validación de permisos
                     # basadas en el estado del authStore.
```

## Principios de Implementación

1. **Composition API Style**: Los stores están definidos usando `setup stores` (`ref`, `computed`, `function`).
2. **Persistencia Automática**: El plugin `pinia-plugin-persistedstate` mantiene `token`, `role` y `user` en `localStorage` para sobrevivir recargas de página.
3. **Reactive State**: Cualquier cambio en el store se refleja instantáneamente en todos los componentes que lo utilicen.
4. **Composable de Acceso**: Los componentes no deben leer el store directamente para validar permisos; deben usar `useAuth()` del composable, que encapsula la lógica de bypass de administrador.

---

## Referencia Detallada
- [Auth Store (Autenticación)](./AUTH_STORE.md)

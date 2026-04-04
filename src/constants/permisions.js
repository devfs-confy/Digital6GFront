// src/constants/permisions.js

export const permisosCatalogo = {
  ids: {}, // { "VER-USUARIOS": "57", ... }
  nombres: [], // ["VER-USUARIOS", "CREAR-USUARIOS", ...]
};

export const cargarCatalogo = (permisosApi) => {
  permisosCatalogo.nombres = permisosApi.map((p) => p.Nombre);
  permisosCatalogo.ids = Object.fromEntries(
    permisosApi.map((p) => [p.Nombre, p.Id]),
  );
};

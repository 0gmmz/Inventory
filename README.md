# Inventario TI

Sistema de gestión de inventario de hardware, licencias y asignaciones para el equipo de TI.

## Stack
- React 18 + Vite
- Supabase (Postgres, Auth, Storage)
- Cloudflare Pages (hosting)

## Puesta en marcha
1. `npm install`
2. Copia `.env.example` a `.env` y llena la URL y anon key de tu proyecto Supabase.
3. Ejecuta el script `schema_inventario_ti.sql` en el SQL Editor de Supabase (si no lo has hecho).
4. En Supabase Storage crea dos buckets **privados**: `facturas` y `resguardos`.
5. En Supabase Auth crea los usuarios del equipo de TI (Authentication → Users → Add user).
6. `npm run dev`

## Estructura
- `src/lib/supabase.js` — cliente único de Supabase
- `src/services/` — capa de datos por dominio (activos, licencias, asignaciones, colaboradores, catálogos, storage)
- `src/context/AuthContext.jsx` — sesión y login/logout
- `src/components/` — Layout (tabbar móvil / sidebar escritorio), AssetTag, EstadoBadge
- `src/pages/` — Tablero, Hardware, Licencias, Asignaciones
- `src/styles/` — tokens de diseño y estilos base

## Deploy en Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- Variables de entorno: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Agrega una regla SPA: en `dist` se genera `index.html`; configura "Single Page Application" para que las rutas de React Router funcionen (o crea un archivo `_redirects` con `/* /index.html 200`).

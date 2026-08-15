# Resultados QA — 2026-08-15

## Ejecutado

- Node test runner: **23/23 pruebas** sobre fórmula MET, cesta, enlaces, consentimiento, Storage bloqueado, cookies, GA4, límites, fuentes y CSP local.
- Validador: catálogos ES/US, fuentes externas HTTPS, rutas metodológicas internas, fechas, IDs, sitemap, canonicals, metadatos, JSON-LD, robots, consentimiento en hubs y plantilla de headers.
- `node --check`: aplicación, hubs, preferencias de cookies, núcleo, catálogo, generador social, servidor y validador.
- HTTP local: GET/HEAD y reto devuelven 200; ruta inexistente y traversal devuelven 404; POST devuelve 405 con `Allow`; CSP, MIME, `nosniff`, `DENY` y demás headers previstos están presentes.
- SEO/social: seis páginas editoriales, canonicals, JSON-LD y enlaces validados; PNG 1200×630, 1080×1350 y 1080×1920 y sus SVG editables verificados por estructura y dimensiones.
- GitHub Pages: certificado aprobado y HTTPS forzado confirmado por API.

## No ejecutado

La automatización visual/interactiva y Lighthouse no pudieron arrancar porque el navegador integrado falló al inicializarse por permisos del entorno. No se atribuyen resultados. Deben ejecutarse sobre la PR o producción antes de considerar cerrada la matriz de dispositivos.

## Hosting

Los headers de `_headers` no son compatibles con GitHub Pages; solo están activos en QA local. Esta limitación está documentada y no se presenta como protección de producción.

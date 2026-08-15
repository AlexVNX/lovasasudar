# Checklist de despliegue

## Confirmado

- Repositorio: `AlexVNX/lovasasudar`.
- Hosting: GitHub Pages legacy desde `main` y raíz.
- Dominio: `lovasasudar.com`.
- Certificado aprobado; **HTTPS obligatorio activado el 2026-08-15** y verificado por API.

## Antes de fusionar

- [x] Suite Node (23/23) y validador ejecutados.
- [x] Diff, fuentes y ausencia de secretos revisados.
- [ ] Probar 320/390/768/1440 px, teclado, cesta, rechazo/aceptación, reto, duelo, descargas y 404.
- [ ] Confirmar GA4 ausente antes de aceptar y sin peso/texto/resultados.
- [ ] Comprobar PNG social en WhatsApp/Instagram/Stories.

## Limitación de GitHub Pages

GitHub Pages no aplica el archivo `_headers`; se mantiene únicamente como plantilla verificable para una futura capa Cloudflare u otro hosting. CSP, Permissions-Policy, Referrer-Policy y headers de caché sí se prueban en el servidor QA local, pero **no deben afirmarse como activos en producción**. Para aplicarlos al dominio será necesario migrar/proxyficar el hosting; HTTPS forzado sí está activo ahora.

## Después de fusionar

- [ ] Esperar build Pages y comprobar estado `built`.
- [ ] Smoke test producción, redirect HTTP→HTTPS y certificado.
- [ ] Revisar consola, red y cookies antes/después de consentimiento.
- [ ] Lighthouse/axe y Search Console.
- [ ] Mantener el commit anterior como rollback.

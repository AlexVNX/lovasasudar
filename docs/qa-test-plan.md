# Plan QA

Automatizado: fórmula MET, cantidad, rangos, extremos, serialización, manipulación de producto, integridad del catálogo y enlaces legales. E2E pendiente: consentimiento aceptar/rechazar/revocar, búsqueda teclado, cálculo, fuente, Web Share/fallback, reto, duelo, páginas legales, móvil 320/390/768/1440, 404 y consola. Seguridad: CSP/headers, parámetros largos, XSS, CORS y Supabase/RLS antes de reactivar comunidad.

## Puerta automatizada antes de desplegar

Ejecutar desde la raiz:

```powershell
npm test
npm run validate
```

Si `npm` no est? en `PATH`, ejecutar los dos archivos con el runtime Node disponible:

```powershell
node --test tests/core.test.js
node scripts/validate.mjs
```

La validacion debe detener el despliegue ante cualquiera de estos casos:

- ID duplicado o inseguro en los catalogos ES/US.
- Campo obligatorio, rango, fecha o URL de fuente invalidos.
- URL del sitemap inexistente, duplicada, con parametros o de otro origen.
- Canonical distinto de la URL declarada, `lang`, viewport, description, title o H1 ausentes.
- JSON-LD no parseable.
- Consentimiento ausente en los hubs o evento que expone las kcal calculadas.
- Configuracion de cabeceras incompleta.

## Matriz manual de aceptacion

### Privacidad y analitica

- Perfil limpio: abrir una pagina SEO directamente y confirmar en Network que no se solicita `googletagmanager.com`.
- Rechazar en portada, recargar y navegar a una pagina SEO: GA4 continua ausente.
- Aceptar en portada y navegar a una pagina SEO: GA4 carga una sola vez.
- Revocar desde ?Preferencias de cookies?, recargar y confirmar que GA4 deja de cargarse.
- En DebugView, `hub_calculate` solo contiene `category`, `item_id`, `market` y `language`; nunca peso, cantidad, kcal ni texto libre.

### Accesibilidad

- Recorrer portada, modal, calculadora, duelo y paginas SEO solo con teclado.
- Confirmar foco visible, orden logico y retorno de foco al cerrar el dialogo.
- Comprobar nombres accesibles de inputs, selects y botones con lector de pantalla.
- Verificar que errores y resultados se anuncian una sola vez.
- Probar zoom al 200 % y reflow a 320 CSS px sin desplazamiento horizontal de la pagina.
- Activar `prefers-reduced-motion` y confirmar que no queda movimiento esencial.
- Ejecutar axe sin incidencias criticas o graves y conservar el informe.

### Funcional y visual

- Anchos: 320, 390, 768, 1024 y 1440 px.
- Navegadores: Chrome/Edge, Firefox y Safari iOS/macOS actuales.
- Busqueda sin resultados, cantidad minima/maxima, pesos 35/200 kg y enlaces manipulados.
- Compartir nativo, cancelacion de compartir, fallback al portapapeles y permiso denegado.
- Abrir un reto sin peso en una sesion nueva y completar el calculo.
- Comparar el primer y ultimo producto del catalogo.
- Abrir fuente interna y externa, legal, contacto, metodologia y una URL inexistente.

### Seguridad y entrega

- `GET /` y `HEAD /` devuelven 200; la ruta inexistente devuelve el HTML 404 con estado 404.
- `POST /` devuelve 405 y cabecera `Allow: GET, HEAD`.
- Intentos con `../`, `%2e%2e`, byte nulo y escapes de symlink no sirven archivos fuera de la raiz.
- Verificar en produccion CSP, HSTS, COOP, CORP, Permissions-Policy, Referrer-Policy, `nosniff` y anti-framing.
- Confirmar que el proveedor realmente interpreta `_headers`; GitHub Pages no lo hace de forma nativa.
- Revisar consola sin errores CSP y que GA4 funciona despues, y solo despues, del consentimiento.

## Evidencia de salida

Registrar fecha, commit, URL de preview, navegador/dispositivo, resultado de Lighthouse movil, axe, prueba de consentimiento y captura de cabeceras. No cerrar la salida con un resultado pendiente o no reproducible.

## Resultado de ejecucion 2026-08-15

- Unitarias: 8/8 superadas; incluyen cesta, rangos, limites, minimizacion de URL, compatibilidad antigua y percent-encoding malformado.
- Validador: 56 productos y 21 URLs indexables superados; incluye canonical, metadatos, JSON-LD, enlaces internos, modulos heredados, consentimiento y cabeceras.
- Servidor QA: GET 200, HEAD 200, 404 HTML real, POST 405 con `Allow`, traversal 404, CSP, `nosniff` y anti-framing verificados.
- `git diff --check`: sin errores de whitespace; solo avisos de conversion LF/CRLF en archivos ajenos a esta auditoria.
- QA visual/interactiva: bloqueada antes de abrir la pagina por el error ACL del navegador integrado del entorno.
- No se uso Playwright standalone, de acuerdo con la restriccion de QA acordada.

Pendiente manual: Browser real, axe, Lighthouse, Safari/iOS, GA4 DebugView y cabeceras de produccion tras elegir un host capaz de aplicarlas.

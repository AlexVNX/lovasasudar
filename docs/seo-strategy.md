# Estrategia SEO

## Arquitectura indexable

- `/`: calculadora y cesta principal.
- `/equivalencias/`: índice editorial.
- `/equivalencias/{tema}/`: cinco guías originales con ración, rango, MET, FAQ visible, canonical, Open Graph, JSON-LD y enlaces internos.
- Hubs históricos ES/EN: categorías y metodología con `hreflang` recíproco.
- URLs de retos: parámetros `items` o legado `p`; canonical a portada, señal `noindex,follow` y exclusión en robots/sitemap.
- Páginas legales incompletas: enlazadas para transparencia, pero `noindex,follow` y fuera del sitemap mientras la identificación queda en espera.

## Criterio editorial

Una página solo se publica si aporta ración, fuente o justificación del rango, equivalencias, limitaciones, preguntas específicas y enlaces contextuales. No se generan páginas masivas. Las nuevas guías son pizza mediana, hamburguesa completa, bravas, pincho de tortilla y cerveza de 330 ml.

## Recursos sociales

La aplicación genera PNG dinámico 1200×630 al compartir y descargas 1080×1350 y 1080×1920, sin peso ni logos de terceros. También se conservan plantillas SVG editables en `assets/social-*`.

## Medición y QA

Validar después del despliegue: status 200/404, canonical, sitemap, robots, JSON-LD, enlaces, render móvil y Search Console. Medir landing → cálculo → compartir, no solo sesiones. GitHub Pages no ofrece Open Graph dinámico por query; una función edge solo se justifica tras demostrar el circuito viral.

# Auditoría — 2026-08-15

## Estado inicial confirmado

La carpeta local se había creado sin remoto ni HEAD, aunque el proyecto real existía en `AlexVNX/lovasasudar`. Se recuperó primero la versión pública y después se enlazó `origin/main`, conservando su historial y las páginas SEO ES/EN.

La portada mezclaba cuatro modos, género sin efecto, peso/género en analítica, cálculos y memes automáticos, ranking con apodo/país y Supabase, además de copy de castigo. La carga principal de GA4 no exigía una decisión visible. Los resultados ocultaban parte de la trazabilidad disponible en el catálogo.

## Correcciones implementadas

- Una experiencia dominante: buscar → seleccionar → cesta/cantidad → peso opcional → calcular → compartir.
- Rango de kcal propagado a minutos; ración, mercado, tipo, fuente y revisión visibles.
- GA4 diferido hasta aceptación; rechazo y revocación funcionales; eventos sin peso, género, kcal exactas ni texto.
- Género, apodos, ranking, inferencia de país, Supabase frontend y módulos heredados eliminados.
- URLs multiartículo validadas, con compatibilidad antigua, noindex y sin peso.
- Duelos neutrales, PNG sociales y siete productos oficiales España añadidos (ocho en total).
- Índice y cinco guías editoriales; sitemap/canonical/robots validados.
- HTTPS obligatorio activado en GitHub Pages.

## Riesgos residuales

- Identidad y canal formal del titular en espera por decisión del proyecto; páginas fuera del índice.
- RLS, Edge Functions y rate limiting de la antigua comunidad no se consideran verificados y no deben reactivarse.
- GitHub Pages no permite headers personalizados: `_headers` es plantilla, no protección productiva.
- QA visual, Lighthouse y matriz de navegadores pendientes por fallo del navegador integrado.
- Las fichas oficiales antiguas de Doritos requieren revisión anticipada.

# Especificación de analítica

North Star: **cálculos completados desde un reto compartido**. GA4 no se descarga hasta consentimiento y el rechazo mantiene todas las funciones.

## Eventos implementados

`calculator_start`, `product_selected`, `basket_item_added`, `calculation_completed`, `share_intent`, `share_completed`, `link_copied`, `challenge_opened`, `challenge_calculation_completed`, `challenge_reshared`, `product_not_found`, `source_opened`, `correction_requested` y `duel_completed`.

Parámetros permitidos: `product_id`, `category`, `market`, `language`, `mode` y `item_count_bucket`. Prohibidos: peso, género, kcal/resultados exactos, términos de búsqueda, apodos, texto libre y URL completa.

`share_completed` solo se registra cuando Web Share resuelve. El fallback registra `link_copied`; generar una tarjeta o cambiar un selector no cuenta como compartir ni calcular.

## Panel mínimo

Sesiones con consentimiento, cálculo/visita, share/cálculo, apertura de reto, reto→cálculo, recompartición, productos, `product_not_found`, fuentes abiertas, idioma/mercado, error y dispositivo. No reconstruir históricos inexistentes.

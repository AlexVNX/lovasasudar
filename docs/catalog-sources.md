# Registro de fuentes del catálogo

Estado a 2026-08-15: **31 referencias España** —23 estimaciones genéricas y 8 productos con fuente oficial—. El archivo operativo es `assets/js/catalog.js`; `npm run validate` exige ID seguro, ración, kcal/rango, estado, mercado y fecha; las fuentes oficiales deben usar HTTPS y las estimaciones una ruta metodológica interna válida.

## Productos con fuente oficial

| Producto | Ración | kcal | Fuente primaria España | Consulta | Próxima revisión |
|---|---:|---:|---|---:|---:|
| KITKAT clásico | 41,5 g | 212 | Nestlé España, información nutricional 2024 (tabla p. 17) | 2026-08-15 | 2027-02-15 |
| Coca-Cola Sabor Original | 330 ml | 139 | Coca-Cola España, FAQ de producto | 2026-08-15 | 2027-02-15 |
| NUTELLA Biscuits | 13,8 g | 70 | Ferrero España, ficha de producto | 2026-08-15 | 2027-02-15 |
| Doritos Tex-Mex | 30 g | 149 | PepsiCo España, ficha técnica 2022 | 2026-08-15 | 2026-11-15 |
| Doritos Dippas | 30 g | 148 | PepsiCo España, ficha técnica 2022 | 2026-08-15 | 2026-11-15 |
| Barrita Nesquik | 25 g | 101 | Nestlé España, información nutricional 2024 | 2026-08-15 | 2027-02-15 |
| Barrita Chocapic | 25 g | 101 | Nestlé España, información nutricional 2024 | 2026-08-15 | 2027-02-15 |
| Danet vainilla | 120 g | 131 | Danone España Foodservice, 109 kcal/100 g; conversión redondeada a la unidad de 120 g | 2026-08-15 | 2027-02-15 |

Las URLs exactas están junto a cada registro del catálogo. Doritos se revisará antes porque las fichas oficiales disponibles son de 2022. Danet conserva en `source` la transformación aritmética aplicada, evitando presentar 131 kcal como cifra literal de la ficha.

## Estimaciones

Las otras 23 referencias son rangos editoriales por variación de receta, tamaño o servicio. No utilizan marcas ni se presentan como valores oficiales. Próxima revisión general: 2027-02-15.

## Política de incorporación

No se acepta una marca sin fuente primaria aplicable a España, ración identificable y fecha. No se copian logos, fotografías ni envases. Idioma y mercado permanecen separados; el catálogo estadounidense vive en `catalog-us.js`.

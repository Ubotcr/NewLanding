# SEO de Ubot: política y operación

La implementación concentra la búsqueda pública en `https://ubotcr.com`. Las apps de Admisión y Estandarizadas conservan sus funciones y autenticación, con `noindex` en el HTML inicial. Esta decisión incluye perfiles públicos dentro de Admisión: no se indexan en esta versión.

## Inventario y reglas

| Host / plantilla | Indexar | Canonical / destino | Sitemap |
|---|---|---|---|
| ubotcr.com: portada, productos, información y páginas legales | Sí | La URL HTTPS propia, sin barra final salvo `/` | Sí |
| Blog: artículos publicados e índice principal | Sí | URL original `/blog/{slug}` | Sí |
| `/estandarizadas/matematicas` y guías publicadas | Sí | URL propia bajo el centro de Matemáticas | Sí |
| `/blog/page/*`, `/changelog`, errores | No | URL propia; errores con HTTP 404 | No |
| Borradores | No se generan | Sin URL pública nueva | No |
| chat.ubotcr.com y estandarizadas.ubotcr.com | No | No se fuerza canonical hacia una página de contenido diferente | No |
| Desarrollo, preview y dominios CloudFront | No | Cabecera noindex; producción www redirige al dominio principal | No |

`robots.txt` permite rastrear las páginas necesarias para leer `noindex` y sus recursos. No es un mecanismo de privacidad. No publicar conversaciones ni material privado en Astro. Los parámetros de campaña no forman parte del canonical. HTTPS se aplica en CloudFront con Redirect HTTP to HTTPS; www y barras finales se normalizan con 301 conservando consultas.

## Publicar y mantener contenido

1. Editar el contenido en `src/content/blog` o `src/content/guides`; las guías usan `/estandarizadas/matematicas/{slug}`. No modificar slugs publicados sin una redirección equivalente.
2. Incluir título, descripción específica, autor y fecha de publicación real. `updated` solo cambia con modificaciones significativas, no en cada compilación. `reviewedBy` y `reviewedAt` se incluyen juntos y solo después de una revisión real. Nunca atribuir revisión docente a quien no la hizo.
3. Incluir fuentes oficiales para datos de convocatorias, requisitos y fechas. La selección de temas de Ubot no es una certificación de cobertura del programa MEP. Un responsable educativo debe revisar ejemplos y afirmaciones antes de nuevas publicaciones.
4. Enlazar cada recurso desde su centro o una página relacionada y enlazar la práctica con `<a href>`. Las guías existentes del blog mantienen sus URLs. Usar `draft: true` mientras el contenido esté pendiente.
5. Evitar títulos duplicados, páginas vacías y publicaciones masivas por variantes de palabras clave. No inventar fechas, calificaciones, reseñas ni garantías de resultados.
6. JSON-LD describe contenido visible: identidad, artículo y breadcrumbs. Las preguntas frecuentes visibles se conservan, pero Ubot no debe esperar rich results FAQ reservados por Google a sitios gubernamentales o sanitarios reconocidos.

El layout `Base` centraliza metadatos y admite `ogType`, `structuredData`, `breadcrumbs` y `mascot`. La mascota se carga solo en páginas que la muestran; las páginas editoriales no descargan su CSS/JS. JSON-LD centralizado escapa `<` para evitar cierres de script. El esquema editorial valida fechas y datos de publicación. No se agrega `lastmod` automático al sitemap: omitirlo es preferible a inventar actualizaciones.

## Comprobaciones de cada cambio

Desde NewLanding:

```sh
pnpm run check
pnpm run build
pnpm run seo:check
pnpm run seo:browser
pnpm run hosting:build
```

`seo:check` inspecciona todo el HTML generado: metadatos, canonical, JSON-LD parseable, h1, enlaces internos, páginas huérfanas, sitemap e indexación. También prueba en VM las funciones CloudFront, redirecciones, consultas, 404 y previews. `seo:browser` necesita Chrome (`CHROME_BIN`, predeterminado `/usr/bin/google-chrome`) y Node 22+; verifica ocho páginas en escritorio y móvil, menú y desbordamiento, bloqueando analítica/anuncios. No sustituye Rich Results Test ni inspección de URL de Google. `hosting:build` genera `hosting/landing-routes.js` desde las páginas efectivamente compiladas; se publica como artefacto `landing-hosting` separado del contenido S3. La función no debe superar 10 KB.

Desde Frontend:

```sh
python3 scripts/generate-hosting-routes.py
python3 scripts/generate-hosting-routes.py --check
node tests/SharedUiChecks/hosting-routes-checks.cjs
```

Regenerar y revisar la función cuando cambien rutas Razor. CI bloquea inventarios obsoletos. Los workflows AWS y Azure validan el SEO estático antes de publicar; los workflows AWS comprueban producción después de invalidar. Una verificación fallida posterior a la carga no revierte S3 automáticamente.

## Activación en infraestructura existente

1. Publicar y comprobar primero la landing con los centros públicos antes de activar noindex en las apps. Conservar roles OIDC, buckets privados y certificados actuales. No ampliar permisos de los roles de publicación para administrar CloudFront.
2. Compilar y revisar los artefactos. En la landing, publicar `hosting/landing-routes.js` como función Viewer request y `docs/aws/landing-headers.js` como Viewer response, asociadas a los comportamientos HTML. Repetir la actualización del inventario de rutas cuando se agreguen o retiren páginas.
3. En las dos distribuciones de apps publicar las funciones de `Frontend/docs/aws/frontend-routes.js` y sus funciones de cabeceras. Asociarlas a todos los comportamientos que atiendan documentos HTML.
4. Configurar HTTP → HTTPS; conservar los certificados para apex y www. Eliminar reglas globales que conviertan cualquier error 403/404 en `index.html` con HTTP 200. Las funciones generan 404 para rutas de página desconocidas. Los objetos estáticos faltantes mantienen el error del origen S3 (puede ser 403 con OAC): nunca se convierten en la SPA.
5. Publicar archivos y robots, invalidar caché y ejecutar `pnpm run seo:smoke`. El monitor diario también comprueba los tres sitios. La publicación de archivos en S3 no actualiza ni asocia funciones CloudFront; este paso de infraestructura debe completarse antes de considerar activa la política.
6. Azure permanece como flujo existente. Si aún sirve un dominio accesible, aplicar noindex en la configuración de hosting de ese preview y verificarlo antes de anunciar la migración completa; la función AWS no controla Azure.
7. Al retirar páginas, el inventario de rutas debe dejar de servirlas aunque persistan objetos antiguos en S3. Revisar aparte solicitudes directas a archivos `.html` antiguos; una baja definitiva necesita retirar o bloquear esos objetos.

## Search Console y medición

El responsable con acceso verifica una propiedad **Dominio `ubotcr.com`** mediante DNS, registra `https://ubotcr.com/sitemap-index.xml` e inspecciona portada, productos, centro y una guía. Confirmar canonical seleccionado, HTML renderizado y ausencia de bloqueos. Verificar que las apps se excluyen por noindex después del nuevo rastreo. No solicitar retirada masiva de URLs sin revisar cuáles contienen contenido que se quiera conservar.

| Frecuencia | Responsable | Acción |
|---|---|---|
| Cada PR / despliegue | Frontend / operación | CI, pruebas de rutas, robots, canonical y smoke público |
| Diario | GitHub Actions `Monitor public SEO` | Comprobar disponibilidad, metadatos, sitemap, apps noindex y 404; revisar ejecuciones fallidas |
| Semanal | Operación con acceso a Search Console | Sitemap procesado, exclusiones inesperadas, seguridad y acciones manuales |
| Mensual | Producto / editorial | Clics, impresiones, CTR y consultas; separar marca/no marca, Admisión/Estandarizadas y móvil/escritorio |
| Trimestral y antes de cada convocatoria | Editorial / revisor educativo | Fechas, fuentes MEP y universidades, enlaces, exactitud y cambios en Search Central |

Usar ventanas comparables de 28 días y anotar despliegues y estacionalidad. No interpretar visitas GA4 como clics de Search Console: miden cosas distintas. Objetivos de Core Web Vitals en percentil 75: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. Confirmar con datos de campo cuando haya muestra suficiente; Lighthouse y las pruebas locales no certifican esas métricas.

## Recuperación y límites

Ante noindex accidental o canonical incorrecto, revertir el despliegue afectado y restaurar la versión previa de las funciones; invalidar la caché y volver a inspeccionar URLs. No existe garantía de posición ni de indexación. Guardar en cada revisión fecha, SHA, errores y estado real de despliegue.

El entorno local de esta implementación no tiene resolución DNS saliente ni acceso a GA4/Search Console. Las funciones están preparadas y probadas localmente; no se afirma publicación ni asociación LIVE. Consultar [auditoría inicial](auditoria-2026-11-01.md) para evidencia y pendientes.

## Referencias oficiales

- [Google: JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: noindex y robots](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google: sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Google: contenido útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: datos estructurados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google: Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Google: funciones de IA en Search](https://developers.google.com/search/docs/appearance/ai-features)

## Política de indexación y verificación (2026-11-07)

El sitio público `ubotcr.com` concentra productos, guías y ejercicios sin cuenta. Admisión y Estandarizadas mantienen exactamente una etiqueta `robots` con valor `noindex` en el HTML inicial y la cabecera `X-Robots-Tag: noindex` en las respuestas HTML. No usar `Disallow: /`, sitemaps de las apps ni un canonical global para rutas diferentes. La autenticación protege los datos; `noindex` controla la búsqueda. Los perfiles públicos de Admisión siguen excluidos.

Las comprobaciones de publicación deben validar los archivos generados y las respuestas de producción: raíz, cuenta y rutas internas representativas, robots y 404. Verificar la asociación de las funciones de CloudFront además de publicar S3. El monitor diario comprueba ambas capas de exclusión. Los textos nuevos y modificados usan español neutro sin voseo.

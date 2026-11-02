# Auditoría inicial GA4 y SEO — 2026-11-01

## Actualización: instrumentación de Estandarizadas

Después de la auditoría inicial se agregó GA4 a la app independiente, usando el mismo Measurement ID y `product=estandarizadas`. Incluye consentimiento opt-in, DNT, hosts autorizados, navegación SPA saneada, identidad opaca, apertura/entrega de prácticas y diarios, teoría y tutor. La recepción en GA4 no está confirmada y requiere despliegue/DebugView. Ver [implementación y operación](../../../Frontend/docs/analytics-estandarizadas.md).

Los hallazgos siguientes describen la revisión inicial, anterior a esa incorporación. Los problemas de Admisión y landing no se dan por resueltos con este agregado.

## Resultado inicial y nivel de evidencia

**GA4 está implementado en la landing y Admisión, pero no en la app independiente de Estandarizadas.** Las métricas internas del backend no demuestran presencia en GA4. El cambio inicial de SEO no agregó eventos GA4; la integración posterior de Estandarizadas se describe en la actualización anterior.

Se inspeccionaron código de NewLanding, Frontend y servicios de analítica del Backend, configuración de publicación y documentos generados. Las rutas de hosting se probaron con eventos simulados. No se accedió a la propiedad GA4 ni a Search Console; no se confirma recepción de eventos, tráfico histórico, configuración de enhanced measurement, dimensiones registradas ni indexación real.

Desde el shell, los dominios públicos fallaron por DNS (`Temporary failure in name resolution`). El lector web externo pudo devolver contenido de [la portada](https://ubotcr.com/) y [Admisión](https://chat.ubotcr.com/), con rastreos fechados varios días antes; mostró una portada centrada en Admisión, diferente de la versión del repositorio. Es una señal de posible desfase, no prueba de cuál es el despliegue actual. Estandarizadas no fue accesible mediante ese lector. No se obtuvieron cabeceras ni solicitudes GA4 de producción. El script `seo-smoke.py` permite repetir la comprobación desde un entorno con red.

## Flujo de recolección encontrado

- **Landing:** `src/layouts/Base.astro` incluye gtag estático con `G-XHGSQZ25SH`. Su script configura GA4 con medición automática de carga cuando DNT no está activo y `ubot-consent` no es `denied`. No hay eventos propios para CTAs ni diferenciación explícita por producto.
- **Admisión:** `wwwroot/index.html` carga y configura el mismo ID con `send_page_view:false`. `Program.cs` registra `AnalyticsSettings` y `AnalyticsService`; `appsettings.json` contiene `Enabled:true`. `MainLayout.razor` inicializa el servicio en primer render y sincroniza identidad. El servicio observa `LocationChanged`, envía `page_view` manual y pasa eventos a `wwwroot/js/analytics.js`, que llama a gtag.
- **Identidad en Admisión:** `PublicUserId`, descrito como opaco, se envía como `user_id`; `plan` e `is_premium` como propiedades. No se encontraron correo ni nombre en los payloads explícitos del servicio. Esto no certifica que toda URL, título o configuración externa esté libre de información personal.
- **Estandarizadas:** `Program.cs`, `wwwroot/index.html` y `appsettings.json` no configuran GA4; las búsquedas en el proyecto y en Ubot.Core/Ubot.UI no encontraron instrumentación compartida. La referencia a Core/UI no hereda el servicio de Admisión.
- **Backend:** `app/core/analytics_utils.py` incrementa contadores mensuales en Firestore (`metrics/stats_YYYY_MM`, hora Costa Rica). `analytics_connections_service.py` mantiene actividad y `connection_logs`, con debounce. `app/exams/analytics.py` calcula estadísticas académicas. No son envíos a GA4.

Las rutas citadas de Admisión son relativas a `Frontend/Ubot.Admision`; las de Estandarizadas a `Frontend/Ubot.Estandarizadas`.

## Matriz de eventos

Todo lo siguiente está **instrumentado en código**, sin confirmación de envío/recepción en producción.

| Producto / evento | Disparador y parámetros | Cobertura / observación |
|---|---|---|
| Landing `page_view` | Configuración gtag por carga; contexto automático de página | No hay eventos de conversión hacia cada app |
| Admisión `page_view` | Inicio y LocationChanged; `page_path` | `AnalyticsService.cs:80–95`; revisar título, referrer y duplicación por history |
| Admisión `login` | Sincronización autenticada del layout; `method=google` | `MainLayout.razor:463–475`; también sucede al restaurar una sesión en una nueva carga |
| `exam_completed` | Diario/tipo de ExamTakingPage, simulacro y examen especial; `exam_type`, `is_premium` | `ExamTakingPage.razor:450`, `SimulacroTakingPage.razor:513`, `ExamenEspecialPage.razor:740` |
| `activity_completed` | Los exámenes anteriores y FlipMatch; `activity_type`, `is_premium` | `FlipMatchPlay.razor:373`; no sumar junto con exam_completed como actividades distintas |
| `quiz_completed` | Cierre del onboarding; `surface`, `action`, `goal`, `discovery_source`, `chain_id` cuando aplican | `QuizOnboardingDialog.razor:364`; incluye dismissed, X/backdrop no emite |
| `feedback_started`, `feedback_step`, `feedback_completed` | Inicio, avance y cierre de feedback | `FeedbackPromptService.cs:49,56`, `FeedbackQuizDialog.razor:254`; enums, paso, cadena y respuestas opcionales |
| `begin_checkout` | Selección de plan; `plan_id`, `currency`, `payment_method`; `value`, `items` si hay precio | `PremiumPage.razor:150` |
| `purchase` | Retorno PayPal, usuario premium confirmado y deduplicación local por subscription_id | `PayPalReturnService.cs:93`; `transaction_id`, plan, moneda e importe opcional |
| `spend_virtual_currency` | Compra confirmada de tienda; ítem, precio en monedas y balance | `StorePage.razor:472`; contrato recomendado incompleto |
| `earn_virtual_currency` | Método definido en AnalyticsService | No se encontraron llamadores de `TrackVirtualEarnAsync` fuera de su definición |
| Estandarizadas: todos | Sin etiqueta, servicio ni eventos encontrados | Sin cobertura GA4 en el código revisado |

## Hallazgos de analítica y recomendaciones

| Prioridad | Evidencia | Impacto y recomendación |
|---|---|---|
| Alta | Estandarizadas carece de GA4 en host y dependencias compartidas | No permite evaluar adquisición→práctica→retorno en GA4. Diseñar instrumentación explícita con producto, navegación, práctica y tutor, previa política común de consentimiento |
| Alta | Landing carga gtag antes de consultar DNT/consentimiento; configura cuando la elección es null | El banner no condiciona la primera configuración a aceptar. Bloquear la configuración hasta la decisión si el comportamiento pretendido es opt-in; esto es un hallazgo técnico, no una evaluación legal |
| Alta | Admisión carga/configura etiqueta en index.html antes del chequeo DNT de `ubotAnalytics.init`; no consulta `ubot-consent` | El interruptor Enabled y DNT no evitan la carga/configuración estática; no describirlos como apagado global. Unificar control de carga, configuración y eventos |
| Alta | `clearUser` usa `user_id:undefined` en `analytics.js:103` | No sigue el contrato documentado para logout. Usar `null` y comprobar que eventos posteriores no conservan identidad anterior |
| Media | `_analyticsLoginReportado` es memoria del layout | Login se cuenta por restauración de sesión en una nueva instancia, no solo autenticación explícita. Separar sesión restaurada del login real |
| Media | `send_page_view:false` y LocationChanged, sin acceso a enhanced measurement | Riesgo pendiente de doble conteo si history automático sigue activo. Elegir una estrategia y comprobar una sola vista por navegación en DebugView |
| Media | Solo se fija `page_path` en la vista manual | Verificar `page_location`, `page_title` y referrer del evento, incluyendo consultas y rutas con IDs; establecer sanitización y dimensiones de contenido de baja cardinalidad |
| Media | `_iniciado=true` antes de saber si JS se inicializó; excepciones silenciadas | Tras un fallo no hay reintento real en la misma instancia. Separar inicializando/listo/fallido y diagnóstico sin datos personales |
| Media | SimulacroTecTakingPage envía resultados en línea 386 sin llamada a Analytics | Cobertura desigual entre familias de examen. También revisar diagnósticos y juegos antes de usar actividad GA4 como total del producto |
| Media | spend usa `price_coins` sin `value`/`virtual_currency_name`; earn declarado sin uso | Los nombres coinciden con eventos recomendados, pero los parámetros no completan ese contrato. Normalizar monedas sin mezclarlas con ingresos reales |
| Media | TrackPurchaseAsync silencia fallos y PayPalReturnService marca la suscripción como declarada después del intento | Una llamada fallida puede quedar deduplicada sin haberse enviado. Separar intento de entrega y confirmación sin convertir la analítica en requisito del flujo de pago |
| Media | Retorno de compra confirma IsPremium y deduplica en localStorage | No es una conciliación contable: estado premium no demuestra por sí solo un cobro nuevo y la deduplicación no es global. Contrastar ingresos con PayPal/backend; no usar GA4 como libro de ventas |
| Media | Dimensiones de producto ausentes; mismo Measurement ID en landing/Admisión | Segmentar por hostname y, en futura instrumentación, por producto. Confirmar dominios, referencias y atribución desde la propiedad, sin asumir que compartir ID garantiza continuidad |
| Baja | Comentario de allowlist en TrackEventAsync, pero acepta cualquier nombre/diccionario | Implementar contrato validado si se pretende restringir eventos; no confiar en el comentario como control |
| Baja | `chain_id` propuesto como dimensión custom | Evaluar cardinalidad antes de registrarlo; reservar identificadores de unión para análisis apropiado y no crear dimensión de user_id |

Fuentes: [vistas y duplicados](https://developers.google.com/analytics/devguides/collection/ga4/views), [SPA y DebugView](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications), [User-ID y logout](https://developers.google.com/analytics/devguides/collection/ga4/user-id), [eventos recomendados](https://developers.google.com/analytics/devguides/collection/ga4/reference/events), [verificación de envíos](https://developers.google.com/analytics/devguides/collection/ga4/troubleshoot).

## SEO: situación inicial y correcciones de este cambio

| Área | Hallazgo inicial | Resultado en código |
|---|---|---|
| Sitemap | `sitemap()` sin filtro, mientras changelog/paginación usan noindex | Filtro explícito y prueba que exige equivalencia con el HTML indexable |
| SPA | Cualquier ruta sin extensión recibía index.html | Inventario generado de @page y 404 para rutas desconocidas; assets sin fallback |
| Apps | Política de indexación no centralizada; robots Admisión bloqueaba algunas páginas y apuntaba al sitemap ajeno | HTML noindex, cabeceras HTML noindex, robots rastreable sin sitemap propio |
| Metadatos | Canonical armado por concatenación; og:url podía diferir de canonical; artículos añadían segundo og:type | Resolución central, canonical validado, og:url coherente, un og:type |
| JSON-LD | Identidad interpolada manualmente | Identidad y breadcrumbs serializados escapando `<`; blog usa el mismo mecanismo |
| Páginas genéricas | Legales sin h1 cuando no había PageHeader | Encabezado visible con título editorial |
| Contenido | Sin centro público de Matemáticas, teoría de la app protegida por sesión | Centro Astro y guía de pendiente; teoría privada intacta; fuentes DGEC en guías existentes |
| Descubrimiento | Recursos de Estandarizadas poco conectados | Enlaces desde producto, pie de página, centro y artículos; prueba de huérfanos |
| Rendimiento | CSS/JS de mascota cargados también en páginas sin mascota | Se cargan únicamente en portada y Admisión; imágenes existentes conservan su optimización |
| Operación | Sin comprobaciones SEO completas por publicación | Validación de HTML, rutas, scripts smoke, monitor diario y política editorial |

Las reglas CloudFront, www→apex, HTTPS y noindex de previews requieren activación en infraestructura; no se dan por aplicadas en producción. El sitemap no prueba indexación ni rankings. Los datos estructurados son parseables localmente: la elegibilidad debe verificarse con las herramientas de Google y su correspondencia con lo visible.

## Validaciones y pendientes externos

- `pnpm run check`: 0 errores y 0 advertencias (hints existentes de scripts inline).
- Build estático: 31 páginas, 27 URLs indexables; la prueba SEO verifica equivalencia sitemap/HTML, metadatos, enlaces y JSON-LD.
- Pruebas VM: rutas de los @page de ambas apps, restricciones de parámetros, redirecciones, consultas, 404 y recursos estáticos; hosting de landing y cabeceras de previews.
- `dotnet build` de Admisión y Estandarizadas con `--no-restore -m:1`: ambas compilaciones correctas, 0 errores/advertencias.
- Pruebas de workflows: 6 casos correctos; checks existentes de recursos y conversaciones correctos.
- Pruebas Chrome: preparadas para escritorio y móvil con analítica bloqueada; ejecución local impedida por `listen EPERM` en 127.0.0.1. No se afirma validación visual ni CWV de campo.
- Pendiente: ejecutar workflows con navegador, publicar/asociar funciones, verificar despliegue real y completar smoke desde una red con DNS.
- Pendiente del responsable con acceso: Search Console (propiedad dominio, sitemap procesado, canonical elegido, indexación, CWV), GA4 (Realtime/DebugView, enhanced measurement, dimensiones, conversiones e ingresos).

La secuencia de activación, responsabilidades y revisión periódica está en [la política SEO](README.md). No se realizaron compras, envío de respuestas académicas ni cambios en GA4/Search Console.

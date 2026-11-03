# Preparación para una nueva revisión de AdSense

## Estado

Se agregaron seis unidades públicas y dos centros de práctica. Son una primera versión: requieren revisión humana antes de considerarse listas. No se publicaron ni se solicitó revisión a AdSense. No hay garantía de aprobación.

## Pendientes para completar el plan

- Equipo Ubot: revisar cada enunciado, alternativa, explicación y pertinencia educativa. Las 30 preguntas ya se diversificaron con progresión dentro de cada unidad; todavía requieren revisión humana antes de anunciar el lote como terminado.
- Editorial: primera revisión de las guías y fuentes registrada en `revision-editorial-2026-11-02.md`; completar revisión humana educativa y enlaces restantes. Por decisión del responsable, se conserva el calendario y el backend sin cambios de datos; se agregó un aviso visible con enlaces oficiales.
- Editorial: metodología visible agregada en Nosotros; registrar revisión humana cuando se complete, sin inventar fechas o credenciales.
- Desarrollo: incorporar eventos consentidos de inicio/finalización y salida a apps tras verificar el consentimiento de la landing. No enviar respuestas ni información personal.
- Operación: confirmar versión en producción, rutas y rastreabilidad; validar GA4 y Search Console con acceso real. Ejecutar smoke tras publicar y comprobar nuevas rutas en CloudFront.
- Producto: registrar línea base, observar 28 días y corregir fallos. Esta ventana es interna, no un requisito de Google.
- Responsable de AdSense: reenviar únicamente tras revisión editorial y operativa; registrar versión, fecha y respuesta.

## Contrato de práctica

Colección `practices` en JSON: slug, título, producto, explicación, ejemplos y cinco preguntas. Cada pregunta declara ID, alternativas con ID y explicación y respuesta correcta. El esquema valida duplicados y referencias. Las rutas públicas son `/{product}/practica` y `/{product}/practica/{slug}`. No hay backend ni persistencia; las soluciones son públicas intencionalmente.

## Comprobación manual previa a publicar

Probar móvil, teclado y JavaScript desactivado; corregir sin seleccionar, respuestas correctas e incorrectas, reiniciar y abrir soluciones. Confirmar enlaces entre centros, unidades y apps. Verificar que elegir una alternativa no cambia otras preguntas.

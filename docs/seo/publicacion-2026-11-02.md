# Publicación y validación pendiente

## Validado localmente

Astro: 0 errores y 0 advertencias. Build: 39 páginas. SEO: 35 URLs indexables, canonical, metadatos, enlaces, sitemap y JSON-LD. Hosting: rutas y cabeceras comprobadas; artefacto generado.

Las pruebas de navegador incluyen los seis quizzes a 320, 390 y 1280 px, respuesta ausente, respuesta incorrecta, bloqueo al corregir, puntaje, reinicio, foco bajo header y contenido sin JavaScript. Solo se validó la sintaxis del script: su ejecución local falla con EPERM al abrir localhost. Chrome por pipe también queda bloqueado por restricciones de sockets. No se certifica revisión visual automatizada.

El smoke de producción falla por DNS. gh auth status informa token inválido para EddieBeru. No se hizo push ni publicación. No hay herramienta conectada a GA4/Search Console; no se confirmó acceso ni recepción de métricas. Actualización posterior: el responsable confirmó expresamente que la revisión humana concluyó positivamente. Se registra aprobación del equipo Ubot sin atribuir nombres individuales ni fecha de realización no proporcionados.

## Ejecutar desde una terminal con red y autenticación válida

Desde NewLanding, reparar la autenticación local si hace falta. Comprobar identidad efectiva antes de cualquier operación autenticada:

```bash
gh auth login --hostname github.com
gh api user --jq .login
```

El resultado debe ser exactamente `EddieBeru`. Con esa identidad confirmada:

```bash
pnpm run check
pnpm run build
pnpm run seo:check
pnpm run hosting:build
pnpm run seo:browser
git push origin main
gh run list --workflow deploy-aws.yml --limit 5
```

El push a main dispara el flujo AWS; comprobar su resultado con `gh run watch ID --exit-status`. Si la rama remota avanzó, revisar y reconciliar los cambios antes del push; no usar force. Este paquete incluye la base SEO previamente preparada, requerida por las guías y por las validaciones de publicación.

Las funciones CloudFront de rutas/cabeceras se generan pero no se asocian automáticamente por el workflow. Comprobar su asociación según docs/seo/README.md antes de considerar operativo el hosting. No cambiar políticas de las apps durante esta publicación del landing.

Tras desplegar:

```bash
python3 scripts/seo-smoke.py --landing-only
```

Abrir las dos páginas de práctica y sus seis unidades en móvil, verificar el aviso del calendario, metodología y fuentes. Mantener los datos del calendario sin cambios, según decisión del responsable.

## GA4 y Search Console

- GA4: comprobar en Realtime/DebugView una visita consentida al landing y a una práctica; verificar hostname y ruta, sin enviar datos de respuestas ni identidad personal. La landing aún tiene pendiente unificar consentimiento opt-in e instrumentar eventos específicos de inicio/finalización/salida. No interpretar el page_view como práctica completada.
- Search Console: verificar propiedad, sitemap procesado e inspeccionar portada, centros y una unidad de cada preparación. Confirmar canonical elegido y acceso al HTML. Solicitar indexación no garantiza inclusión.
- Registrar día de publicación y comparar uso en ventanas de 28 días. La revisión humana está aprobada; evaluar el sitio publicado antes de reenviar a AdSense.

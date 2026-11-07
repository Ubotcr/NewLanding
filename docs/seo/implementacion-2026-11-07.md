# Indexación y descubrimiento: 7 de noviembre de 2026

## Cambios preparados

Ambas apps mantienen una única regla noindex en HTML y cabeceras HTML. Se elimina la directiva contradictoria de Admisión y su canonical global. El sitio público presenta prácticas de ambos productos, rutas de navegación visibles con BreadcrumbList, enlaces entre guías y ejercicios y accesos a actividades existentes. Las plantillas de práctica tienen un solo elemento main. Los textos nuevos y modificados usan español neutro sin voseo. Se conserva el calendario; no se añaden guías nuevas, APIs ni eventos de analítica.

Las comprobaciones ahora cubren directivas contradictorias, HTML publicado, cabeceras, recursos estáticos, URLs alcanzables desde inicio y enlaces contextuales.

## Evidencia y límites

Pasan ocho pruebas Python de políticas/workflows de Frontend, comprobaciones Node de rutas/cabeceras, validación de ambas plantillas HTML, sincronización de rutas Razor y análisis del YAML. Los scripts Python compilan. Las pruebas de hosting de Landing pasan contra el dist existente; esto no certifica una compilación nueva.

pnpm intenta descargar dependencias y falla por DNS. Las pruebas de navegador no pueden abrir el puerto local (EPERM). Las comprobaciones públicas y la consulta local de identidad de GitHub fallan por DNS/red. Las publicaciones .NET intentadas no produjeron los archivos de salida esperados y no se consideran verificadas. Quedan pendientes el build nuevo, la revisión visual y la configuración real de producción. No se realizó commit, push ni despliegue.

## Comandos pendientes

Desde Landing, con Node 22 o superior y la versión de pnpm usada en CI:

```bash
pnpm install --frozen-lockfile
pnpm run check
pnpm run build
pnpm run seo:check
pnpm run hosting:build
pnpm run seo:browser
```

Desde Frontend:

```bash
python3 -m unittest discover -s tests/WorkflowChecks -p 'test_*.py'
node tests/SharedUiChecks/hosting-routes-checks.cjs
python3 scripts/generate-hosting-routes.py --check
dotnet publish Ubot.Admision/Ubot.Admision.csproj --configuration Release --output /tmp/ubot-seo-admision /p:UseAppHost=false
dotnet publish Ubot.Estandarizadas/Ubot.Estandarizadas.csproj --configuration Release --output /tmp/ubot-seo-estandarizadas /p:UseAppHost=false
python3 scripts/seo_policy.py /tmp/ubot-seo-admision/wwwroot/index.html /tmp/ubot-seo-estandarizadas/wwwroot/index.html
```

Ejecutar también el workflow completo de Frontend. Revisar solo los archivos y fragmentos de esta tarea al preparar commits: hay trabajo concurrente y cambios previos de documentación y calendario. Antes de cualquier operación remota autenticada, ejecutar `gh api user --jq .login` y confirmar exactamente EddieBeru. Usar exclusivamente git y gh locales.

Publicar primero Landing y después las apps. Verificar las asociaciones de las funciones CloudFront documentadas: S3 no las actualiza. Si las asociaciones existentes son correctas, esta implementación no requiere cambiar esas funciones.

Después de desplegar, desde Landing:

```bash
python3 scripts/seo-smoke.py
```

Desde Frontend:

```bash
FRONTEND_URL=https://chat.ubotcr.com python3 scripts/seo-smoke.py
FRONTEND_URL=https://estandarizadas.ubotcr.com python3 scripts/seo-smoke.py
```

Registrar fecha real y revisión publicada por repositorio. Ante fallos, corregir o restaurar la versión anterior del sitio afectado e invalidar su caché.

## Search Console

El responsable verifica la propiedad de dominio ubotcr.com y registra el sitemap existente. Antes del despliegue, guardar impresiones, clics, CTR e indexación por producto en una ventana de 28 días. Inspeccionar portada, ambos productos, centro de Matemáticas, una guía y una práctica de cada producto: HTML completo, canonical elegido y ausencia de noindex. Confirmar exclusión de apps después del nuevo rastreo.

Comparar a los 28 y 56 días de publicación considerando la temporada de admisión. Un sitemap no garantiza indexación ni posicionamiento. No se añaden eventos GA4 en esta entrega.

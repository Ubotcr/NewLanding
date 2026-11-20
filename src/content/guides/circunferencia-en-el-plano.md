---
title: "Ecuación de la circunferencia: centro, radio y traslaciones"
description: "Cómo leer (x − h)² + (y − k)² = r², identificar puntos interiores o exteriores y aplicar traslaciones en el plano cartesiano."
date: 2026-11-19
draft: false
author:
  name: "UbotCR"
sources:
  - title: "Documentos oficiales DGEC 2026"
    url: "https://dgec.mep.go.cr/pruebas-nacionales-estandarizadas/informacion-2026/documentos-2026/"
  - title: "Práctica oficial de Matemática de secundaria 2026"
    url: "https://dgec.mep.go.cr/MATEMATICAS_SECUNDARIA_20261/"
related:
  - "/estandarizadas/matematicas/pendiente-de-una-recta"
  - "/estandarizadas/matematicas"
---

En geometría analítica de secundaria, la circunferencia es uno de los temas más frecuentes. La ecuación ordinaria con centro **C(h, k)** y radio **r > 0** es:

**(x − h)² + (y − k)² = r²**

## Cómo leer centro y radio sin equivocarse de signo

Los signos dentro de los paréntesis aparecen **restados** respecto a las coordenadas del centro:

- En `(x − 3)² + (y + 2)² = 25`:
  - `h = 3` (porque es `x − 3`).
  - `k = −2` (porque `y + 2 = y − (−2)`).
  - `r = √25 = 5` (no olvides sacar la raíz cuadrada del número a la derecha).

## Ejemplo resuelto: posición de un punto respecto a la circunferencia

Dada `(x − 1)² + (y + 4)² = 16`, determiná si el punto **P(4, −1)** está en el interior, sobre la circunferencia o en el exterior.

1. Sustituí `(x, y) = (4, −1)` en el lado izquierdo:
   `(4 − 1)² + (−1 + 4)² = 3² + 3² = 9 + 9 = 18`.
2. Compará con `r² = 16`:
   - Si el resultado es **menor** que `r²`, el punto es **interior**.
   - Si es **igual** a `r²`, está **sobre** la circunferencia.
   - Si es **mayor** que `r²`, es **exterior**.

Como `18 > 16`, el punto P(4, −1) está en el **exterior** de la circunferencia.

## Traslación de una circunferencia

Cuando una circunferencia se traslada, **su radio no cambia**; únicamente se desplaza el centro `(h, k)`:

- Mover *a* unidades a la **derecha** suma *a* a `h`; a la **izquierda**, resta *a*.
- Mover *b* unidades hacia **arriba** suma *b* a `k`; hacia **abajo**, resta *b*.

Si el centro original es `(−2, 5)` y se traslada 4 unidades a la derecha y 3 hacia abajo, el nuevo centro es `(−2 + 4, 5 − 3) = (2, 2)`, y la nueva ecuación usa `(x − 2)² + (y − 2)² = r²`.

## Comprobación rápida

Si la ecuación es `(x + 5)² + y² = 9`, identificá el centro y el radio.

**Comprobación:** `y² = (y − 0)²`, así que el centro es **(−5, 0)** y el radio es **√9 = 3**.

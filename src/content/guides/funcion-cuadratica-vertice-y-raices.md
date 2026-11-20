---
title: "Función cuadrática: vértice, concavidad y discriminante"
description: "Cómo analizar f(x) = ax² + bx + c para determinar concavidad, eje de simetría, vértice y cantidad de intersecciones con el eje x."
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
  - "/estandarizadas/matematicas/funcion-lineal-e-interpretacion"
  - "/blog/matematicas-estandarizadas-como-prepararse"
---

Una función cuadrática tiene la forma **f(x) = ax² + bx + c**, con **a ≠ 0**, y su gráfica es una parábola. En las pruebas estandarizadas se evalúa sobre todo la lectura de sus elementos clave y la interpretación de máximos o mínimos en problemas reales.

## Concavidad e intersección con el eje y

- Si **a > 0**, la parábola abre hacia arriba (**cóncava hacia arriba**) y el vértice es un **mínimo**.
- Si **a < 0**, abre hacia abajo (**cóncava hacia abajo**) y el vértice es un **máximo**.
- El corte con el eje y ocurre cuando x = 0, en el punto **(0, c)**.

## Eje de simetría y vértice

El eje de simetría es la recta vertical que divide la parábola en dos mitades iguales:

**xᵥ = −b / (2a)**

Para hallar la coordenada **yᵥ** del vértice, evaluá la función en `xᵥ`: **yᵥ = f(xᵥ)**.

## Ejemplo resuelto: altura máxima de un proyectil

La altura en metros de una pelota lanzada hacia arriba está dada por **h(t) = −5t² + 20t + 1**, donde *t* es el tiempo en segundos.

1. Como `a = −5 < 0`, la parábola abre hacia abajo y el vértice representa la **altura máxima**.
2. Calculá el tiempo del máximo: `tᵥ = −20 / (2 · (−5)) = −20 / (−10) = 2 s`.
3. Evaluá `h(2)`: `h(2) = −5(2)² + 20(2) + 1 = −20 + 40 + 1 = 21 m`.

La pelota alcanza su altura máxima de **21 metros** a los **2 segundos**.

## Cantidad de cortes con el eje x usando el discriminante

El discriminante es **Δ = b² − 4ac**:

- **Δ > 0:** dos intersecciones distintas con el eje x.
- **Δ = 0:** una única intersección (el vértice toca el eje x).
- **Δ < 0:** no interseca el eje x.

## Errores que podés evitar antes de responder

- **Olvidar el signo de *b* o *a* en `−b / (2a)`:** escribí los paréntesis al sustituir negativos.
- **Confundir `xᵥ` con `yᵥ`:** si el problema pregunta *cuándo* ocurre el máximo o mínimo, te piden **xᵥ**; si pregunta *cuál es* el valor máximo o mínimo, te piden **yᵥ**.

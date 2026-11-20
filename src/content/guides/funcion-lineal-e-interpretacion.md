---
title: "Función lineal: ecuación, intersecciones e interpretación en contexto"
description: "Cómo leer f(x) = mx + b, hallar las intersecciones con los ejes y traducir problemas cotidianos de tarifas o consumo a una recta."
date: 2026-11-19
draft: false
author:
  name: "UbotCR"
sources:
  - title: "Documentos oficiales DGEC 2026"
    url: "https://dgec.mep.go.cr/pruebas-nacionales-estandarizadas/informacion-2026/documentos-2026/"
  - title: "Guía de preparación de Matemáticas de Ubot"
    url: "https://ubotcr.com/blog/matematicas-estandarizadas-como-prepararse"
related:
  - "/estandarizadas/practica/funciones-lineales"
  - "/estandarizadas/matematicas/pendiente-de-una-recta"
---

Una función lineal relaciona dos variables mediante una tasa de cambio constante. En las Pruebas Nacionales Estandarizadas suele aparecer escrita como **f(x) = mx + b**, representada en una gráfica o descrita dentro de una situación de costo, distancia o tiempo.

## Qué significa cada parámetro en f(x) = mx + b

- **m (pendiente):** indica cuánto cambia **y** por cada unidad que aumenta **x**. Si m > 0 la función es creciente; si m < 0 es decreciente; si m = 0 es constante.
- **b (intersección con el eje y):** es el valor inicial cuando x = 0. El punto de corte siempre tiene coordenadas **(0, b)**.

Para hallar la **intersección con el eje x**, igualá f(x) = 0 y despejá x: si m ≠ 0, el corte ocurre en **(−b/m, 0)**.

## Ejemplo resuelto en contexto

Un servicio de mensajería cobra ₡1 500 de tarifa base más ₡400 por cada kilómetro recorrido. Si **C(x)** es el costo total en colones para **x** kilómetros:

1. Identificá el monto fijo (cuando x = 0): **b = 1 500**.
2. Identificá el cambio por kilómetro: **m = 400**.
3. Escribí el modelo: **C(x) = 400x + 1 500**.

Si un envío recorre 12 km, el costo es C(12) = 400(12) + 1 500 = 4 800 + 1 500 = **₡6 300**. Si el cliente pagó ₡4 300, resolvés 400x + 1 500 = 4 300 → 400x = 2 800 → **x = 7 km**.

## Cómo encontrar la ecuación a partir de una gráfica o tabla

Si te dan dos puntos, por ejemplo **(2, 7)** y **(5, 16)**:

1. Calculá la pendiente: m = (16 − 7) / (5 − 2) = 9 / 3 = **3**.
2. Sustituí uno de los puntos en y = mx + b para hallar b: 7 = 3(2) + b → **b = 1**.
3. Comprobá con el otro punto: 3(5) + 1 = 16. La función es **f(x) = 3x + 1**.

## Errores frecuentes que conviene revisar

- **Invertir m y b al leer un enunciado:** el valor que se multiplica por la variable ("por cada hora", "por kilómetro") es la pendiente **m**; el cargo único o inicial es **b**.
- **Confundir las coordenadas de los cortes:** el corte con el eje y siempre empieza en 0: `(0, b)`. El corte con el eje x termina en 0: `(x, 0)`.

## Practica este tema

Poné a prueba la lectura de pendiente, cortes y modelos lineales en la [práctica sin cuenta de funciones lineales](/estandarizadas/practica/funciones-lineales).

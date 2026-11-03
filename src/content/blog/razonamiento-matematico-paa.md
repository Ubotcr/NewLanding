---
title: "Razonamiento matemático PAA: las 3 categorías con ejercicios resueltos"
meta_title: "Razonamiento matemático PAA 2026: categorías, estrategias y ejercicios resueltos"
description: "Resolución de problemas, razonamiento deductivo-inductivo y razonamiento con figuras: qué evalúa cada categoría de la PAA y cómo entrenarla con ejercicios originales resueltos."
updated: 2026-11-02
date: 2026-09-26T10:00:00Z
sources:
  - title: "Programa PAA — UCR"
    url: "https://www.paa.iip.ucr.ac.cr/"
image: "/images/promo/funcionesPreguntaChat.png"
category: "Guías"
featured: false
draft: false
author:
  name: "Eddie Bermúdez"
  designation: "Desarrollador del Frontend & Landing"
---

En esta guía practicamos **razonamiento con números, deducciones y figuras**. Los ejemplos son originales de Ubot, no ítems oficiales ni una distribución confirmada del examen. Acá va cada una con su técnica y ejercicios originales resueltos.

## 1. Resolución de problemas (la categoría más grande)

Te dan una situación cotidiana con números y tenés que traducirla a operaciones. Un error que conviene evitar es **plantear mal**. Regla de oro: escribí el planteo antes de operar, aunque sea feo.

**Ejercicio 1.** *En una soda, un casado cuesta ₡500 más que un fresco. Si 2 casados y 3 frescos cuestan ₡7.000, ¿cuánto cuesta un fresco?*

> Planteo: sea `x` el fresco. Casado = `x + 500`. Entonces `2(x + 500) + 3x = 7000` → `5x = 6000` → **x = ₡1.200**. Verificación: 2×1700 + 3×1200 = 3400 + 3600 = 7000. ✓

**Ejercicio 2.** *Un bus sale cada 12 minutos y otro cada 18. Si acaban de salir juntos, ¿en cuántos minutos vuelven a coincidir?*

> Es el mínimo común múltiplo: 12 = 2²×3, 18 = 2×3² → mcm = 2²×3² = **36 minutos**. Si lo hiciste sumando de 12 en 12 hasta dar con múltiplo de 18, también vale — en examen manda llegar, no el método elegante.

**Ejercicio 3.** *En un grupo de 40 estudiantes, 25 llevan mate y 22 llevan química. Si todos llevan al menos una de las dos, ¿cuántos llevan ambas?*

> Los que llevan al menos una son 25 + 22 = 47 "cupos" para 40 personas → el exceso es la intersección: 47 − 40 = **7**. Este es el principio de inclusión-exclusión disfrazado de problema de cole: dibujar los dos círculos que se traslapan lo vuelve obvio.

**Ejercicio 4.** *Un gráfico de barras muestra las ventas de una soda de lunes a viernes: 20, 35, 30, 45, 50 (en miles). ¿Qué día vendió más del doble que el lunes?*

> Doble del lunes = 40. Días sobre 40: jueves (45) y viernes (50). Respuesta: **jueves y viernes**. La trampa sería marcar solo el viernes (el máximo) sin leer que preguntan por una condición, no por el máximo.

**Técnicas que pagan:** probar con números chicos, hacer tabla de casos, dibujar el problema, verificar con la respuesta (sustituir opciones). Y leer gráficos con calma: ejes, unidades y qué mide cada barra antes de calcular nada.

## 2. Razonamiento deductivo e inductivo

**Deductivo:** de lo general a lo particular. Si las premisas son ciertas y la lógica es válida, la conclusión es segura. La trampa típica es una conclusión que "suena razonable" pero no se deduce:

> *Todos los becados mantienen promedio alto. Ana tiene promedio alto. ¿Ana es becada?* **No se deduce**: el promedio alto es necesario pero las premisas no dicen que sea suficiente. Marcar "sí" es el error clásico.

**Inductivo:** de casos particulares al patrón. Series numéricas, secuencias, reglas escondidas:

> *3, 6, 11, 18, 27, ...* Diferencias: 3, 5, 7, 9 → crecen de 2 en 2 → siguiente salto 11 → **38**.

> *5, 11, 23, 47, ...* Cada término es el anterior ×2 +1 → siguiente: **95**.

**Técnicas que pagan:** en series, probá en orden: diferencias, cocientes, alternancia (dos series entrelazadas), operaciones con el anterior. En deducción, separá "lo que me dicen" de "lo que estoy asumiendo".

**Ejercicio 5.** *2, 6, 12, 20, 30, ...* Diferencias: 4, 6, 8, 10 → crecen de 2 en 2 → siguiente salto 12 → **42**. (Pista: son `n(n+1)`: 1×2, 2×3, 3×4... pero no necesitás la fórmula si ves las diferencias.)

**Ejercicio 6.** *Hay cinco sillas numeradas. Bruno ocupa la silla 2. Ana no puede ocupar un extremo ni sentarse junto a Bruno. ¿Dónde puede sentarse?*

> Sin extremos quedan 2, 3 y 4. La 2 está ocupada y la 3 queda junto a Bruno. Solo queda la **silla 4**.

## 3. Razonamiento con figuras

Secuencias donde los elementos rotan, se mueven, aparecen o desaparecen. La técnica madre: **describí el cambio en palabras** antes de mirar opciones (posición, cantidad, tamaño, sombreado, orientación). Si no podés decir qué cambió, todavía no lo viste.

> Ejemplo mental: un triángulo que en cada paso rota 90° y alterna relleno/vacío. Preguntate: ¿dónde apunta? ¿está lleno? Esas dos respuestas eliminan 3 de 4 opciones sin "adivinar".

**Técnicas que pagan:** buscar qué se conserva (el elemento que no cambia suele ser distractor), contar (vértices, intersecciones, regiones), y partir la figura compleja en dos patrones simples superpuestos.

## Errores de mate que cuestan doble

1. **Operar antes de plantear.** Un planteamiento incorrecto puede arruinar una cuenta correcta. Escribí la ecuación primero.
2. **Ignorar las opciones.** A veces sustituir las 4 opciones es más rápido que resolver: probá cada una en la ecuación y la que cuadre gana.
3. **Redondear a medio camino.** Guardá los decimales hasta el final; redondear antes cambia la respuesta en ítems ajustados.
4. **No verificar.** Si te queda tiempo al final, usalo para re-sustituir tu respuesta en el enunciado, no para empezar ítems nuevos.

## Cómo repartir tu tiempo de práctica

Si tu [diagnóstico](/blog/examen-diagnostico-admision-gratis) dice que figuras es tu hueco, no estudies "matemática": estudiá figuras, más tiempo a ese tipo de ejercicio y comprobá si mejorás. El entrenamiento por categoría rinde más que repasar temas de colegio, porque la PAA no evalúa temario: evalúa estos tres movimientos mentales.

## Plan completo y práctica real

Estas actividades son una selección de repaso. El resto (verbal, estrategia general, calendario) está en nuestra [guía PAA](/blog/como-prepararse-paa). Y la única forma de fijar estas técnicas es con repeticiones cronometradas: en [Ubot](https://chat.ubotcr.com) practicás gratis con formato real y explicación inmediata de cada error.

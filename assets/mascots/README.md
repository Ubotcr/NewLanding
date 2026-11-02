# Ubit con libros

Ilustración original aportada por el equipo: `Ubot con libros Final.png`,
copiada sin cambios como `ubit-books-original.png` (2048 × 2048, RGBA).
No se generó con IA ni se alteraron sus colores o elementos.

Con Python y Pillow instalados, ejecutar desde la raíz de este repositorio:

```sh
python3 scripts/build-ubit-books.py
```

El script recorta únicamente el margen transparente y genera
`src/assets/ubit-books.webp` a calidad 90. Astro produce las variantes de
160 y 320 px durante el build para la ilustración encima de «Simulacros
especiales». El hero conserva su rig animado. El original queda fuera de `public`
y no se descarga en el sitio.

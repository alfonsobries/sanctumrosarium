# Task 036 - Imagen del misterio

## Objetivo

Arte sacro a pantalla completa mientras se reza, con su ficha a un toque.

## Dependencias

- Task 003, 007

## Contexto

RVM 29 recomienda contemplar una imagen del misterio (compositio loci). Contemplatio vive
de esto. La 003 cura las obras; esta task las presenta.

La decisión 9 manda dominio público de museos abiertos, no ilustración generada.

## Qué construir

### 1. Pantalla completa

La obra ocupa el fondo o la mitad superior. El misterio (título) sigue visible. El texto
de la oración no desaparece: se puede atenuar, no quitar.

### 2. Ficha

Autor, año, museo, licencia. Un toque la abre; no estorba el rezo.

### 3. Sin hueco

Mientras carga, el contenedor ya tiene color y proporción. Si falla, se queda el color y
el título, no un recuadro roto.

## Criterios de éxito

1. Los veinte misterios tienen imagen de dominio público con ficha.
2. Ninguna foto de museos vaticanos.
3. El misterio sigue legible sobre la imagen, en claro y en oscuro.
4. Apagar las imágenes deja el rezo igual de usable.

## Decisiones tomadas (primera pasada, agosto 2026)

- Veinte obras de dominio público (PD-Art o CC0), una por misterio, fichas en
  `packages/content/src/mysteries/artwork.ts` y archivos en `packages/content/art/`.
  Ninguna foto de Museos Vaticanos. Ninguna ilustración generada.
- En el rezo la obra ocupa la mitad superior; el título queda sobre ella. Un toque abre la
  ficha (autor, año, museo, licencia). Apagar las imágenes en Ajustes deja el rezo igual.
- El sitio muestra las mismas obras y fichas.
- **Reloj**: el título del misterio ya ocupa la pantalla; no se embebe la miniatura (peso
  del target). La ficha no cabe.

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - las fichas viven junto a la obra
- [x] App
- [x] ~~Reloj - n/a: el título basta; la miniatura inflaría el target~~
- [x] ~~Audio - n/a~~
- [x] Accesibilidad - la imagen tiene texto alternativo; nada depende solo de ella
- [x] Sitio - las mismas obras y fichas

## Fuentes

- RVM 29; decisión 9;
  [`../referencias/tecnica/sitio-y-licencias.md`](../referencias/tecnica/sitio-y-licencias.md)

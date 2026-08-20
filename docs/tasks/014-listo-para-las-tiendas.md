# Task 014 - Listo para las tiendas

## Objetivo

Publicar: icono, láminas, textos de ficha, privacidad, y el proceso de compilar y subir.

## Dependencias

- Todas las de la fase 1

## Contexto

La ficha de la tienda es donde se decide si alguien la instala. En este nicho las apps
mueren por abandono y por bugs, así que la ficha promete poco y cumple: el Rosario
completo, gratis, sin anuncios, sin cuenta, offline.

El nombre es SanctaMaria (`sanctamaria.app`). La identidad (decisión 2 de
[`../DECISIONES.md`](../DECISIONES.md)) y la cuenta de publicación (decisión 15) bloquean
esta task.

## Qué construir

### 1. Identidad de la app

Icono en todas sus variantes, pantalla de arranque, nombre corto para la pantalla de
inicio.

### 2. Láminas

Capturas reales de la app, generadas de forma reproducible, no a mano. Lo que se enseña:
rezar con texto y audio, el misterio a pantalla completa, el reloj (cuando exista), el
latín, los ajustes.

### 3. Ficha

Título, subtítulo, descripción y palabras clave en español e inglés. Sin superlativos y
sin prometer efectos espirituales.

### 4. Privacidad

Declaración de recopilación de datos: ninguno. Aviso de privacidad enlazado desde la app y
el sitio.

### 5. Publicación

Compilar y subir con un comando documentado, y notas de versión escritas.

## Criterios de éxito

1. La app se compila y se sube con el proceso documentado, reproducible desde cero.
2. Las láminas se regeneran con un comando; no hay capturas hechas a mano en el
   repositorio.
3. La ficha existe en español e inglés y no promete nada que la app no haga.
4. La declaración de privacidad dice la verdad: no se recoge nada.
5. La app pasa revisión sin observaciones de contenido.

## Decisiones tomadas (primera pasada, agosto 2026)

- Iconos y splash ya salen de `pnpm icons:generate`. El nombre corto es SanctaMaria.
- La ficha vive en `docs/store/listing-es.md` y `listing-en.md`. No promete gracia ni
  llama a la app "la mejor".
- Las láminas se regeneran con `pnpm store:screenshots` (Maestro). No se commitean.
- Privacidad: el sitio ya la dice; Ajustes abre esa página.
- **No se sube todavía.** La cuenta de publicación (decisión 15) y el cierre de la
  identidad (decisión 2) siguen abiertos. Los comandos `pnpm ios:release` /
  `android:release` ya existen.

## Ciclo completo

- [x] Definir qué aplica
- [x] ~~Contenido y motor - n/a~~
- [x] App - ficha, privacidad, comando de láminas
- [ ] Reloj - si el reloj ya existe, entra en las láminas
- [x] ~~Audio - n/a~~
- [x] ~~Accesibilidad - n/a: se cerró en la 012~~
- [x] Sitio - privacidad ya publicada; los enlaces de tienda esperan al envío

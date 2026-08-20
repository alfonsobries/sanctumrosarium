# Task 045 - Coronilla y Siete Dolores

## Objetivo

La Coronilla de la Divina Misericordia y la Corona de los Siete Dolores, cada una con su
nombre y su contador, nunca mezcladas con el Rosario.

## Dependencias

- Task 005

## Contexto

El Directorio (DPPL 202) pide no rebajar "otras coronas marianas, también aprobadas". La
Coronilla usa las cuentas del rosario y oraciones distintas (Faustina, 1935; indulgencia
2002). Los Siete Dolores son siete septenas, no cinco decenas.

Si se mezclan los contadores, la app miente y confunde indulgencias.

## Qué construir

### 1. Dos devociones

Entradas propias, secuencias propias, diario propio.

### 2. Textos

De fuentes citables (diario de santa Faustina / sede de los servitas o un devocionario con
imprimatur). Sin fuente, no entran.

### 3. Cuentas

Se pueden rezar en las mismas cuentas físicas. La app no las llama Rosario.

## Criterios de éxito

1. Ninguna de las dos aparece como "otro tipo de Rosario".
2. El diario no suma una coronilla a los rosarios del mes.
3. Las rosas del mes no se llenan con estas devociones.
4. Tests cubren: secuencias distintas, registros distintos, y que la Regla del Rosario no
   las cuenta.

## Decisiones tomadas (primera pasada, agosto 2026)

- Crítica litúrgica previa: C.6 trae elipses, no textos. No se completa de memoria el
  diario de Faustina ni se enumeran los siete dolores. Como en la novena: la app nombra la
  estructura, cita la fuente, y el texto se reza del devocionario.
- Diario: `kind: 'chaplet' | 'seven-sorrows'`, `decades: 0`. `between` y las rosas solo
  ven `kind = 'rosary'`. Un recuento malicioso de 50 decenas en una coronilla no mueve la
  Regla.
- La Coronilla se llama coronilla, nunca Rosario. Los Siete Dolores, corona. La
  indulgencia de 2002 no se describe: no está el decreto.
- Audio, rezo paso a paso y reloj: cuando haya edición citable con permiso.

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - sin textos nuevos; el diario ya distingue
- [x] App
- [ ] Reloj - cuando haya texto citable
- [ ] Audio - cuando haya texto citable
- [x] Accesibilidad - pantalla de prosa y un botón
- [x] Sitio - una ficha por devoción, con su origen

## Fuentes

- Dossier C.6; DPPL 202

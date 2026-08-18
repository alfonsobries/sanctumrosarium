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

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App
- [ ] Reloj - si sirven para rezar sin leer, sí
- [ ] Audio
- [ ] Accesibilidad
- [ ] Sitio - una ficha por devoción, con su origen

## Fuentes

- Dossier C.6; DPPL 202

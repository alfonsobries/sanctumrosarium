# Task 023 - Texto bilingüe

## Objetivo

Ver el latín y la lengua propia a la vez, línea a línea, mientras se reza.

## Dependencias

- Task 021, 007

## Contexto

Quien está aprendiendo el latín no puede saltar de un idioma a otro entre pantallas. El
mercado no ofrece esto: hay texto latino en varias apps y audio en una, y en ninguna las
dos lenguas alineadas.

Las líneas ya existen por idioma en el paquete de contenido. Esta task no traduce:
empareja lo que ya está escrito.

## Qué construir

### 1. Alineación

Cada línea latina junto a su pareja en español o en inglés. Si el corte no coincide, se
ajusta el `lines` del contenido, no se inventa texto.

### 2. En el rezo

Un ajuste: solo latín, solo lengua propia, o las dos. El valor por defecto para quien reza
en latín y no lo sabe es las dos.

### 3. Letanías

Las invocaciones también se alinean. Son el caso más largo y el que más se necesita.

## Criterios de éxito

1. Ave, Padrenuestro, Gloria, Salve y letanías se leen en las dos lenguas sin perder el
   sitio.
2. Cambiar el ajuste no reinicia el Rosario.
3. Con la fuente del sistema al máximo, las dos columnas siguen siendo legibles.
4. Tests cubren: cada oración esencial tiene el mismo número de líneas en latín y en la
   lengua propia, o un mapa explícito cuando no.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor - solo si hay que rehacer un corte de líneas
- [ ] App
- [ ] ~~Reloj - n/a: en el reloj no se lee~~
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad - el lector anuncia una lengua por vez, no las dos a la vez
- [ ] Sitio - la guía del latín muestra un ejemplo alineado

## Fuentes

- Dossier, C.4

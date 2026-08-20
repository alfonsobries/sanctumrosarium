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

## Decisiones tomadas (primera pasada, agosto 2026)

- **Alineación por mapa, no recortando líneas**: los cortes existentes se respetan (el
  audio ya está generado contra ellos) y `latinLineMap` en el paquete de contenido dice
  qué línea responde a cuál en las siete oraciones donde el corte difiere. Un test
  verifica que toda oración latina alinea con es-MX, es-ES y en-US, con mapa monótono o
  cuentas iguales.
- **La lengua compañera es la del sistema**, no la elegida para rezar: quien reza en latín
  ve su propia lengua debajo.
- **Tres modos**: latín y tu lengua (default), solo latín, solo tu lengua. La sección solo
  aparece en Ajustes cuando el rezo está en latín. El ajuste se lee en vivo: cambiarlo no
  toca la sesión.
- **Letanías**: llegan con la task 043; su alineación usará el mismo mapa.
- **Ejemplo alineado en el sitio**: queda con la task 024 (aprender el latín).
- La revisión por alguien que sabe latín (criterio 2 de la task 021) sigue pendiente y es
  humana.

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - mapa de alineación con test; ningún texto tocado
- [x] App
- [x] ~~Reloj - n/a: en el reloj no se lee~~
- [x] ~~Audio - n/a~~
- [ ] Accesibilidad - el lector anuncia una lengua por vez; verificación en aparato
      pendiente
- [ ] Sitio - el ejemplo alineado va con la task 024

## Fuentes

- Dossier, C.4

# Task 038 - Salud

## Objetivo

Escribir la duración del rezo como sesión de atención plena, y leer corazón y variabilidad
solo desde el reloj, con permiso.

## Dependencias

- Task 018

## Contexto

Headspace, Calm e Insight Timer escriben duración de sesión y nada más. Ese es el listón.
El iPhone no tiene sensor cardiaco: presentar una estimación por cámara como "tu
frecuencia al rezar" sería la pseudociencia que este producto evita.

La librería viva es `@kingstinct/react-native-healthkit`. En Android, Health Connect sigue
experimental para este tipo de sesión.

## Qué construir

### 1. Sesión de atención plena

Duración del Rosario, si el usuario lo permite. Se pide el permiso en el momento, con una
línea de para qué.

### 2. Corazón y variabilidad

Solo desde el reloj, durante una sesión de ejercicio o de atención. Se muestran como
hechos al terminar, nunca como nota de la oración.

### 3. Lo que no se hace

No se infiere recogimiento a partir del pulso. No se escribe nada en Salud sin preguntar.
Si hay otra sesión de ejercicio en curso, no se roba.

## Criterios de éxito

1. Sin permiso, el Rosario funciona igual.
2. Lo que se escribe en Salud es duración, no "calidad de oración".
3. En un iPhone sin reloj no aparece ninguna cifra cardiaca.
4. La pantalla pasa las cinco preguntas de `docs/gamificacion.md`.

## Decisiones tomadas (primera pasada, agosto 2026)

- Ajuste apagado por defecto. El permiso se pide al encenderlo, nunca a mitad del rezo.
  Sin permiso el Rosario no cambia.
- Lo que se escribe en Salud es solo la duración, como sesión de atención plena
  (`mindfulSession`). No hay pulso en el iPhone. Android (Health Connect) queda fuera: la
  spec lo marca experimental.
- Corazón y variabilidad desde el reloj, y la sesión de ejercicio que mantiene el
  always-on: siguiente pasada (018).

## Ciclo completo

- [x] Definir qué aplica
- [x] ~~Contenido y motor - n/a~~
- [x] App - el permiso y el ajuste
- [ ] Reloj - pulso y sesión de ejercicio (bloque del reloj / 018)
- [x] ~~Audio - n/a~~
- [x] Accesibilidad - el ajuste es un interruptor con descripción; el rezo no depende de
      él
- [x] ~~Sitio - n/a~~

## Fuentes

- [`../referencias/tecnica/stack.md`](../referencias/tecnica/stack.md) (Salud);
  [`../referencias/tecnica/apple-watch.md`](../referencias/tecnica/apple-watch.md)

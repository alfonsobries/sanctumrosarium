# Task 044 - Novena de 54 días

## Objetivo

La novena de Pompeya con su propia estructura y su propio contador.

## Dependencias

- Task 026

## Contexto

Cincuenta y cuatro días seguidos de un Rosario de cinco decenas: 27 en petición y 27 en
acción de gracias, rotando gozosos, dolorosos y gloriosos. Los luminosos no entran en el
esquema original; añadirlos como cuarto día rompe el 27 = 3 × 9.

Es devoción privada aprobada, no litúrgica. La indulgencia es la del Rosario, no una
propia. Los textos de las oraciones de petición y de gracias están en el dossier como
pendiente de transcribir: no se escriben de memoria.

## Qué construir

### 1. El recorrido

54 casillas, en dos mitades. Cada día propone el ciclo que toca. Se puede rezar el Rosario
del día por fuera y marcarlo, o empezarlo desde aquí.

### 2. Contador propio

No son rosas del mes ni días de la Regla, aunque el Rosario de ese día sí cuenta para la
Regla si se rezó.

### 3. Huecos

Faltar un día no reinicia los 54 en drama. Se retoma. Una línea dice que la costumbre es
continua, no que se "rompió la novena".

## Criterios de éxito

1. 27 + 27, sin luminosos en el esquema.
2. Las oraciones propias están transcritas de una fuente citada (rosarycenter / EWTN).
3. No hay lenguaje de "novena contestada".
4. La pantalla pasa las cinco preguntas de `docs/gamificacion.md`.

## Decisiones abiertas

- Qué hacer si alguien quiere incluir luminosos. Recomendación: no en este esquema. Que
  rece el Rosario luminoso aparte.

## Decisiones tomadas (primera pasada, agosto 2026)

- **El recorrido**: 54 casillas en dos mitades (petición y acción de gracias), rotando
  gozosos, dolorosos y gloriosos; el ciclo vive en el motor con sus tests (27 = 3 x 9,
  nunca luminosos). "Rezar el Rosario de hoy" abre el rezo con los misterios del ciclo,
  aunque el día de la semana pida otros.
- **Contador propio en el diario** (tablas `novena_runs` y `novena_days`, migración v7):
  la casilla se llena al rezar desde aquí o al marcar "Contar el de hoy" si se rezó por
  fuera. La última marca se puede quitar. El Rosario de ese día sigue contando para la
  Regla, y la novena no toca rosas ni fidelidad.
- **Huecos sin drama**: faltar días no reinicia nada; la siguiente casilla espera y la
  pantalla lo dice ("se retoma donde ibas"). "Dejar la novena" cierra el recorrido sin
  pregunta ni reproche.
- **Las oraciones propias quedan pendientes con razón**: la spec pedía transcribirlas de
  rosarycenter.org o EWTN y ninguna de las dos las publica hoy; las versiones en otros
  sitios difieren entre sí y no hay fuente española verificada. Sin fuente citable no
  entran (regla del proyecto): se reza el Rosario de siempre, ofrecido en petición o en
  gracias.
- Los luminosos: fuera del esquema, como recomienda la spec; el copy lo dice y ofrece
  rezarlos aparte.

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - ciclo en el motor con tests
- [x] App
- [x] ~~Reloj - n/a: el recorrido se mira en el teléfono~~
- [ ] Audio - n/a mientras las oraciones propias no tengan fuente
- [x] Accesibilidad - la cuadrícula anuncia su avance en texto; botones estándar
- [ ] Sitio - mención en la escuela cuando las oraciones tengan fuente

## Fuentes

- Dossier C.6 (novena de 54 días); rosarycenter.org / EWTN para los textos, cuando se
  transcriban

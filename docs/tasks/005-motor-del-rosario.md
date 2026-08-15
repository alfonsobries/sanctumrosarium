# Task 005 - Motor del Rosario

## Objetivo

Crear `packages/engine`: dado un idioma, una región, un día y unos ajustes, produce la
secuencia completa de pasos del Rosario, y lleva el estado de una sesión de rezo. Lógica
pura, sin interfaz.

## Dependencias

- Task 001, 002, 003, 004

## Contexto

La app, el reloj y el sitio pintan lo mismo: una lista de pasos. Si esa lista se calcula
en cada superficie, se desincronizan y aparecen los bugs que el nicho castiga. El motor es
la única fuente.

Lo que el motor debe respetar, del dossier:

- Lo esencial es misterio, Padrenuestro, diez Avemarías y Gloria (MC 49). Eso nunca es
  opcional.
- Todo lo demás es marco regional y configurable (RVM 37).
- Se puede rezar por partes: el estado se guarda y se retoma (Montfort, Rosa 45), con la
  nota de que la indulgencia plenaria pide cinco decenas seguidas.

## Qué construir

### 1. Generación de la secuencia

Función pura que devuelve la lista de pasos. Cada paso tiene: tipo (señal, oración,
anuncio de misterio, lectura, silencio, cuenta), qué oración, qué misterio, en qué idioma,
si es opcional, y en qué posición de la decena va.

Entradas: forma regional, idioma, ciclo de misterios, y ajustes (oración de Fátima sí o
no, letanías sí o no, cláusulas sí o no, lectura de la Palabra sí o no, silencio en
segundos).

### 2. Estado de la sesión

- Avanzar, retroceder, saltar al siguiente misterio, ir a una decena concreta.
- Progreso: cuenta actual, decena actual, cuántas Avemarías van, porcentaje del total.
- Pausar y retomar, incluso días después.
- Terminar: qué se rezó, cuánto duró, en qué idioma, con qué intención.

### 3. Serialización

El estado se guarda y se restaura entre sesiones y entre dispositivos (el reloj y el
teléfono comparten la misma forma). Cambiar de versión de la app no debe romper una sesión
guardada.

### 4. Sin dependencias

El motor no importa React, ni nada de Expo, ni de Astro. Se prueba con `vitest` y corre en
cualquier parte.

## Criterios de éxito

1. Para cada forma regional, la secuencia generada coincide con el rezo real de esa
   región, paso a paso, verificado contra la fuente.
2. Un Rosario de cinco decenas tiene exactamente 53 Avemarías con las tres iniciales, o 50
   sin ellas, según la forma.
3. Los ajustes cambian la secuencia sin tocar lo esencial: quitar la oración de Fátima no
   altera Padrenuestro, Avemarías ni Gloria.
4. El estado se guarda y se retoma en la cuenta exacta, incluso tras cerrar la app.
5. El Rosario completo de veinte misterios funciona con la misma máquina.
6. Tests cubren: cada forma regional paso a paso, conteo de Avemarías, todos los ajustes,
   retomar desde cada tipo de paso, y una prueba que compara la secuencia contra un
   archivo de referencia escrito a mano para la forma mexicana.

## Decisiones abiertas

- Si el motor decide los tiempos (cuánto dura cada paso sin audio) o eso vive en la capa
  de reproducción. Recomendación: el motor propone una duración por paso y la capa de
  audio manda cuando hay audio.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] ~~App - n/a: la consume la 007~~
- [ ] ~~Reloj - n/a: lo consume la 016~~
- [ ] ~~Audio - n/a: task 008~~
- [ ] ~~Accesibilidad - n/a: sin interfaz~~
- [ ] ~~Sitio - n/a~~

## Fuentes

- Dossier, C.1 (estructura), C.2 (variantes regionales), C.5 (rezar por partes)
- MC 49; RVM 37 y 38; Enchiridion Indulgentiarum, concesión 17

## Primera pasada (agosto 2026)

Hecho:

- Generación de la secuencia en `packages/engine/src/sequence.ts` para las cuatro formas,
  con ajustes (oraciones opcionales, letanías, lectura, silencio) y Rosario completo de
  veinte misterios.
- Estado de sesión en `src/session.ts`: avanzar, retroceder, saltar a una decena,
  progreso, serializar y registro final.
- 38 pruebas, incluidas las que cuentan las Avemarías (53 en la forma romana, 50 en la
  dominicana, 203 en el Rosario completo) y las que comprueban que lo esencial nunca
  desaparece.

Pendiente:

- Duración propuesta por paso.
- Comparación de la secuencia contra un archivo de referencia escrito a mano para la forma
  mexicana: hoy las pruebas verifican piezas, no la secuencia entera.

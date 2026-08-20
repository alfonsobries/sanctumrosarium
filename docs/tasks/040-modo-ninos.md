# Task 040 - Modo niños

## Objetivo

Una decena suelta, con menos texto e imágenes grandes, para rezar con niños.

## Dependencias

- Task 007, 030

## Contexto

RVM 42 pide rezar el Rosario con los hijos desde pequeños, "no es ciertamente la solución
de todos los problemas, pero es una ayuda espiritual que no se debe minimizar". Una decena
es una Regla válida (task 025) y una práctica que Montfort acepta (Rosa 45).

No es un juego ni un personaje. Es el mismo Rosario, más corto y más visible.

## Qué construir

### 1. Una decena

Se puede rezar una sola, con su misterio, y cuenta para la Regla que mida decenas.

### 2. Menos texto

El Ave no desaparece. Se acorta lo que rodea: menos notas, imagen más grande, cuenta más
clara.

### 3. Sin culpa

Terminar una decena no pide las otras cuatro. La nota de la indulgencia (task 030) no
aparece aquí: sobra y asusta.

## Criterios de éxito

1. Un niño que no lee bien puede seguir el misterio y la cuenta.
2. No hay puntos, estrellas ni "¡muy bien!".
3. La decena queda en el diario como decena, no como Rosario incompleto.
4. El copy pasa el skill `voz`.

## Decisiones tomadas (primera pasada, agosto 2026)

- No se llama "modo niños" en pantalla: es **Una decena** / **One decade**. El mismo
  Rosario, más corto. El misterio es el primero del grupo de hoy.
- El motor acepta `decadeCount: 1`. El diario cuenta una decena terminada, no un Rosario a
  medias. La nota de la indulgencia no aparece.
- Las cuentas se agrandan. El audio usa el ritmo que ya esté puesto (calma, si se eligió).
- El reloj, cuando exista, reza también una decena suelta (015-016).

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - `decadeCount`
- [x] App
- [ ] Reloj - una decena suelta es un caso principal (bloque del reloj)
- [x] Audio - el ritmo existente, sin modo rápido
- [x] Accesibilidad - la cuenta se oye en el caption; las cuentas son decorativas
- [x] ~~Sitio - n/a~~

## Fuentes

- RVM 42; Montfort Rosa 45; dossier C.5.6

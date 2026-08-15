# Task 028 - Intenciones

## Objetivo

Poder decir por quién se ofrece el Rosario, y recordarlo.

## Dependencias

- Task 007

## Contexto

Ofrecer la oración por una intención es parte del rezo desde siempre (Montfort recomienda
pedir una gracia concreta en cada decena). Lo que no se hace es convertirlo en una lista
de peticiones con resultados: eso vuelve la oración una transacción.

La regla, de [`../gamificacion.md`](../gamificacion.md) sección 5: **historial de
intenciones, nunca de respuestas.**

## Qué construir

### 1. Antes de empezar

Preguntar por quién se ofrece: texto libre, o una intención guardada. Se puede saltar en
un toque.

### 2. Durante

La intención está a la vista donde no estorbe.

### 3. Al terminar

Se recuerda en la línea de cierre: "ofrecido por tu madre".

### 4. Intenciones guardadas

Las que se repiten se guardan y se reutilizan. Se pueden borrar.

### 5. Historial

Por quién se ha rezado y cuántas veces. **Sin** casillas de "contestada", sin resultados,
sin fechas de cumplimiento.

### 6. Privacidad

Las intenciones se quedan en el dispositivo. Son lo más íntimo que guarda la app.

## Criterios de éxito

1. Se puede empezar sin intención, en un toque.
2. La intención aparece al terminar y en el historial.
3. Las intenciones guardadas se reutilizan y se borran.
4. No existe en ninguna parte la idea de intención "cumplida" o "contestada".
5. Las intenciones no salen del dispositivo, verificado en el código.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor - el motor ya guarda la intención en la sesión
- [ ] App
- [ ] Reloj - se puede rezar por la última intención; escribir una nueva es del teléfono
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad
- [ ] ~~Sitio - n/a~~

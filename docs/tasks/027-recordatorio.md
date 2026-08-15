# Task 027 - Recordatorio

## Objetivo

Un aviso al día, a la hora que el usuario elija, con el texto más plano posible.

## Dependencias

- Task 006

## Contexto

Lo que el nicho hace mal es evidente en las reseñas: notificaciones que insisten, que
juegan con la culpa, o que no dejan elegir los días. Y lo que la crítica agradece de una
app grande es precisamente que **no** bombardee.

El modelo tradicional es el Ángelus: tres horas fijas, todos los días, sin drama.

## Qué construir

### 1. Un recordatorio

Hora elegida por el usuario, o el modelo del Ángelus (seis, doce y dieciocho). Días de la
semana configurables.

### 2. El texto

"Es la hora del Rosario." Nada más. Sin signos de exclamación, sin nombre del usuario, sin
cifras.

### 3. Lo que nunca se envía

- Avisos de racha o de pérdida.
- Segundos avisos el mismo día.
- Mensajes que mencionen cuántos días lleva sin rezar.
- Novedades del producto por notificación.

### 4. Permiso

Se pide cuando el usuario activa el recordatorio, no al abrir la app por primera vez.

## Criterios de éxito

1. El recordatorio llega a la hora elegida, incluso sin abrir la app.
2. Solo hay un aviso por día.
3. El permiso se pide en el momento en que se activa.
4. Ninguna otra parte de la app envía notificaciones.
5. Tests cubren: programación, cambio de hora, días desactivados, cambio de zona horaria.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a~~
- [ ] App
- [ ] Reloj - el aviso llega también a la muñeca, sin duplicarse
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad
- [ ] ~~Sitio - n/a~~

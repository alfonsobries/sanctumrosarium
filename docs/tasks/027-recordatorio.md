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

## Decisiones tomadas (primera pasada, agosto 2026)

- **Tres modos**: apagado, a una hora (selector nativo) o el Ángelus (6, 12 y 18). Días de
  la semana configurables con la semana empezando en lunes.
- **El texto es exactamente el de la spec** ("Es la hora del Rosario." / "It is the hour
  of the Rosary."), programado en el idioma de la interfaz y reprogramado si cambia.
- **Un solo lugar programa avisos** (`features/reminder/apply.ts`): cancela todo y
  programa solo lo elegido. No existe ningún otro camino que notifique.
- **El permiso se pide al activar**, nunca al abrir la app. Sin permiso, la fila queda con
  su aviso y un botón a los ajustes del sistema (estado "sin permiso" completo).
- **Al arrancar, la app resincroniza** el calendario de avisos sin pedir permiso nunca por
  su cuenta.
- Tests: programación por modo, días apagados, nunca dos avisos el mismo día en modo hora,
  y migración de ajustes (v6).
- Pendiente de aparato real: que el aviso llegue con la app cerrada (criterio 1) y la
  muñeca (task 015).

## Ciclo completo

- [x] Definir qué aplica
- [x] ~~Contenido y motor - n/a~~
- [x] App
- [ ] Reloj - cuando exista (task 015)
- [x] ~~Audio - n/a~~
- [ ] Accesibilidad - los días son interruptores con rol y estado; recorrido en aparato
      pendiente
- [x] ~~Sitio - n/a~~

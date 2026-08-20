# Task 037 - Señales de recogimiento

## Objetivo

Mostrar hechos del uso del aparato (salidas, duración, interrupciones), privados,
opcionales y sin nota.

## Dependencias

- Task 007, 010

## Contexto

Nadie en el nicho ayuda con lo único que de verdad cuesta: la atención. Medirlo mal es
peor que no medirlo: se vuelve examen.

[`../gamificacion.md`](../gamificacion.md), sección 6, manda: opt-in, en el dispositivo,
sin porcentaje, sin "tu mejor rosario", sin verbo que juzgue. Si se siente como examen, se
quita.

La decisión 8 dice esperar a esta fase y probarlo con gente que reza a diario antes de
publicarlo.

## Qué construir

### 1. Hechos

Si la app quedó en primer plano, cuánto duró, cuántas veces se salió. Nada más.

### 2. Cómo se muestra

"sin interrupciones", "3 salidas de la app", "38 minutos". Nunca "buena oración" ni "poco
recogido".

### 3. Apagado

Off por defecto. Se enciende en ajustes, con una línea de para qué. Se apaga en el mismo
sitio.

## Criterios de éxito

1. Off por defecto.
2. No existe puntaje, porcentaje ni comparación consigo mismo en tono de reproche.
3. Los datos no salen del dispositivo.
4. La pantalla pasa las cinco preguntas de `docs/gamificacion.md`, anotado en la task.
5. Hay un camino para quitar la feature entera si la prueba con usuarios falla.

## Decisiones tomadas (primera pasada, agosto 2026)

- **Off por defecto** (`recollectionEnabled: false`, ajustes v14). Se enciende en Ajustes
  con una línea de para qué; se apaga en el mismo interruptor.
- **Solo hechos observables**: cuántas veces la app pasó a segundo plano durante el rezo
  (AppState) y la duración que la pantalla final ya mostraba. Se muestran al terminar:
  "Sin interrupciones." o "N salidas de la app.", sin verbo que juzgue.
- El diario guarda `exits` (v7, nulo cuando está apagado): apagarlo deja de registrar y no
  borra lo que la persona ya tenía. Nada sale del aparato.
- **Prueba de las cinco preguntas**: sin porcentaje ni nota ni "tu mejor rosario"; el
  número es un acto contado del aparato; sin comparación; apagado, la app queda completa.
  Revisión doctrinal pasada.
- **Camino de retiro** (criterio 5): quitar el interruptor y la línea final. No hay datos
  que migrar ni borrar.
- **Pendiente**: la sesión de atención plena en Salud con el reloj (task 038) y la prueba
  con gente que reza a diario antes de publicarlo (decisión 8).

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - n/a: hechos del aparato, no del rezo
- [x] App
- [x] ~~Reloj - n/a: la 038 cubre el reloj~~
- [x] ~~Audio - n/a~~
- [x] Accesibilidad - texto plano en la pantalla final; el interruptor es fila nativa
- [x] ~~Sitio - n/a~~

## Fuentes

- [`../gamificacion.md`](../gamificacion.md) §6; CIC 2729; Montfort Rosa 42-43; decisión 8

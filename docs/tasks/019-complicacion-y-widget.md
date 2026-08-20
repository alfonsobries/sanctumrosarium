# Task 019 - Complicación y widget

## Objetivo

El misterio del día en la esfera del reloj y en la pantalla de inicio del teléfono, y
empezar en un toque.

## Dependencias

- Task 004, 016

## Contexto

Es el recordatorio menos invasivo posible: no notifica, está ahí. Encaja con el principio
de "recordatorio, no bombardeo".

En el reloj, la complicación también es lo que da a la app permiso para refrescarse en
segundo plano, así que tiene valor técnico además de valor de producto.

## Qué construir

### 1. Complicación

Misterio del día en las familias de complicación que tengan sentido, con el toque que abre
la app lista para empezar.

### 2. Widget de iOS

Misterio del día, y si hay Regla activa (fase 4), si ya se rezó hoy. Sin números grandes
ni rachas.

### 3. Relevancia

En el reloj, indicar cuándo la app es más útil (a la hora del recordatorio, al empezar un
entrenamiento) para que el sistema la ofrezca sola.

## Criterios de éxito

1. La complicación muestra el misterio correcto del día, incluidas las excepciones del
   tiempo litúrgico.
2. Tocarla abre la app lista para empezar, sin pasos intermedios.
3. El widget se actualiza al cambiar el día sin abrir la app.
4. Ninguna de las dos muestra rachas ni cifras de progreso destacadas.

## Decisiones tomadas (primera pasada del widget, agosto 2026)

- **Widget de iOS con `expo-widgets` (oficial, SDK 57)**, escrito en TSX sin Swift. La app
  programa la línea de tiempo de los próximos sesenta días con el mismo motor que reza
  (`mysteriesOfDay`): las excepciones del calendario coinciden por construcción
  (criterio 1) y el widget cambia de día sin abrir la app (criterio 3).
- Tocarlo abre el rezo directo (`widgetURL` a `sanctamaria://pray`, criterio 2). Tamaño
  chico: el grupo de misterios. Mediano: los cinco títulos. En la pantalla de bloqueo, una
  línea (`accessoryInline`) o el grupo con la nota del día (`accessoryRectangular`). Nada
  de rachas ni cifras (criterio 4).
- El texto se congela al programar: la línea de tiempo se rehace en cada arranque, en cada
  cambio de idioma o de Regla, y al terminar un Rosario. Si la app no se abre en sesenta
  días, el widget se queda en el último día programado: se anota como límite conocido.
- Con Regla activa, "Hoy ya rezaste." / "Prayed today." si el diario ya cuenta un Rosario
  o una decena hoy. La nota se calcula en la app y se congela en la entrada de hoy: no
  hace falta compartir el diario con la extensión. Sin Regla, o si hoy no se ha rezado, no
  dice nada: el widget no culpa.
- **Pendiente**: la complicación del reloj (con el bloque del reloj, tasks 015-016); la
  relevancia en el reloj; y el nombre y descripción del widget en la galería, que hoy van
  solo en español (la galería no se localiza por ajuste de la app).

## Ciclo completo

- [x] Definir qué aplica
- [x] ~~Contenido y motor - n/a~~ (reusa el calendario del motor)
- [x] App - widget de iOS
- [ ] Reloj - complicación (bloque del reloj)
- [x] ~~Audio - n/a~~
- [x] Accesibilidad - texto del sistema con Dynamic Type; lo lee el lector de pantalla
- [x] ~~Sitio - n/a~~

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

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a~~
- [ ] App - widget de iOS
- [ ] Reloj - complicación
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad - complicación y widget se leen con lector de pantalla
- [ ] ~~Sitio - n/a~~

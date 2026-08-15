# Task 026 - Fidelidad del mes

## Objetivo

Ver la constancia como un calendario que se llena, no como una racha que se rompe.

## Dependencias

- Task 025

## Contexto

Las rachas funcionan y por eso todo el mundo las usa. También son la crítica más citada
contra las apps de oración, y hay literatura católica seria sobre lo que le hacen a una
persona escrupulosa: medir la propia santidad por si dijiste el rosario hoy.

La salida no es quitar el seguimiento, es cambiar la unidad: **días fieles**, no días
seguidos. Un hueco es un hueco, no una pérdida. Detalle en
[`../gamificacion.md`](../gamificacion.md), sección 2.

## Qué construir

### 1. El calendario

El mes en curso, con los días fieles a la Regla marcados, y una línea sobria: "22 de 31
días". Sin número de racha grande.

### 2. Los huecos

Un día sin rezar deja el día vacío. Nada rojo, nada de animación de derrota, nada de
mensajes.

### 3. Modo pausa

Enfermedad, viaje, luto. Los días en pausa no cuentan como huecos y no piden explicación.

### 4. Volver

Al abrir la app tras faltar, la pantalla es la de siempre: el misterio de hoy. Ninguna
referencia a lo que no se hizo.

### 5. Historia

Meses anteriores consultables. Es historia, no deuda: no se suman, no se comparan, no se
felicitan.

## Criterios de éxito

1. La pantalla principal enseña el mes y los días fieles, sin número de racha destacado.
2. Faltar un día no produce ningún mensaje, notificación ni cambio de tono.
3. El modo pausa existe y se activa en un toque.
4. Los meses anteriores se consultan y no se comparan entre sí.
5. La pantalla pasa las cinco preguntas de `docs/gamificacion.md`, y queda anotado en la
   task.
6. Tests cubren: cálculo de días fieles con cada tipo de Regla, cambio de mes, zona
   horaria, y días en pausa.

## Decisiones abiertas

- Si la regla semanal se enseña por semanas en vez de por días. Recomendación: sí, la
  unidad de la vista sigue a la unidad de la Regla.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App
- [ ] Reloj - avance del día, sin historia
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad - el calendario se lee entero con lector de pantalla
- [ ] ~~Sitio - n/a~~
